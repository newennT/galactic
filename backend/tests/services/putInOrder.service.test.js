const PutInOrderService = require("../../src/services/putInOrder.service");

jest.mock("../../src/db/models", () => ({
    PutInOrder: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
    Exercise: {},
}));

const { PutInOrder } = require("../../src/db/models");

describe("PutInOrderService", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------
    // GET ALL
    // -------------------------
    it("should return all putInOrder items", async () => {
        const items = [{ id_response: 1 }];

        PutInOrder.findAll.mockResolvedValue(items);

        const result = await PutInOrderService.getAll();

        expect(PutInOrder.findAll).toHaveBeenCalledWith({
            order: ["id_page"],
            include: [{ model: require("../../src/db/models").Exercise }],
        });

        expect(result).toEqual(items);
    });

    // -------------------------
    // GET BY ID
    // -------------------------
    it("should return item by id", async () => {
        const item = { id_response: 1 };

        PutInOrder.findByPk.mockResolvedValue(item);

        const result = await PutInOrderService.getById(1);

        expect(PutInOrder.findByPk).toHaveBeenCalledWith(1, {
            include: [{ model: require("../../src/db/models").Exercise }],
        });

        expect(result).toEqual(item);
    });

    it("should return null if item not found", async () => {
        PutInOrder.findByPk.mockResolvedValue(null);

        const result = await PutInOrderService.getById(1);

        expect(result).toBeNull();
    });

    // -------------------------
    // CREATE
    // -------------------------
    it("should create item", async () => {
        const data = { content: "A" };

        PutInOrder.create.mockResolvedValue({ id_response: 1 });

        const result = await PutInOrderService.create(data);

        expect(PutInOrder.create).toHaveBeenCalledWith(data);
        expect(result).toEqual({ id_response: 1 });
    });

    // -------------------------
    // UPDATE
    // -------------------------
    it("should update item and return it", async () => {
        const updated = { id_response: 1 };

        PutInOrder.update.mockResolvedValue([1]);
        PutInOrder.findByPk.mockResolvedValue(updated);

        const result = await PutInOrderService.update(1, {
            content: "Updated",
        });

        expect(PutInOrder.update).toHaveBeenCalledWith(
            { content: "Updated" },
            { where: { id_response: 1 } }
        );

        expect(PutInOrder.findByPk).toHaveBeenCalledWith(1);

        expect(result).toEqual(updated);
    });

    // -------------------------
    // DELETE (remove)
    // -------------------------
    it("should delete item and return it", async () => {
        const item = { id_response: 1 };

        PutInOrder.findByPk.mockResolvedValue(item);
        PutInOrder.destroy.mockResolvedValue(1);

        const result = await PutInOrderService.remove(1);

        expect(PutInOrder.destroy).toHaveBeenCalledWith({
            where: { id_response: 1 },
        });

        expect(result).toEqual(item);
    });

    it("should return null if item not found", async () => {
        PutInOrder.findByPk.mockResolvedValue(null);

        const result = await PutInOrderService.remove(1);

        expect(result).toBeNull();
    });
});