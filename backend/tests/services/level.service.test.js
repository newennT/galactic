const LevelService = require("../../src/services/level.service");

jest.mock("../../src/db/models", () => ({
    Level: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
    Chapter: {},
}));

jest.mock("sequelize", () => ({
    Op: {
        like: Symbol("like"),
    },
}));

const { Level } = require("../../src/db/models");
const { Op } = require("sequelize");

describe("LevelService", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------
    // GET ALL (no filter)
    // -------------------------
    it("should return all levels with include", async () => {
        const levels = [{ id_level: 1 }];

        Level.findAll.mockResolvedValue(levels);

        const result = await LevelService.getAll({});

        expect(Level.findAll).toHaveBeenCalledWith({
            include: [{ model: expect.anything() }],
            order: [["title", "ASC"]],
        });

        expect(result).toEqual(levels);
    });

    // -------------------------
    // GET ALL (filter by title)
    // -------------------------
    it("should filter levels by title", async () => {
        const levels = [{ id_level: 1 }];

        Level.findAll.mockResolvedValue(levels);

        const result = await LevelService.getAll({
            title: "math",
        });

        expect(Level.findAll).toHaveBeenCalledWith({
            where: {
                title: {
                    [Op.like]: "%math%",
                },
            },
            order: [["title", "ASC"]],
        });

        expect(result).toEqual(levels);
    });

    // -------------------------
    // GET BY ID
    // -------------------------
    it("should return level by id", async () => {
        const level = { id_level: 1 };

        Level.findByPk.mockResolvedValue(level);

        const result = await LevelService.getById(1);

        expect(Level.findByPk).toHaveBeenCalledWith(1, {
            include: [{ model: expect.anything() }],
        });

        expect(result).toEqual(level);
    });

    // -------------------------
    // CREATE
    // -------------------------
    it("should create level", async () => {
        const data = { title: "Level 1" };

        Level.create.mockResolvedValue({ id_level: 1 });

        const result = await LevelService.create(data);

        expect(Level.create).toHaveBeenCalledWith(data);
        expect(result).toEqual({ id_level: 1 });
    });

    // -------------------------
    // UPDATE
    // -------------------------
    it("should update level", async () => {
        Level.update.mockResolvedValue([1]);
        Level.findByPk.mockResolvedValue({ id_level: 1 });

        const result = await LevelService.update(1, {
            title: "Updated",
        });

        expect(Level.update).toHaveBeenCalledWith(
            { title: "Updated" },
            {
                where: { id_level: 1 },
            }
        );

        expect(Level.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual({ id_level: 1 });
    });

    // -------------------------
    // DELETE (found)
    // -------------------------
    it("should delete level if exists", async () => {
        const level = { id_level: 1 };

        Level.findByPk.mockResolvedValue(level);
        Level.destroy.mockResolvedValue(1);

        const result = await LevelService.delete(1);

        expect(Level.destroy).toHaveBeenCalledWith({
            where: { id_level: 1 },
        });

        expect(result).toEqual(level);
    });

    // -------------------------
    // DELETE (not found)
    // -------------------------
    it("should return null if level not found", async () => {
        Level.findByPk.mockResolvedValue(null);

        const result = await LevelService.delete(1);

        expect(result).toBeNull();
        expect(Level.destroy).not.toHaveBeenCalled();
    });
});