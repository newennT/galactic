const PairsService = require("../../src/services/pairs.service");

jest.mock("../../src/db/models", () => ({
    Pairs: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
    Exercise: {},
}));

const { Pairs } = require("../../src/db/models");

describe("PairsService", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------
    // baseInclude
    // -------------------------
    it("should return base include", () => {
        const result = PairsService.baseInclude();

        expect(result).toEqual([
            { model: require("../../src/db/models").Exercise },
        ]);
    });

    // -------------------------
    // GET ALL
    // -------------------------
    it("should return all pairs ordered", async () => {
        const pairs = [{ id_response: 1 }];

        Pairs.findAll.mockResolvedValue(pairs);

        const result = await PairsService.getAll();

        expect(Pairs.findAll).toHaveBeenCalledWith({
            order: [["id_page", "ASC"]],
            include: PairsService.baseInclude(),
        });

        expect(result).toEqual(pairs);
    });

    // -------------------------
    // GET BY ID
    // -------------------------
    it("should return pair by id", async () => {
        const pair = { id_response: 1 };

        Pairs.findByPk.mockResolvedValue(pair);

        const result = await PairsService.getById(1);

        expect(Pairs.findByPk).toHaveBeenCalledWith(1, {
            include: PairsService.baseInclude(),
        });

        expect(result).toEqual(pair);
    });

    it("should return null if pair not found", async () => {
        Pairs.findByPk.mockResolvedValue(null);

        const result = await PairsService.getById(1);

        expect(result).toBeNull();
    });

    // -------------------------
    // CREATE
    // -------------------------
    it("should create pair", async () => {
        const data = {
            content: "A",
            pair_key: "1",
        };

        Pairs.create.mockResolvedValue({ id_response: 1 });

        const result = await PairsService.create(data);

        expect(Pairs.create).toHaveBeenCalledWith(data);
        expect(result).toEqual({ id_response: 1 });
    });

    // -------------------------
    // UPDATE
    // -------------------------
    it("should update pair and return it", async () => {
        const updated = { id_response: 1 };

        Pairs.update.mockResolvedValue([1]);
        Pairs.findByPk.mockResolvedValue(updated);

        const result = await PairsService.update(1, {
            content: "Updated",
        });

        expect(Pairs.update).toHaveBeenCalledWith(
            { content: "Updated" },
            { where: { id_response: 1 } }
        );

        expect(Pairs.findByPk).toHaveBeenCalledWith(1, {
            include: PairsService.baseInclude(),
        });

        expect(result).toEqual(updated);
    });

    // -------------------------
    // DELETE
    // -------------------------
    it("should delete pair and return it", async () => {
        const pair = { id_response: 1 };

        Pairs.findByPk.mockResolvedValue(pair);
        Pairs.destroy.mockResolvedValue(1);

        const result = await PairsService.delete(1);

        expect(Pairs.destroy).toHaveBeenCalledWith({
            where: { id_response: 1 },
        });

        expect(result).toEqual(pair);
    });

    it("should return null if pair not found", async () => {
        Pairs.findByPk.mockResolvedValue(null);

        const result = await PairsService.delete(1);

        expect(result).toBeNull();
    });
});