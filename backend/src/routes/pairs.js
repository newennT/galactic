const PairsController = require('../controllers/pairs.controller');

module.exports = (app) => {

    app.get('/api/pairs', PairsController.getAll);

    app.get('/api/pairs/:id', PairsController.getById);

    app.post('/api/pairs', PairsController.create);

    app.put('/api/pairs/:id', PairsController.update);

    app.delete('/api/pairs/:id', PairsController.delete);

};