const { models: { Chapter } } = require('../db/sequelize');
const { models: { Level } } = require('../db/sequelize');
const { models: { Page } } = require('../db/sequelize');
const { models: { Lesson } } = require('../db/sequelize');
const { models: { Exercise } } = require('../db/sequelize');
const { models: { UniqueResponse } } = require('../db/sequelize');
const { models: { Pairs } } = require('../db/sequelize');
const { models: { PutInOrder } } = require('../db/sequelize');
const { ValidationError } = require('sequelize');
const { UniqueConstraintError } = require('sequelize');
const auth = require('../auth/auth');
const { sequelize } = require('../db/sequelize');
const chapter = require('./chapter');

module.exports = (app) => {
    app.post("/api/chapters/full", async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { pages, levels, ...chapterData } = req.body;
            const chapter = await models.Chapter.create(chapterData, { transaction: t });

            if (levels?.length){
                await chapter.setLevels(levels, { transaction: t });
            }
            
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

    app.put("/api/chapters/:id/full", auth, async (req, res) => {

        const id = req.params.id;
        const t = await sequelize.transaction();

        try {
            const { pages = [], levels, ...chapterData } = req.body;
            const chapter = await Chapter.findByPk(id, { transaction: t });

            if (!chapter) {
                await t.rollback();
                return res.status(404).json({
                    message: "Chapitre non trouvé"
                });
            }

            // Mettre à jour les infos du chapitre
            await chapter.update({
                title: chapterData.title,
                title_fr: chapterData.title_fr,
                abstract: chapterData.abstract,
                isPublished: chapterData.isPublished,
                order: chapterData.order,
                id_level: chapterData.id_level
            }, 
            { 
                transaction: t 
            });


            // Supprimer les données
            const oldPages = await Page.findAll({
                where: { id_chapter: id },
                include: [Exercise, Lesson],
                transaction: t
            });

            for (const page of oldPages) {

                await UniqueResponse.destroy({
                    where: { id_page: page.id_page },
                    transaction: t
                });

                await Pairs.destroy({
                    where: { id_page: page.id_page },
                    transaction: t
                });

                await PutInOrder.destroy({
                    where: { id_page: page.id_page },
                    transaction: t
                });

                if (page.Exercise?.id_exercise) {
                    await Exercise.destroy({
                        where: { id_page: page.id_page },
                        transaction: t
                    });
                }

                if (page.Lesson?.id_page) {
                    await Lesson.destroy({
                        where: { id_page: page.id_page },
                        transaction: t
                    });
                }
                await page.destroy(
                    { transaction: t });
            }

            // Recréer les pages
            for (let i = 0; i < pages.length; i++) {
                const pageData = pages[i];
                const newPage = await Page.create({
                    type: pageData.type,
                    order_index: i + 1,
                    id_chapter: id
                }, 
                { 
                    transaction: t 
                });

                let newExercise = null;

                // Recréer les lessons  
                if (pageData.type === "LESSON") {
                    await Lesson.create(
                    {
                        id_page: newPage.id_page,
                        title: pageData.lesson?.title || "",
                        content: pageData.lesson?.content || ""
                    },
                    {
                        transaction: t,
                        hooks: false
                    });

                }

                // Recréer les exercices
                if (pageData.type === "EXERCISE") {
                   const ex = pageData.exercise || {};
                    newExercise = await Exercise.create({
                        id_page: newPage.id_page,
                        question: ex.question || "",
                        feedback: ex.feedback || "",
                        type: ex.type || "UNIQUE"
                    }, 
                    { 
                        transaction: t, 
                        hooks: false 
                    });


                    // UNIQUE
                    if (ex?.type === "UNIQUE") {
                        for (const response of ex.uniqueResponses || []) {
                            await UniqueResponse.create({
                                content: response.content,
                                is_correct: response.is_correct,
                                id_page: newPage.id_page
                            }, 
                            { 
                                transaction: t, 
                                hooks: false 
                            });
                        }
                    }

                    // PAIRS
                    if (ex?.type === "PAIRS") {
                        for (const pair of ex.pairs || []) {
                            await Pairs.create({
                                content: pair.content_left,
                                pair_key: pair.pair_key,
                                id_page: newPage.id_page
                            }, 
                            { transaction: t, hooks: false });

                            await Pairs.create({
                                content: pair.content_right,
                                pair_key: pair.pair_key,
                                id_page: newPage.id_page
                            }, 
                            { 
                                transaction: t, 
                                hooks: false 
                            });
                        }
                    }

                    // ORDER
                    if (ex?.type === "ORDER") {
                        for (const segment of ex.putInOrders || []) {
                            await PutInOrder.create({
                                content: segment.content,
                                mixed_order: segment.mixed_order,
                                correct_order: segment.correct_order,
                                id_page: newPage.id_page
                            }, 
                            { 
                                transaction: t, 
                                hooks: false 
                            });
                        }
                    }
                }
            }

            await t.commit();
            res.json({
                message: "Chapitre mis à jour"
            });

        } catch (error) {
            await t.rollback();
            console.error(error);
            res.status(500).json({
                message: "Erreur mise à jour chapitre",
                data: error
            });
        }
    });
};