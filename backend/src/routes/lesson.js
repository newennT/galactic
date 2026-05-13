const LessonController = require('../controllers/lesson.controller');

module.exports = (app) => {

  app.get('/api/lessons', LessonController.getAll);

  app.get('/api/lessons/:id', LessonController.getById);

  app.post('/api/lessons', LessonController.create);

  app.put('/api/lessons/:id', LessonController.update);

  app.delete('/api/lessons/:id', LessonController.delete);

};