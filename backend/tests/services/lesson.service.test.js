const LessonService = require("../../src/services/lesson.service");

jest.mock("../../src/db/models", () => ({
    Lesson: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
}));

const { Lesson } = require("../../src/db/models");

describe("LessonService", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------
    // CREATE FROM PAGE
    // -------------------------
    it("should create lesson from page", async () => {
        Lesson.create.mockResolvedValue({ id_page: 1 });

        const page = { id_page: 1 };

        const lessonData = {
            title: "Title",
            content: "Content",
        };

        const result = await LessonService.createFromPage(page, lessonData, {});

        expect(Lesson.create).toHaveBeenCalledWith(
            {
                id_page: 1,
                title: "Title",
                content: "Content",
            },
            {
                transaction: {},
                hooks: false,
            }
        );

        expect(result).toEqual({ id_page: 1 });
    });

    it("should use fallback values in createFromPage", async () => {
        Lesson.create.mockResolvedValue({ id_page: 1 });

        await LessonService.createFromPage({ id_page: 1 }, {}, {});

        expect(Lesson.create).toHaveBeenCalledWith(
            {
                id_page: 1,
                title: "",
                content: "",
            },
            {
                transaction: {},
                hooks: false,
            }
        );
    });

    // -------------------------
    // DIRECT CREATE
    // -------------------------
    it("should create lesson (direct)", async () => {
        Lesson.create.mockResolvedValue({ id: 1 });

        const data = { title: "T" };

        const result = await LessonService.create(data);

        expect(Lesson.create).toHaveBeenCalledWith(data);
        expect(result).toEqual({ id: 1 });
    });

    // -------------------------
    // GET ALL
    // -------------------------
    it("should return all lessons", async () => {
        const lessons = [{ id: 1 }];
        Lesson.findAll.mockResolvedValue(lessons);

        const result = await LessonService.getAll();

        expect(Lesson.findAll).toHaveBeenCalled();
        expect(result).toEqual(lessons);
    });

    // -------------------------
    // GET BY ID
    // -------------------------
    it("should return lesson by id", async () => {
        const lesson = { id: 1 };
        Lesson.findByPk.mockResolvedValue(lesson);

        const result = await LessonService.getById(1);

        expect(Lesson.findByPk).toHaveBeenCalledWith(1);
        expect(result).toEqual(lesson);
    });

    // -------------------------
    // UPDATE
    // -------------------------
    it("should update lesson", async () => {
        Lesson.update.mockResolvedValue([1]);
        Lesson.findByPk.mockResolvedValue({ id: 1 });

        const result = await LessonService.update(1, {
            title: "Updated",
        });

        expect(Lesson.update).toHaveBeenCalledWith(
            { title: "Updated" },
            { where: { id_page: 1 } }
        );

        expect(result).toEqual({ id: 1 });
    });

    // -------------------------
    // DELETE
    // -------------------------
    it("should delete lesson", async () => {
        const lesson = { id_page: 1 };

        Lesson.findByPk.mockResolvedValue(lesson);
        Lesson.destroy.mockResolvedValue(1);

        const result = await LessonService.delete(1);

        expect(Lesson.destroy).toHaveBeenCalledWith({
            where: { id_page: 1 },
        });

        expect(result).toEqual(lesson);
    });

    it("should return null if lesson not found", async () => {
        Lesson.findByPk.mockResolvedValue(null);

        const result = await LessonService.delete(1);

        expect(result).toBeNull();
    });
});