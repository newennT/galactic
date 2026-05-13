const {
  sequelize,
  Chapter,
  Level,
  Page,
  Lesson,
  Exercise,
  UniqueResponse,
  Pairs,
  PutInOrder
} = require('../db/models');

class ChapterService {
    static async getAll() {
        return Chapter.findAll({
            order: ['order'],
            include: [{ model: Level }]
        });
    }

    static async getById(id) {
        return Chapter.findByPk(id, {
        order: ['order'],
        include: [
            { model: Level },
            {
            model: Page,
            include: [
                { model: Lesson },
                {
                model: Exercise,
                include: [
                    { model: UniqueResponse },
                    { model: Pairs },
                    { model: PutInOrder },
                ],
                },
            ],
            },
        ],
        });
    }

    static async delete(id) {
        const chapter = await Chapter.findByPk(id);
        if (!chapter) { return null; }
        await Chapter.destroy({ where: { id_chapter: id } });
        return chapter;
    }

    static async reorder(updates) {
        const t = await sequelize.transaction();
        try {
            for (const item of updates) {
                await Chapter.update(
                    { order: item.order },
                    {
                        where: { id_chapter: item.id_chapter },
                        transaction: t,
                    }
                );
            }
            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async createFull(chapterData, pages) {
        const t = await sequelize.transaction();

        try {
            const chapter = await Chapter.create(
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
                const page = await Page.create(
                    {
                        type: pageData.type,
                        order_index: i + 1,
                        id_chapter: chapter.id_chapter,
                    },
                    { transaction: t }
                );

                if (pageData.type === 'LESSON') {
                    await LessonService.create(page, pageData.lesson, t);
                }

                if (pageData.type === 'EXERCISE') {
                    await ExerciseService.create(page, pageData.exercise, t);
                }
            }

            await t.commit();
            return chapter;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    static async replaceFull(id, chapterData, pages) {
        const t = await sequelize.transaction();

        try {
            const chapter = await Chapter.findByPk(id, { transaction: t });

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

    static async deleteChapterStructure(id, t) {
        const oldPages = await Page.findAll({
            where: { id_chapter: id },
            include: [Exercise, Lesson],
            transaction: t,
        });

        for (const page of oldPages) {
            await UniqueResponse.destroy({ where: { id_page: page.id_page }, transaction: t });
            await Pairs.destroy({ where: { id_page: page.id_page }, transaction: t });
            await PutInOrder.destroy({ where: { id_page: page.id_page }, transaction: t });
            await Exercise.destroy({ where: { id_page: page.id_page }, transaction: t });
            await Lesson.destroy({ where: { id_page: page.id_page }, transaction: t });
            await page.destroy({ transaction: t });
        }
    }

    static async createPages(chapterId, pages, t) {

        for (let i = 0; i < pages.length; i++) {
            const pageData = pages[i];
            const page = await Page.create(
                {
                type: pageData.type,
                order_index: i + 1,
                id_chapter: chapterId,
                },
                { transaction: t }
            );

            if (pageData.type === 'LESSON') {
                await Lesson.create(
                {
                    id_page: page.id_page,
                    title: pageData.lesson?.title || "",
                    content: pageData.lesson?.content || "",
                },
                { transaction: t, hooks: false }
                );
            }

            if (pageData.type === 'EXERCISE') {
                await this.createExercise(page, pageData.exercise || {}, t);
            }
        }
    }

    static async createExercise(page, ex, t) {
        await Exercise.create(
            {
                id_page: page.id_page,
                question: ex.question || "",
                feedback: ex.feedback || "",
                type: ex.type || "UNIQUE",
                media_url: ex.media_url || null,
                media_type: ex.media_type || null,
            },
            { transaction: t, hooks: false }
        );

        if (ex.type === 'UNIQUE') {
            for (const r of ex.uniqueResponses || []) {
                await UniqueResponse.create(
                    {
                        content: r.content,
                        is_correct: r.is_correct,
                        id_page: page.id_page,
                    },
                    { transaction: t, hooks: false }
                );
            }
        }

        if (ex.type === 'PAIRS') {
            for (const p of ex.pairs || []) {
                await Pairs.create(
                    {
                        content: p.content_left,
                        pair_key: p.pair_key,
                        id_page: page.id_page,
                    },
                    { transaction: t, hooks: false }
                );

                await Pairs.create(
                    {
                        content: p.content_right,
                        pair_key: p.pair_key,
                        id_page: page.id_page,
                    },
                    { transaction: t, hooks: false }
                );
            }
        }

        if (ex.type === 'ORDER') {
            for (const s of ex.putInOrders || []) {
                await PutInOrder.create(
                {
                    content: s.content,
                    mixed_order: s.mixed_order,
                    correct_order: s.correct_order,
                    id_page: page.id_page,
                },
                { transaction: t, hooks: false }
                );
            }
        }
    }


}

module.exports = ChapterService;