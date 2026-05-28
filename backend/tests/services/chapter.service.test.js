const { makeChapterService } = require("./chapterService.factory");

describe("ChapterService", () => {
    let service;
    let mocks;

    beforeEach(() => {
        mocks = {
            sequelize: {
                transaction: jest.fn(),
            },

            Chapter: {
                create: jest.fn(),
                findByPk: jest.fn(),
                findAll: jest.fn(),
                update: jest.fn(),
                destroy: jest.fn(),
                findOne: jest.fn(),
            },

            Page: {
                create: jest.fn(),
                findAll: jest.fn(),
            },

            Lesson: { create: jest.fn(), destroy: jest.fn() },
            Exercise: { create: jest.fn(), destroy: jest.fn() },
            UniqueResponse: { destroy: jest.fn() },
            Pairs: { destroy: jest.fn() },
            PutInOrder: { destroy: jest.fn() },

            lessonService: {
                create: jest.fn(),
            },

            exerciseService: {
                create: jest.fn(),
            },
        };

        service = makeChapterService(mocks);
    });


    it("should return all chapters", async () => {
        mocks.Chapter.findAll.mockResolvedValue([{ id: 1 }]);

        const result = await service.getAll();

        expect(mocks.Chapter.findAll).toHaveBeenCalledWith(
            expect.objectContaining({
                order: [["order", "ASC"]],
            })
        );

        expect(result).toEqual([{ id: 1 }]);
    });

    it("should return chapter by id", async () => {
        mocks.Chapter.findOne.mockResolvedValue({ id: 1 });

        const result = await service.getById(1);

        expect(mocks.Chapter.findOne).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id_chapter: 1 },
                order: [["order", "ASC"]],
            })
        );

        expect(result).toEqual({ id: 1 });
    });


    it("should return null if chapter not found", async () => {
        mocks.Chapter.findByPk.mockResolvedValue(null);

        const result = await service.delete(1);

        expect(result).toBeNull();
    });


    it("should delete chapter if exists", async () => {
        const chapter = { id_chapter: 1 };

        mocks.Chapter.findByPk.mockResolvedValue(chapter);
        mocks.Chapter.destroy.mockResolvedValue(1);

        const result = await service.delete(1);

        expect(mocks.Chapter.destroy).toHaveBeenCalledWith({
            where: { id_chapter: 1 },
        });

        expect(result).toEqual(chapter);
    });


    it("should reorder chapters and commit", async () => {
        const commit = jest.fn();
        const rollback = jest.fn();

        mocks.sequelize.transaction.mockResolvedValue({ commit, rollback });

        mocks.Chapter.update.mockResolvedValue();

        const result = await service.reorder([
            { id_chapter: 1, order: 2 },
        ]);

        expect(mocks.Chapter.update).toHaveBeenCalledWith(
            { order: 2 },
            expect.objectContaining({
                where: { id_chapter: 1 },
            })
        );

        expect(commit).toHaveBeenCalled();
        expect(result).toBe(true);
    });


    it("should rollback on reorder error", async () => {
        const commit = jest.fn();
        const rollback = jest.fn();

        mocks.sequelize.transaction.mockResolvedValue({ commit, rollback });

        mocks.Chapter.update.mockRejectedValue(new Error("fail"));

        await expect(
            service.reorder([{ id_chapter: 1, order: 1 }])
        ).rejects.toThrow("fail");

        expect(rollback).toHaveBeenCalled();
    });


    it("should create chapter and pages", async () => {
        const commit = jest.fn();
        const rollback = jest.fn();

        mocks.sequelize.transaction.mockResolvedValue({ commit, rollback });

        const chapterMock = { id_chapter: 1 };
        const pageMock = { id_page: 10 };

        mocks.Chapter.create.mockResolvedValue(chapterMock);
        mocks.Page.create.mockResolvedValue(pageMock);

        mocks.lessonService.create.mockResolvedValue();

        const result = await service.createFull(
            {
                title: "Test",
                title_fr: "FR",
                abstract: "desc",
                id_level: 1,
            },
            [
                {
                    type: "LESSON",
                    lesson: {
                        title: "L1",
                        content: "C1",
                    },
                },
            ]
        );

        // Chapter
        expect(mocks.Chapter.create).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Test",
                title_fr: "FR",
                abstract: "desc",
                id_level: 1,
            }),
            expect.any(Object)
        );

        // Page
        expect(mocks.Page.create).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "LESSON",
                order_index: 1,
                id_chapter: 1,
            }),
            expect.any(Object)
        );

        // Lesson service
        expect(mocks.lessonService.create).toHaveBeenCalledWith(
            pageMock,
            { title: "L1", content: "C1" },
            expect.any(Object)
        );

        expect(commit).toHaveBeenCalled();
        expect(result).toEqual(chapterMock);
    });


    it("should rollback on createFull error", async () => {
        const commit = jest.fn();
        const rollback = jest.fn();

        mocks.sequelize.transaction.mockResolvedValue({ commit, rollback });

        mocks.Chapter.create.mockRejectedValue(new Error("fail"));

        await expect(
            service.createFull({}, [])
        ).rejects.toThrow("fail");

        expect(rollback).toHaveBeenCalled();
    });


    it("should return null if chapter not found (replaceFull)", async () => {
        const commit = jest.fn();
        const rollback = jest.fn();

        mocks.sequelize.transaction.mockResolvedValue({ commit, rollback });

        mocks.Chapter.findByPk.mockResolvedValue(null);

        const result = await service.replaceFull(1, {}, []);

        expect(rollback).toHaveBeenCalled();
        expect(result).toBeNull();
    });


    it("should replace and rebuild chapter", async () => {
        const commit = jest.fn();
        const rollback = jest.fn();

        mocks.sequelize.transaction.mockResolvedValue({ commit, rollback });

        const chapter = { update: jest.fn(), id_chapter: 1 };

        mocks.Chapter.findByPk.mockResolvedValue(chapter);

        mocks.Chapter.update = jest.fn();
        mocks.Page.findAll.mockResolvedValue([]);

        const deleteSpy = jest
            .spyOn(service, "deleteChapterStructure")
            .mockResolvedValue();

        const createSpy = jest
            .spyOn(service, "createPages")
            .mockResolvedValue();

        const result = await service.replaceFull(1, {}, []);

        expect(chapter.update).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();
        expect(createSpy).toHaveBeenCalled();

        expect(commit).toHaveBeenCalled();
        expect(result).toBe(chapter);
    });

    it("should create exercise page", async () => {
        const commit = jest.fn();
        const rollback = jest.fn();

        mocks.sequelize.transaction.mockResolvedValue({
            commit,
            rollback,
        });

        const chapterMock = { id_chapter: 1 };
        const pageMock = { id_page: 20 };

        mocks.Chapter.create.mockResolvedValue(chapterMock);
        mocks.Page.create.mockResolvedValue(pageMock);

        mocks.exerciseService.create.mockResolvedValue();

        const exerciseData = {
            question: "Question ?",
            type: "UNIQUE",
        };

        const result = await service.createFull(
            {
                title: "Chapter",
                title_fr: "Chapitre",
                abstract: "desc",
                id_level: 1,
            },
            [
                {
                    type: "EXERCISE",
                    exercise: exerciseData,
                },
            ]
        );

        expect(mocks.Page.create).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "EXERCISE",
                order_index: 1,
                id_chapter: 1,
            }),
            expect.any(Object)
        );

        expect(mocks.exerciseService.create).toHaveBeenCalledWith(
            pageMock,
            exerciseData,
            expect.any(Object)
        );

        expect(commit).toHaveBeenCalled();
        expect(result).toEqual(chapterMock);
    });

    it("should delete complete chapter structure", async () => {
        const transaction = {};
        const destroyPage = jest.fn();

        mocks.Page.findAll.mockResolvedValue([
            { id_page: 1,  destroy: destroyPage },
        ]);

        await service.deleteChapterStructure(1, transaction);

        expect(mocks.Page.findAll).toHaveBeenCalledWith({
            where: { id_chapter: 1 },
            include: [mocks.Exercise, mocks.Lesson],
            transaction,
        });

        expect(mocks.UniqueResponse.destroy).toHaveBeenCalledWith({ where: { id_page: 1 }, transaction, });
        expect(mocks.Pairs.destroy).toHaveBeenCalledWith({ where: { id_page: 1 }, transaction });
        expect(mocks.PutInOrder.destroy).toHaveBeenCalledWith({ where: { id_page: 1 }, transaction });
        expect(mocks.Exercise.destroy).toHaveBeenCalledWith({ where: { id_page: 1 }, transaction });
        expect(mocks.Lesson.destroy).toHaveBeenCalledWith({ where: { id_page: 1 }, transaction });
        expect(destroyPage).toHaveBeenCalledWith({ transaction });
    });

    it("should create lesson pages", async () => {
        const transaction = {};
        mocks.Page.create.mockResolvedValue({ id_page: 10, });

        await service.createPages(
            1,
            [
                {
                    type: "LESSON",
                    lesson: {
                        title: "Lesson title",
                        content: "Lesson content",
                    },
                },
            ],
            transaction
        );

        expect(mocks.Page.create).toHaveBeenCalledWith(
            {
                type: "LESSON",
                order_index: 1,
                id_chapter: 1,
            },
            { transaction }
        );

        expect(mocks.Lesson.create).toHaveBeenCalledWith(
            {
                id_page: 10,
                title: "Lesson title",
                content: "Lesson content",
            },
            {
                transaction,
                hooks: false,
            }
        );
    });

    it("should create exercise pages", async () => {
        const transaction = {};
        const createExerciseSpy = jest.spyOn(service, "createExercise").mockResolvedValue();

        mocks.Page.create.mockResolvedValue({ id_page: 20 });

        await service.createPages(
            1,
            [
                {
                    type: "EXERCISE",
                    exercise: {
                        question: "Q1",
                    },
                },
            ],
            transaction
        );

        expect(createExerciseSpy).toHaveBeenCalledWith(
            { id_page: 20 },
            { question: "Q1" },
            transaction
        );
    });

    it("should create exercise entity", async () => {
        const transaction = {};

        await service.createExercise(
            { id_page: 5 },
            {
                question: "Question",
                feedback: "Feedback",
                type: "UNIQUE",
            },
            transaction
        );

        expect(mocks.Exercise.create).toHaveBeenCalledWith(
            {
                id_page: 5,
                question: "Question",
                feedback: "Feedback",
                type: "UNIQUE",
            },
            {
                transaction,
                hooks: false,
            }
        );
    });

    it("should rollback and throw if replaceFull fails", async () => {
        const commit = jest.fn();
        const rollback = jest.fn();

        mocks.sequelize.transaction.mockResolvedValue({ commit, rollback });
        const error = new Error("update failed");
        const chapter = { update: jest.fn().mockRejectedValue(error) };

        mocks.Chapter.findByPk.mockResolvedValue(chapter);

        await expect(
            service.replaceFull(
                1,
                {
                    title: "New title",
                },
                []
            )
        ).rejects.toThrow("update failed");

        expect(rollback).toHaveBeenCalled();
        expect(commit).not.toHaveBeenCalled();
    });

    it("should create lesson with empty fallback values", async () => {
        const transaction = {};

        mocks.Page.create.mockResolvedValue({ id_page: 99 });

        await service.createPages(
            1,
            [
                {
                    type: "LESSON",
                    lesson: {},
                },
            ],
            transaction
        );

        expect(mocks.Lesson.create).toHaveBeenCalledWith(
            {
                id_page: 99,
                title: "",
                content: "",
            },
            {
                transaction,
                hooks: false,
            }
        );
    });

    it("should create lesson when lesson payload is undefined", async () => {
        const transaction = {};

        mocks.Page.create.mockResolvedValue({ id_page: 42 });

        await service.createPages(
            1,
            [
                {
                    type: "LESSON",
                },
            ],
            transaction
        );

        expect(mocks.Lesson.create).toHaveBeenCalledWith(
            {
                id_page: 42,
                title: "",
                content: "",
            },
            {
                transaction,
                hooks: false,
            }
        );
    });

    it("should call createExercise with empty object fallback", async () => {
        const transaction = {};
        mocks.Page.create.mockResolvedValue({ id_page: 20 });
        const spy = jest.spyOn(service, "createExercise").mockResolvedValue();
        await service.createPages(
            1,
            [
                {
                    type: "EXERCISE",
                },
            ],
            transaction
        );

        expect(spy).toHaveBeenCalledWith(
            { id_page: 20 },
            {},
            transaction
        );
    });

    it("should create exercise with empty fallback values", async () => {
        const transaction = {};

        await service.createExercise(
            { id_page: 7 },
            {},
            transaction
        );

        expect(mocks.Exercise.create).toHaveBeenCalledWith(
            {
                id_page: 7,
                question: "",
                feedback: "",
                type: "UNIQUE",
            },
            {
                transaction,
                hooks: false,
            }
        );
    });
});