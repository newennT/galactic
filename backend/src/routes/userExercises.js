const auth = require('../middlewares/auth');
const { models } = require('../db/sequelize');

module.exports = (app) => {

  app.post('/api/user-exercises', async (req, res) => {
    try {
      const { id_page, is_correct } = req.body;
      const id_user = req.user.id_user;

      await models.UserExercise.upsert({
        id_page,
        id_user,
        is_done: true,
        is_correct
      });

      res.json({ success: true });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

};