const PairsController = require("../../src/controllers/pairs.controller");
const PairsService = require("../../src/services/pairs.service");
const { ValidationError, UniqueConstraintError } = require("sequelize");

jest.mock("../../src/services/pairs.service");

describe("PairsController", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {},
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
    it("should return all pairs", async () => {
        const pairs = [{ id_response: 1 }];

        PairsService.getAll.mockResolvedValue(pairs);

        await PairsController.getAll(req, res);

        expect(PairsService.getAll).toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith({
            message: "La liste des options a été récupérée",
            data: pairs,
        });
    });

    it("should handle getAll error", async () => {
        PairsService.getAll.mockRejectedValue(new Error("fail"));

        await PairsController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // GET BY ID
    // -------------------------
    it("should return pair by id", async () => {
        req.params.id = 1;

        PairsService.getById.mockResolvedValue({ id_response: 1 });

        await PairsController.getById(req, res);

        expect(PairsService.getById).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            message: "Une option de type pairs a bien été trouvée",
            data: { id_response: 1 },
        });
    });

    it("should return 404 if pair not found", async () => {
        req.params.id = 1;

        PairsService.getById.mockResolvedValue(null);

        await PairsController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            message: "L'option de type pairs demandée n'a pas été trouvée",
        });
    });

    it("should handle getById error", async () => {
        PairsService.getById.mockRejectedValue(new Error("fail"));

        await PairsController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // CREATE
    // -------------------------
    it("should create pair", async () => {
        req.body = { content: "A" };

        PairsService.create.mockResolvedValue({ id_response: 1 });

        await PairsController.create(req, res);

        expect(PairsService.create).toHaveBeenCalledWith(req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "L'option de type pairs a bien été créée",
            data: { id_response: 1 },
        });
    });

    it("should return 400 on validation error", async () => {
        const err = new ValidationError("invalid");
        PairsService.create.mockRejectedValue(err);

        await PairsController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on unknown create error", async () => {
        PairsService.create.mockRejectedValue(new Error("fail"));

        await PairsController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // UPDATE
    // -------------------------
    it("should update pair", async () => {
        req.params.id = 1;
        req.body = { content: "Updated" };

        PairsService.update.mockResolvedValue({ id_response: 1 });

        await PairsController.update(req, res);

        expect(PairsService.update).toHaveBeenCalledWith(1, req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "L'option de type pairs a bien été modifiée",
            data: { id_response: 1 },
        });
    });

    it("should return 404 if update not found", async () => {
        req.params.id = 1;

        PairsService.update.mockResolvedValue(null);

        await PairsController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 on update validation error", async () => {
        PairsService.update.mockRejectedValue(new ValidationError("invalid"));

        await PairsController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on update error", async () => {
        PairsService.update.mockRejectedValue(new Error("fail"));

        await PairsController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // DELETE
    // -------------------------
    it("should delete pair", async () => {
        req.params.id = 1;

        PairsService.delete.mockResolvedValue({ id_response: 1 });

        await PairsController.delete(req, res);

        expect(PairsService.delete).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            message: "L'option de type pairs a bien été supprimée",
            data: { id_response: 1 },
        });
    });

    it("should return 404 if delete not found", async () => {
        req.params.id = 1;

        PairsService.delete.mockResolvedValue(null);

        await PairsController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should handle delete error", async () => {
        PairsService.delete.mockRejectedValue(new Error("fail"));

        await PairsController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});