const service = require("../../src/services/uniqueResponse.service");

jest.mock("../../src/db/models", () => ({
  UniqueResponse: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Exercise: {},
}));

const { UniqueResponse } = require("../../src/db/models");

describe("UniqueResponseService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // GET ALL
  // -------------------------
  it("should return all unique responses", async () => {
    const data = [{ id: 1 }];

    UniqueResponse.findAll.mockResolvedValue(data);

    const result = await service.getAll();

    expect(UniqueResponse.findAll).toHaveBeenCalledWith({
      order: ["id_page"],
      include: [{ model: expect.anything() }],
    });

    expect(result).toEqual(data);
  });

  // -------------------------
  // GET BY ID
  // -------------------------
  it("should return unique response by id", async () => {
    const item = { id: 1 };

    UniqueResponse.findByPk.mockResolvedValue(item);

    const result = await service.getById(1);

    expect(UniqueResponse.findByPk).toHaveBeenCalledWith(1, {
      include: [{ model: expect.anything() }],
    });

    expect(result).toEqual(item);
  });

  it("should return null if not found", async () => {
    UniqueResponse.findByPk.mockResolvedValue(null);

    const result = await service.getById(1);

    expect(result).toBeNull();
  });

  // -------------------------
  // CREATE
  // -------------------------
  it("should create unique response", async () => {
    const data = { content: "A" };

    UniqueResponse.create.mockResolvedValue({ id: 1 });

    const result = await service.create(data);

    expect(UniqueResponse.create).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: 1 });
  });

  // -------------------------
  // UPDATE
  // -------------------------
  it("should update unique response", async () => {
    const data = { content: "B" };

    UniqueResponse.update.mockResolvedValue([1]);
    UniqueResponse.findByPk.mockResolvedValue({ id: 1 });

    const result = await service.update(1, data);

    expect(UniqueResponse.update).toHaveBeenCalledWith(data, {
      where: { id_response: 1 },
    });

    expect(UniqueResponse.findByPk).toHaveBeenCalledWith(1);

    expect(result).toEqual({ id: 1 });
  });

  // -------------------------
  // DELETE
  // -------------------------
  it("should delete unique response", async () => {
    const item = { id_response: 1 };

    UniqueResponse.findByPk.mockResolvedValue(item);
    UniqueResponse.destroy.mockResolvedValue(1);

    const result = await service.remove(1);

    expect(UniqueResponse.destroy).toHaveBeenCalledWith({
      where: { id_response: 1 },
    });

    expect(result).toEqual(item);
  });

  it("should return null if item not found", async () => {
    UniqueResponse.findByPk.mockResolvedValue(null);

    const result = await service.remove(1);

    expect(result).toBeNull();
  });
});