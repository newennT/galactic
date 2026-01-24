module.exports = (app) => {
    app.post("/api/chapters/full", async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { pages, ...chapterData } = req.body;
            const chapter = await models.Chapter.create(chapterData, { transaction: t });

            for (const pageData of pages) {
                const page = await models.Page.create({
                    title: pageData.title,
                    type: pageData.type,
                    order_index: pageData.order_index,
                    id_chapter: chapter.id_chapter
                }, { transaction: t });

            if (pageData.type === "LESSON") {
                await models.Lesson.create({
                    id_page: page.id_page,
                    content: pageData.lesson.content,
                    title: pageData.title
                }, { transaction: t });
            }

            if (pageData.type === "EXERCISE") {
                const exercise = await models.Exercise.create({
                    id_page: page.id_page,
                    question: pageData.exercise.question,
                    feedback: pageData.exercise.feedback,
                    type: pageData.exercise.type
                }, { transaction: t });

                if (exercise.type === "UNIQUE") {
                    for (const r of pageData.exercise.responses) {
                        await models.UniqueResponse.create({
                            ...r,
                            id_page: page.id_page
                        }, { transaction: t });
                    }
                }

                if (exercise.type === "ORDER") {
                    for (const r of pageData.exercise.responses) {
                        await models.OrderResponse.create({
                            ...r,
                            id_page: page.id_page
                        }, { transaction: t });
                    }
                }

                if (exercise.type === "PAIRS") {
                    for (const r of pageData.exercise.responses) {
                        await models.PairsResponse.create({
                            ...r,
                            id_page: page.id_page
                        }, { transaction: t });
                    }
                }
            }
            }

            await t.commit();

            res.json({ message: "Chapitre complet créé", data: chapter });

        } catch (error) {

            await t.rollback();
            res.status(500).json({ message: "Erreur création", data: error });
        }
    });

};