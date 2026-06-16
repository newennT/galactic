const ChapterController = require("../../src/controllers/chapter.controller");
const { chapterService } = require("../../src/services");

jest.mock("../../src/services", () => ({
  chapterService: {
    getAll: jest.fn(),
    getById: jest.fn(),
    delete: jest.fn(),
    reorder: jest.fn(),
    createFull: jest.fn(),
    replaceFull: jest.fn(),
  }
}));

describe("ChapterController", () => {

    let req;
    let res;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = { json: jest.fn(), status: jest.fn().mockReturnThis(), };
        jest.clearAllMocks();
    });


    it("should return all chapters", async () => {
        const chapters = [{ id: 1 }];
        chapterService.getAll.mockResolvedValue(chapters);
        await ChapterController.getAll(req, res);

        expect(chapterService.getAll).toHaveBeenCalled();
    });

    it("should return 500 if getAll fails", async () => {
        const error = new Error("fail");
        chapterService.getAll.mockRejectedValue(error);
        await ChapterController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });


    it("should return chapter by id", async () => {
        const chapter = { id: 1 };
        req.params.id = 1;
        chapterService.getById.mockResolvedValue(chapter);

        await ChapterController.getById(req, res);

        expect(chapterService.getById).toHaveBeenCalledWith(1);
    });

    it("should return 404 if chapter not found", async () => {
        req.params.id = 1;
        chapterService.getById.mockResolvedValue(null);

        await ChapterController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 if getById fails", async () => {
        const error = new Error("fail");
        req.params.id = 1;
        chapterService.getById.mockRejectedValue(error);

        await ChapterController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should delete chapter", async () => {
        const chapter = { id: 1 };
        req.params.id = 1;
        chapterService.delete.mockResolvedValue(chapter);

        await ChapterController.delete(req, res);

        expect(chapterService.delete).toHaveBeenCalledWith(1);
    });

    it("should return 404 if delete target not found", async () => {
        req.params.id = 1;
        chapterService.delete.mockResolvedValue(null);

        await ChapterController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 if delete fails", async () => {
        const error = new Error("fail");
        req.params.id = 1;
        chapterService.delete.mockRejectedValue(error);

        await ChapterController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });


    it("should reorder chapters", async () => {
        req.body = [{ id_chapter: 1, order: 2 }];
        chapterService.reorder.mockResolvedValue();
        await ChapterController.reorder(req, res);

        expect(chapterService.reorder).toHaveBeenCalledWith(req.body);
    });

    it("should return 500 if reorder fails", async () => {
        const error = new Error("fail");
        req.body = [{ id_chapter: 1, order: 2 }];
        chapterService.reorder.mockRejectedValue(error);
       
        await ChapterController.reorder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });

    it("should create full chapter", async () => {
        const chapter = { id: 1 };

        req.body = {
             title: "Chapter",
            pages: [{ type: "LESSON" }],
        };

        chapterService.createFull.mockResolvedValue(chapter);

        await ChapterController.createFull(req, res);

        expect(chapterService.createFull).toHaveBeenCalledWith(
            { title: "Chapter" },
            [{ type: "LESSON" }]
        );

    });


    it("should return 500 if createFull fails", async () => {
        const error = new Error("fail");
        req.body = {};
        chapterService.createFull.mockRejectedValue(error);

        await ChapterController.createFull(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });


    it("should replace full chapter", async () => {
        req.params.id = 1;
        req.body = { title: "Updated", pages: [{ type: "LESSON" }] };
        chapterService.replaceFull.mockResolvedValue({});

        await ChapterController.replaceFull(req, res);

        expect(chapterService.replaceFull).toHaveBeenCalledWith(
            1,
            { title: "Updated" },
            [{ type: "LESSON" }]
        );
    });

    it("should return 404 if replaceFull target not found", async () => {
        req.params.id = 1;
        chapterService.replaceFull.mockResolvedValue(null);
        await ChapterController.replaceFull(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 if replaceFull fails", async () => {
        const error = new Error("fail");
        req.params.id = 1;
        chapterService.replaceFull.mockRejectedValue(error);

        await ChapterController.replaceFull(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});