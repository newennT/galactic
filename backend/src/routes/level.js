const LevelController = require('../controllers/level.controller');

module.exports = (app) => {

    app.get('/api/levels', LevelController.getAll);

    app.get('/api/levels/:id', LevelController.getById);

    app.post('/api/levels', LevelController.create);

    app.put('/api/levels/:id', LevelController.update);

    app.delete('/api/levels/:id', LevelController.delete);

};