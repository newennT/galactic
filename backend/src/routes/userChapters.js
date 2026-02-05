const { raw } = require("body-parser");
const auth = require("../auth/auth");
const { models } = require("../db/sequelize");

module.exports = (app) => {
    app.get('/api/user-chapters', auth, async (req, res) => {
        try {
            const id_user = req.auth.userId;
            
            // Récupérer les chapitres faits par un utilisateur
            const userChapters = await models.UserChapter.findAll({
                where: { id_user },
                include: [{
                    model: models.Chapter
                }],
                order: [[ 'createdAt', 'DESC' ]],
                raw: true,
                nest: true
            });

            // Récupérer le score de chaque chapitre 
            const chaptersWithScores = await Promise.all(userChapters.map(async (uc) => {
                const pages = await models.Page.findAll({
                    where: { 
                        id_chapter: uc.id_chapter,
                        type: 'EXERCISE' 
                    },
                    attributes: ['id_page'],
                    raw: true
                });

                const pageIds = pages.map(p => p.id_page);

                if (pageIds.length === 0) {
                    return { ...uc.Chapter, total: 0, correct: 0, percentage: null };
                }

                const results = await models.UserExercise.findAll({
                    attributes: ['is_correct'],
                    where: {
                        id_user,
                        id_page: pageIds
                    },
                    raw: true
                });

                const total = pages.length;
                const correct = results.filter(r => r.is_correct).length;
                const percentage = results.length === total ? Math.round(correct / total * 100) : null;

                return { ...uc.Chapter, total, correct, percentage };
            }));


            res.json({ chapters: chaptersWithScores });


        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.post('/api/user-chapters', auth, async (req, res) => {
        try {
            const id_user = req.auth.userId;
            const { id_chapter } = req.body;

            if (!id_chapter) {
                return res.status(400).json({ message: "id_chapter requis" });
            }

            await models.UserChapter.upsert({
                id_user,
                id_chapter
            })

            res.json({ id_user, id_chapter });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
}