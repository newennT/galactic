const { raw } = require('body-parser');
const auth = require('../auth/auth');
const { models } = require('../db/sequelize');

module.exports = (app) => {
  app.get('/api/user-exercises/chapter/:id', auth, async (req, res) => {
    try {
      const id_user = req.auth.userId;
      const id_chapter = req.params.id;

      const results = await models.UserExercise.findAll({
        include: [{
          model: models.Exercise,
          where: {
            id_chapter
          }
        }],
        where: { id_user}
      });

      res.json(results);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/user-exercises/chapter/:id/score', auth, async (req, res) => {
    try {
      const id_user = req.auth.userId;
      const id_chapter = req.params.id;

      // Récupérer les pages du chapitres 
      const pages = await models.Page.findAll({
        attributes: ['id_page'],
        where: { id_chapter },
        raw: true
      });

      const pageIds = pages.map(page => page.id_page);

      if(pageIds.length === 0){
        res.json({ total: 0, correct: 0, percentage: 0 });
      }

      // Récupérer les exercices faits sur ces pages
      const results = await models.UserExercise.findAll({
        attributes: ['is_correct'],
        where: {
          id_user,
          id_page: pageIds
        },
        raw: true
      });

      // Calculer le score
      const total = results.length;
      const correct = results.filter(result => result.is_correct).length;

      const percentage = total === 0 ? 0 : Math.round(correct / total * 100);

      res.json({ total, correct, percentage });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })


  app.post('/api/user-exercises', auth, async (req, res) => {
    try {
      const { id_page, is_correct } = req.body;
      const id_user = req.auth.userId;

      await models.UserExercise.upsert({
        id_page,
        id_user,
        is_done: true,
        is_correct
      });

      res.json({ success: true });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  });

};