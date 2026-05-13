const LessonController = require("../../src/controllers/lesson.controller");
const LessonService = require("../../src/services/lesson.service");
const { ValidationError, UniqueConstraintError } = require("sequelize");

jest.mock("../../src/services/lesson.service");

describe("LessonController", () => {

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
    it("should return all lessons", async () => {
        const lessons = [{ id: 1 }];
        LessonService.getAll.mockResolvedValue(lessons);

        await LessonController.getAll(req, res);

        expect(LessonService.getAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: "La liste des leçons a été récupérée",
            data: lessons,
        });
    });

    it("should return 500 on getAll error", async () => {
        LessonService.getAll.mockRejectedValue(new Error("fail"));

        await LessonController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // GET BY ID
    // -------------------------
    it("should return lesson by id", async () => {
        req.params.id = 1;

        LessonService.getById.mockResolvedValue({ id: 1 });

        await LessonController.getById(req, res);

        expect(LessonService.getById).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            message: "Une leçon a bien été trouvée",
            data: { id: 1 },
        });
    });

    it("should return 404 if lesson not found", async () => {
        req.params.id = 1;

        LessonService.getById.mockResolvedValue(null);

        await LessonController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on getById error", async () => {
        req.params.id = 1;

        LessonService.getById.mockRejectedValue(new Error("fail"));

        await LessonController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // CREATE
    // -------------------------
    it("should create lesson", async () => {
        req.body = { title: "T" };

        LessonService.create.mockResolvedValue({ id: 1 });

        await LessonController.create(req, res);

        expect(LessonService.create).toHaveBeenCalledWith(req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "La leçon a bien été créée",
            data: { id: 1 },
        });
    });

    it("should return 400 on validation error", async () => {
        req.body = {};

        LessonService.create.mockRejectedValue(
            new ValidationError("invalid")
        );

        await LessonController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 on unique constraint error", async () => {
        req.body = {};

        LessonService.create.mockRejectedValue(
            new UniqueConstraintError({ message: "duplicate" })
        );

        await LessonController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on create error", async () => {
        LessonService.create.mockRejectedValue(new Error("fail"));

        await LessonController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // UPDATE
    // -------------------------
    it("should update lesson", async () => {
        req.params.id = 1;
        req.body = { title: "Updated" };

        LessonService.update.mockResolvedValue({ id: 1 });

        await LessonController.update(req, res);

        expect(LessonService.update).toHaveBeenCalledWith(1, req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "La leçon a bien été modifiée",
            data: { id: 1 },
        });
    });

    it("should return 404 on update if not found", async () => {
        req.params.id = 1;

        LessonService.update.mockResolvedValue(null);

        await LessonController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 on update validation error", async () => {
        req.params.id = 1;

        LessonService.update.mockRejectedValue(
            new ValidationError("invalid")
        );

        await LessonController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on update error", async () => {
        req.params.id = 1;

        LessonService.update.mockRejectedValue(new Error("fail"));

        await LessonController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // DELETE
    // -------------------------
    it("should delete lesson", async () => {
        req.params.id = 1;

        LessonService.delete.mockResolvedValue({ id: 1 });

        await LessonController.delete(req, res);

        expect(LessonService.delete).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            message: "La leçon a bien été supprimée",
            data: { id: 1 },
        });
    });

    it("should return 404 if delete not found", async () => {
        req.params.id = 1;

        LessonService.delete.mockResolvedValue(null);

        await LessonController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on delete error", async () => {
        req.params.id = 1;

        LessonService.delete.mockRejectedValue(new Error("fail"));

        await LessonController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});