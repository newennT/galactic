const PageController = require("../../src/controllers/page.controller");
const PageService = require("../../src/services/page.service");
const { ValidationError, UniqueConstraintError } = require("sequelize");

jest.mock("../../src/services/page.service");

describe("PageController", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {},
            query: {},
            body: {},
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        jest.clearAllMocks();
    });

    it("should return all pages", async () => {
        const pages = [{ id_page: 1 }];

        PageService.getAll.mockResolvedValue(pages);

        await PageController.getAll(req, res);

        expect(PageService.getAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            message: "La liste des pages a été récupérée",
            data: pages,
        });
    });


    it("should return page by id", async () => {
        req.params.id = 1;

        PageService.getById.mockResolvedValue({ id_page: 1 });

        await PageController.getById(req, res);

        expect(PageService.getById).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith({
            message: "Une page a bien été trouvée",
            data: { id_page: 1 },
        });
    });

    it("should return 404 if page not found", async () => {
        req.params.id = 1;

        PageService.getById.mockResolvedValue(null);

        await PageController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: "La page demandée n'a pas été trouvée",
        });
    });


    it("should create page", async () => {
        req.body = { title: "Page" };

        PageService.create.mockResolvedValue({ id_page: 1 });

        await PageController.create(req, res);

        expect(PageService.create).toHaveBeenCalledWith(req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "La page a bien été créée",
            data: { id_page: 1 },
        });
    });

    it("should return 400 on validation error", async () => {
        req.body = {};

        const err = new ValidationError("invalid");
        PageService.create.mockRejectedValue(err);

        await PageController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });


    it("should update page", async () => {
        req.params.id = 1;
        req.body = { title: "Updated" };

        PageService.update.mockResolvedValue({ id_page: 1 });

        await PageController.update(req, res);

        expect(PageService.update).toHaveBeenCalledWith(1, req.body);

        expect(res.json).toHaveBeenCalledWith({
            message: "La page a bien été modifiée",
            data: { id_page: 1 },
        });
    });

    it("should return 404 if update not found", async () => {
        req.params.id = 1;

        PageService.update.mockResolvedValue(null);

        await PageController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 on update validation error", async () => {
        const err = new ValidationError("invalid");

        PageService.update.mockRejectedValue(err);

        await PageController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should delete page", async () => {
        req.params.id = 1;

        PageService.delete.mockResolvedValue({ id_page: 1 });

        await PageController.delete(req, res);

        expect(PageService.delete).toHaveBeenCalledWith(1);

        expect(res.json).toHaveBeenCalledWith({
            message: "La page a bien été supprimée",
            data: { id_page: 1 },
        });
    });

    it("should return 404 if delete not found", async () => {
        req.params.id = 1;

        PageService.delete.mockResolvedValue(null);

        await PageController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

});