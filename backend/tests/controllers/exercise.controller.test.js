const ExerciseController = require("../../src/controllers/exercise.controller");
const ExerciseService = require("../../src/services/exercise.service");
const { ValidationError, UniqueConstraintError } = require("sequelize");

jest.mock("../../src/services/exercise.service");

describe("ExerciseController", () => {
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
    it("should return all exercises", async () => {
        const exercises = [{ id: 1 }];
        ExerciseService.getAll.mockResolvedValue(exercises);

        await ExerciseController.getAll(req, res);

        expect(ExerciseService.getAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: "La liste des exercices a été récupérée",
            data: exercises,
        });
    });

    it("should handle error in getAll", async () => {
        ExerciseService.getAll.mockRejectedValue(new Error("fail"));

        await ExerciseController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // GET BY ID
    // -------------------------
    it("should return exercise by id", async () => {
        req.params.id = 1;

        const exercise = { id: 1 };
        ExerciseService.getById.mockResolvedValue(exercise);

        await ExerciseController.getById(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: "Un exercice a bien été trouvé",
            data: exercise,
        });
    });

    it("should return 404 if not found", async () => {
        req.params.id = 1;

        ExerciseService.getById.mockResolvedValue(null);

        await ExerciseController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should handle error in getById", async () => {
        ExerciseService.getById.mockRejectedValue(new Error("fail"));

        await ExerciseController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // CREATE
    // -------------------------
    it("should create exercise", async () => {
        req.body = { question: "Q" };

        const created = { id: 1 };
        ExerciseService.create.mockResolvedValue(created);

        await ExerciseController.create(req, res);

        expect(ExerciseService.create).toHaveBeenCalledWith(req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "L'exercice a bien été créé",
            data: created,
        });
    });

    it("should return 400 on validation error", async () => {
        const err = new ValidationError("invalid");

        ExerciseService.create.mockRejectedValue(err);

        await ExerciseController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 on unique constraint error", async () => {
        const err = new UniqueConstraintError();

        ExerciseService.create.mockRejectedValue(err);

        await ExerciseController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on unknown error", async () => {
        ExerciseService.create.mockRejectedValue(new Error("fail"));

        await ExerciseController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // UPDATE
    // -------------------------
    it("should update exercise", async () => {
        req.params.id = 1;
        req.body = { question: "updated" };

        const updated = { id: 1 };

        ExerciseService.update.mockResolvedValue(updated);

        await ExerciseController.update(req, res);

        expect(ExerciseService.update).toHaveBeenCalledWith(1, req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "L'exercice a bien été modifié",
            data: updated,
        });
    });

    it("should return 404 if update returns null", async () => {
        ExerciseService.update.mockResolvedValue(null);

        await ExerciseController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 on validation error", async () => {
        ExerciseService.update.mockRejectedValue(
            new ValidationError("invalid")
        );

        await ExerciseController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 on unique constraint error", async () => {
        ExerciseService.update.mockRejectedValue(
            new UniqueConstraintError()
        );

        await ExerciseController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on update error", async () => {
        ExerciseService.update.mockRejectedValue(new Error("fail"));

        await ExerciseController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    // -------------------------
    // DELETE
    // -------------------------
    it("should delete exercise", async () => {
        req.params.id = 1;

        const deleted = { id: 1 };

        ExerciseService.delete.mockResolvedValue(deleted);

        await ExerciseController.delete(req, res);

        expect(ExerciseService.delete).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            message: "L'exercice a bien été supprimé",
            data: deleted,
        });
    });

    it("should return 404 if delete returns null", async () => {
        req.params.id = 1;

        ExerciseService.delete.mockResolvedValue(null);

        await ExerciseController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should handle delete error", async () => {
        ExerciseService.delete.mockRejectedValue(new Error("fail"));

        await ExerciseController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});