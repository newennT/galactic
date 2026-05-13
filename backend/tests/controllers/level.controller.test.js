const LevelController = require("../../src/controllers/level.controller");
const LevelService = require("../../src/services/level.service");
const { ValidationError, UniqueConstraintError } = require("sequelize");

jest.mock("../../src/services/level.service");

describe("LevelController", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {},
            query: {},
            body: {},
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        jest.clearAllMocks();
    });

    // -------------------------
    // GET ALL
    // -------------------------
    it("should return all levels without filter", async () => {
        const levels = [{ id_level: 1 }];

        LevelService.getAll.mockResolvedValue(levels);

        await LevelController.getAll(req, res);

        expect(LevelService.getAll).toHaveBeenCalledWith({});

        expect(res.json).toHaveBeenCalledWith({
            message: "La liste des niveaux a été récupérée",
            data: levels,
        });
    });

    it("should return filtered message when title query exists", async () => {
        req.query.title = "math";

        const levels = [{ id_level: 1 }, { id_level: 2 }];

        LevelService.getAll.mockResolvedValue(levels);

        await LevelController.getAll(req, res);

        expect(LevelService.getAll).toHaveBeenCalledWith({ title: "math" });

        expect(res.json).toHaveBeenCalledWith({
            message: "Il y a 2 niveaux qui correspondent au titre math",
            data: levels,
        });
    });

    it("should return 500 on getAll error", async () => {
        LevelService.getAll.mockRejectedValue(new Error("fail"));

        await LevelController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // GET BY ID
    // -------------------------
    it("should return level by id", async () => {
        req.params.id = 1;

        const level = { id_level: 1 };

        LevelService.getById.mockResolvedValue(level);

        await LevelController.getById(req, res);

        expect(LevelService.getById).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            message: "Un niveau a bien été trouvé",
            data: level,
        });
    });

    it("should return 404 if level not found", async () => {
        req.params.id = 1;

        LevelService.getById.mockResolvedValue(null);

        await LevelController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on getById error", async () => {
        req.params.id = 1;

        LevelService.getById.mockRejectedValue(new Error("fail"));

        await LevelController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // CREATE
    // -------------------------
    it("should create level", async () => {
        req.body = { title: "Level 1" };

        const level = { id_level: 1 };

        LevelService.create.mockResolvedValue(level);

        await LevelController.create(req, res);

        expect(LevelService.create).toHaveBeenCalledWith(req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "Le niveau Level 1 a bien été créé",
            data: level,
        });
    });

    it("should return 400 on validation error", async () => {
        req.body = { title: "X" };

        LevelService.create.mockRejectedValue(
            new ValidationError("invalid")
        );

        await LevelController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 on unique constraint error", async () => {
        req.body = { title: "X" };

        LevelService.create.mockRejectedValue(
            new UniqueConstraintError({ message: "duplicate" })
        );

        await LevelController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on create error", async () => {
        LevelService.create.mockRejectedValue(new Error("fail"));

        await LevelController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // UPDATE
    // -------------------------
    it("should update level", async () => {
        req.params.id = 1;
        req.body = { title: "Updated" };

        const level = { id_level: 1, title: "Updated" };

        LevelService.update.mockResolvedValue(level);

        await LevelController.update(req, res);

        expect(LevelService.update).toHaveBeenCalledWith(1, req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "Le niveau Updated a bien été modifié",
            data: level,
        });
    });

    it("should return 404 if update not found", async () => {
        req.params.id = 1;

        LevelService.update.mockResolvedValue(null);

        await LevelController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 on update validation error", async () => {
        req.params.id = 1;

        LevelService.update.mockRejectedValue(
            new ValidationError("invalid")
        );

        await LevelController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on update error", async () => {
        req.params.id = 1;

        LevelService.update.mockRejectedValue(new Error("fail"));

        await LevelController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // DELETE
    // -------------------------
    it("should delete level", async () => {
        req.params.id = 1;

        const level = { id_level: 1, title: "Level 1" };

        LevelService.delete.mockResolvedValue(level);

        await LevelController.delete(req, res);

        expect(LevelService.delete).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            message: "Le niveau Level 1 a bien été supprimé",
            data: level,
        });
    });

    it("should return 404 if delete not found", async () => {
        req.params.id = 1;

        LevelService.delete.mockResolvedValue(null);

        await LevelController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on delete error", async () => {
        req.params.id = 1;

        LevelService.delete.mockRejectedValue(new Error("fail"));

        await LevelController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});