const service = require("../../src/services/user.service");

jest.mock("../../src/db/models", () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Chapter: {},
}));

const { User } = require("../../src/db/models");

describe("UserService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------
  // GET ALL
  // -------------------------
  it("should return all users", async () => {
    const data = [{ id: 1 }];

    User.findAll.mockResolvedValue(data);

    const result = await service.getAll();

    expect(User.findAll).toHaveBeenCalledWith({
      order: ["last_login"],
      include: [
        {
          model: expect.anything(),
          through: { attributes: [] },
        },
      ],
    });

    expect(result).toEqual(data);
  });

  // -------------------------
  // GET BY ID
  // -------------------------
  it("should return user by id", async () => {
    const user = { id: 1 };

    User.findByPk.mockResolvedValue(user);

    const result = await service.getById(1);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual(user);
  });

  it("should return null if user not found", async () => {
    User.findByPk.mockResolvedValue(null);

    const result = await service.getById(1);

    expect(result).toBeNull();
  });

  // -------------------------
  // CREATE
  // -------------------------
  it("should create user", async () => {
    const data = { name: "John" };

    User.create.mockResolvedValue({ id: 1 });

    const result = await service.create(data);

    expect(User.create).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: 1 });
  });

  // -------------------------
  // UPDATE
  // -------------------------
  it("should update user", async () => {
    const data = { name: "Updated" };

    User.update.mockResolvedValue([1]);
    User.findByPk.mockResolvedValue({ id: 1 });

    const result = await service.update(1, data);

    expect(User.update).toHaveBeenCalledWith(data, {
      where: { id_user: 1 },
    });

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  // -------------------------
  // DELETE
  // -------------------------
  it("should delete user", async () => {
    const user = { id_user: 1 };

    User.findByPk.mockResolvedValue(user);
    User.destroy.mockResolvedValue(1);

    const result = await service.remove(1);

    expect(User.destroy).toHaveBeenCalledWith({
      where: { id_user: 1 },
    });

    expect(result).toEqual(user);
  });

  it("should return null if user not found", async () => {
    User.findByPk.mockResolvedValue(null);

    const result = await service.remove(1);

    expect(result).toBeNull();
  });
});