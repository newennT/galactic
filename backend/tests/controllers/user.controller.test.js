const controller = require("../../src/controllers/user.controller");
const service = require("../../src/services/user.service");
const { ValidationError, UniqueConstraintError } = require("sequelize");

jest.mock("../../src/services/user.service");

function mockRes() {
  return {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
}

describe("UserController", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all users", async () => {
    const req = {};
    const res = mockRes();

    service.getAll.mockResolvedValue([{ id: 1 }]);

    await controller.getAll(req, res);

    expect(service.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "Liste utilisateurs récupérée",
      data: [{ id: 1 }],
    });
  });


  it("should return user by id", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    service.getById.mockResolvedValue({ id: 1 });

    await controller.getById(req, res);

    expect(service.getById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Utilisateur trouvé",
      data: { id: 1 },
    });
  });

  it("should return 404 if not found", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    service.getById.mockResolvedValue(null);

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });


  it("should create user", async () => {
    const req = {
      body: { username: "john", email: "john@mail.com" },
    };
    const res = mockRes();

    service.create.mockResolvedValue({
      id: 1,
      username: "john",
      email: "john@mail.com",
    });

    await controller.create(req, res);

    expect(service.create).toHaveBeenCalledWith(req.body);
    expect(res.json).toHaveBeenCalledWith({
      message: "Utilisateur john (john@mail.com) créé",
      data: {
        id: 1,
        username: "john",
        email: "john@mail.com",
      },
    });
  });

  it("should handle create validation error", async () => {
    const req = { body: {} };
    const res = mockRes();

    service.create.mockRejectedValue(new ValidationError("invalid"));

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });


  it("should update user", async () => {
    const req = {
      params: { id: 1 },
      body: { username: "updated" },
    };
    const res = mockRes();

    service.update.mockResolvedValue({
      id: 1,
      username: "updated",
    });

    await controller.update(req, res);

    expect(service.update).toHaveBeenCalledWith(1, req.body);
    expect(res.json).toHaveBeenCalledWith({
      message: "Utilisateur updated modifié",
      data: {
        id: 1,
        username: "updated",
      },
    });
  });

  it("should return 404 if update not found", async () => {
    const req = { params: { id: 1 }, body: {} };
    const res = mockRes();

    service.update.mockResolvedValue(null);

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should handle update validation error", async () => {
    const req = { params: { id: 1 }, body: {} };
    const res = mockRes();

    service.update.mockRejectedValue(
      new UniqueConstraintError({ message: "error" })
    );

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });


  it("should delete user", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    service.remove.mockResolvedValue({
      id: 1,
      username: "john",
    });

    await controller.remove(req, res);

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Utilisateur john supprimé",
      data: {
        id: 1,
        username: "john",
      },
    });
  });

  it("should return 404 if delete not found", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    service.remove.mockResolvedValue(null);

    await controller.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});