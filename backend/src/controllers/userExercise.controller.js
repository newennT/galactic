const service = require("../services/userExercise.service");

module.exports = {

  async getByChapter(req, res) {
    try {
      const data = await service.getUserExercisesByChapter(req.auth.id_user, req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getScore(req, res) {
    try {
      const data = await service.getChapterScore(req.auth.id_user, req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async upsert(req, res) {
    try {
      const data = await service.upsertUserExercise( req.auth.id_user, req.body.id_page, req.body.is_correct);
      res.json(data);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

};