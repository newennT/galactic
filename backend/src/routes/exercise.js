const ExerciseController = require('../controllers/exercise.controller');

module.exports = (app) => {

  app.get('/api/exercises', ExerciseController.getAll);

  app.get('/api/exercises/:id', ExerciseController.getById);

  app.post('/api/exercises', ExerciseController.create);

  app.put('/api/exercises/:id', ExerciseController.update);

  app.delete('/api/exercises/:id', ExerciseController.delete);

};