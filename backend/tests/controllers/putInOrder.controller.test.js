const controller = require("../../src/controllers/putInOrder.controller");
const service = require("../../src/services/putInOrder.service");
const { ValidationError, UniqueConstraintError } = require("sequelize");

jest.mock("../../src/services/putInOrder.service");

function mockRes() {
  return {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };
}

describe("PutInOrderController", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all items", async () => {
    const req = {};
    const res = mockRes();

    service.getAll.mockResolvedValue([{ id: 1 }]);

    await controller.getAll(req, res);

    expect(service.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Liste récupérée", data: [{ id: 1 }] });
  });


  it("should return item by id", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    service.getById.mockResolvedValue({ id: 1 });

    await controller.getById(req, res);

    expect(service.getById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ message: "Option trouvée", data: { id: 1 } });
  });

  it("should return 404 if not found", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    service.getById.mockResolvedValue(null);

    await controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should create item", async () => {
    const req = { body: { content: "A" } };
    const res = mockRes();

    service.create.mockResolvedValue({ id: 1 });

    await controller.create(req, res);

    expect(service.create).toHaveBeenCalledWith({ content: "A" });
    expect(res.json).toHaveBeenCalledWith({ message: "Créé avec succès", data: { id: 1 } });
  });

  it("should return 400 on validation error", async () => {
    const req = { body: {} };
    const res = mockRes();

    service.create.mockRejectedValue(new ValidationError("invalid"));

    await controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

it("should update item", async () => {
    const req = { params: { id: 1 }, body: { content: "B" } };
    const res = mockRes();

    service.update.mockResolvedValue({ id: 1 });

    await controller.update(req, res);

    expect(service.update).toHaveBeenCalledWith(1, { content: "B" });
    expect(res.json).toHaveBeenCalledWith({ message: "Mis à jour", data: { id: 1 }});
  });

  it("should return 404 on update not found", async () => {
    const req = { params: { id: 1 }, body: {} };
    const res = mockRes();

    service.update.mockResolvedValue(null);

    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 400 on update validation error", async () => {
    const req = { params: { id: 1 }, body: {} };
    const res = mockRes();
    const sequelize = require("sequelize");

    service.update.mockRejectedValue(new sequelize.UniqueConstraintError({ message: "error" }));
    await controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should delete item", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    service.remove.mockResolvedValue({ id: 1 });

    await controller.remove(req, res);

    expect(service.remove).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Supprimé",
      data: { id: 1 },
    });
  });

  it("should return 404 on delete not found", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();

    service.remove.mockResolvedValue(null);

    await controller.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

});