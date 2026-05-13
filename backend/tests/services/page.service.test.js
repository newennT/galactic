const PageService = require("../../src/services/page.service");

jest.mock("../../src/db/models", () => ({
    Page: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
    Lesson: {},
    Exercise: {},
}));

const {
    Page,
} = require("../../src/db/models");

describe("PageService", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------
    // baseInclude
    // -------------------------
    it("should return base include", () => {
        const result = PageService.baseInclude();

        expect(result).toEqual([
            { model: require("../../src/db/models").Lesson },
            { model: require("../../src/db/models").Exercise },
        ]);
    });

    // -------------------------
    // GET ALL
    // -------------------------
    it("should return all pages ordered", async () => {
        const pages = [{ id_page: 1 }];
        Page.findAll.mockResolvedValue(pages);

        const result = await PageService.getAll();

        expect(Page.findAll).toHaveBeenCalledWith({
            order: [["order_index", "ASC"]],
            include: PageService.baseInclude(),
        });

        expect(result).toEqual(pages);
    });

    // -------------------------
    // GET BY ID
    // -------------------------
    it("should return page by id", async () => {
        const page = { id_page: 1 };
        Page.findByPk.mockResolvedValue(page);

        const result = await PageService.getById(1);

        expect(Page.findByPk).toHaveBeenCalledWith(1, {
            include: PageService.baseInclude(),
        });

        expect(result).toEqual(page);
    });

    it("should return null if page not found", async () => {
        Page.findByPk.mockResolvedValue(null);

        const result = await PageService.getById(1);

        expect(result).toBeNull();
    });

    // -------------------------
    // CREATE
    // -------------------------
    it("should create page", async () => {
        const data = { title: "Page 1" };
        Page.create.mockResolvedValue({ id_page: 1 });

        const result = await PageService.create(data);

        expect(Page.create).toHaveBeenCalledWith(data);
        expect(result).toEqual({ id_page: 1 });
    });

    // -------------------------
    // UPDATE
    // -------------------------
    it("should update and return page", async () => {
        const updated = { id_page: 1 };

        Page.update.mockResolvedValue([1]);
        Page.findByPk.mockResolvedValue(updated);

        const result = await PageService.update(1, { title: "Updated" });

        expect(Page.update).toHaveBeenCalledWith(
            { title: "Updated" },
            { where: { id_page: 1 } }
        );

        expect(Page.findByPk).toHaveBeenCalledWith(1, {
            include: PageService.baseInclude(),
        });

        expect(result).toEqual(updated);
    });

    // -------------------------
    // DELETE
    // -------------------------
    it("should delete page and return it", async () => {
        const page = { id_page: 1 };

        Page.findByPk.mockResolvedValue(page);
        Page.destroy.mockResolvedValue(1);

        const result = await PageService.delete(1);

        expect(Page.destroy).toHaveBeenCalledWith({
            where: { id_page: 1 },
        });

        expect(result).toEqual(page);
    });

    it("should return null if page not found", async () => {
        Page.findByPk.mockResolvedValue(null);

        const result = await PageService.delete(1);

        expect(result).toBeNull();
    });
});