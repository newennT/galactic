const { raw } = require("body-parser");
const auth = require("../auth/auth");
const { models } = require("../db/sequelize");

module.exports = (app) => {
    app.get('/api/user-chapters', auth, async (req, res) => {
        try {
            const id_user = req.auth.id_user;

            const user = await models.User.findByPk(id_user);

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }
            
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
                    include: [{
                        model: models.Exercise,
                        attributes: ['id_page']
                    }],

                });

                const pageIds = pages.map(page => page.Exercise?.id_page).filter(Boolean);

                if (pageIds.length === 0) {
                    return { ...uc.Chapter, total: 0, correct: 0, percentage: null };
                }

                const results = await models.UserExercise.findAll({
                    attributes: ['id_page','is_correct'],
                    where: {
                        id_user,
                        id_page: pageIds
                    },
                    raw: true
                });

                // Récupérer les exercices de chaque chapitre 
                const exercises = pages.map(page => {
                    const result = results.find(re => re.id_page === page.Exercise.id_page);
                    
                    let status;
                    if(!result){
                        status = 'non fait';
                    } else if(result.is_correct){
                        status = 'correct';
                    } else {
                        status = 'raté';
                    }

                    
                    return {
                        id_page: page.Exercise.id_page,
                        is_correct: result ? result.is_correct : null,
                        status
                    }
                });

                const total = pages.length;
                const correct = results.filter(r => r.is_correct).length;
                const percentage = results.length === total ? Math.round(correct / total * 100) : null;

                return { ...uc.Chapter, total, correct, percentage, exercises };
            }));

            res.json({ user, chapters: chaptersWithScores });

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    app.post('/api/user-chapters', auth, async (req, res) => {
        try {
            const id_user = req.auth.id_user;
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