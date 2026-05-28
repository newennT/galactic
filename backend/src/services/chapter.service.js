const { where } = require("sequelize");
const models = require("../db/models");
// const sequelize = require("../db/sequelize");

class ChapterService {
    constructor({
        sequelize,
        Chapter,
        Level,
        Page,
        Lesson,
        Exercise,
        UniqueResponse,
        Pairs,
        PutInOrder,
        lessonService,
        exerciseService,
    }) {
        this.sequelize = sequelize;

        this.Chapter = Chapter;
        this.Level = Level;
        this.Page = Page;
        this.Lesson = Lesson;
        this.Exercise = Exercise;
        this.UniqueResponse = UniqueResponse;
        this.Pairs = Pairs;
        this.PutInOrder = PutInOrder;

        this.lessonService = lessonService;
        this.exerciseService = exerciseService;
    }

    async getAll() {
        return this.Chapter.findAll({
            attributes: [
                "id_chapter",
                "title",
                "title_fr",
                "order",
                "isPublished",
                "id_level"
            ],
            include: [{ model: this.Level }],
            order: [["order", "ASC"]],
            raw: true
        });
    }

    async getById(id) {
        return this.Chapter.findOne({
            where: { id_chapter: Number(id) },
            include: [
                { model: this.Level },
                {
                    model: this.Page,
                    include: [
                        { model: this.Lesson },
                        {
                            model: this.Exercise,
                            include: [
                                { model: this.UniqueResponse },
                                { model: this.Pairs },
                                { model: this.PutInOrder },
                            ],
                        },
                    ],
                },
            ],
        });
    }

    async delete(id) {
        const chapter = await this.Chapter.findByPk(id);
        if (!chapter) return null;

        await this.Chapter.destroy({ where: { id_chapter: id } });
        return chapter;
    }

    async reorder(updates) {
        const t = await this.sequelize.transaction();

        try {
            for (const item of updates) {
                await this.Chapter.update(
                    { order: item.order },
                    {
                        where: { id_chapter: item.id_chapter },
                        transaction: t,
                    }
                );
            }

            await t.commit();
            return true;
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    async createFull(chapterData, pages) {
        const t = await this.sequelize.transaction();

        try {
            const chapter = await this.Chapter.create(
                {
                    title: chapterData.title,
                    title_fr: chapterData.title_fr,
                    abstract: chapterData.abstract,
                    isPublished: chapterData.isPublished ?? false,
                    order: chapterData.order ?? 0,
                    id_level: chapterData.id_level,
                },
                { transaction: t }
            );

            for (let i = 0; i < pages.length; i++) {
                const pageData = pages[i];

                const page = await this.Page.create(
                    {
                        type: pageData.type,
                        order_index: i + 1,
                        id_chapter: chapter.id_chapter,
                    },
                    { transaction: t }
                );

                if (pageData.type === "LESSON") {
                    await this.lessonService.create(page, pageData.lesson, t);
                }

                if (pageData.type === "EXERCISE") {
                    await this.exerciseService.create(page, pageData.exercise, t);
                }
            }

            await t.commit();
            return chapter;
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    async replaceFull(id, chapterData, pages) {
        const t = await this.sequelize.transaction();

        try {
            const chapter = await this.Chapter.findByPk(id, { transaction: t });

            if (!chapter) {
                await t.rollback();
                return null;
            }

            await chapter.update(
                {
                    title: chapterData.title,
                    title_fr: chapterData.title_fr,
                    abstract: chapterData.abstract,
                    isPublished: chapterData.isPublished,
                    order: chapterData.order,
                    id_level: chapterData.id_level,
                },
                { transaction: t }
            );

            await this.deleteChapterStructure(id, t);
            await this.createPages(id, pages, t);

            await t.commit();
            return chapter;
        } catch (err) {
            await t.rollback();
            throw err;
        }
    }

    async deleteChapterStructure(id, t) {
        const oldPages = await this.Page.findAll({
            where: { id_chapter: id },
            include: [this.Exercise, this.Lesson],
            transaction: t,
        });

        for (const page of oldPages) {
            await this.UniqueResponse.destroy({ where: { id_page: page.id_page }, transaction: t });
            await this.Pairs.destroy({ where: { id_page: page.id_page }, transaction: t });
            await this.PutInOrder.destroy({ where: { id_page: page.id_page }, transaction: t });
            await this.Exercise.destroy({ where: { id_page: page.id_page }, transaction: t });
            await this.Lesson.destroy({ where: { id_page: page.id_page }, transaction: t });
            await page.destroy({ transaction: t });
        }
    }

    async createPages(chapterId, pages, t) {
        for (let i = 0; i < pages.length; i++) {
            const pageData = pages[i];

            const page = await this.Page.create(
                {
                    type: pageData.type,
                    order_index: i + 1,
                    id_chapter: chapterId,
                },
                { transaction: t }
            );

            if (pageData.type === "LESSON") {
                await this.Lesson.create(
                    {
                        id_page: page.id_page,
                        title: pageData.lesson?.title || "",
                        content: pageData.lesson?.content || "",
                    },
                    { transaction: t, hooks: false }
                );
            }

            if (pageData.type === "EXERCISE") {
                await this.createExercise(page, pageData.exercise || {}, t);
            }
        }
    }

    async createExercise(page, ex, t) {
        await this.Exercise.create(
            {
                id_page: page.id_page,
                question: ex.question || "",
                feedback: ex.feedback || "",
                type: ex.type || "UNIQUE",
            },
            { transaction: t, hooks: false }
        );
    }
}

module.exports = ChapterService;