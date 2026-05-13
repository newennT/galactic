const PageController = require('../controllers/page.controller');

module.exports = (app) => {

    app.get('/api/pages', PageController.getAll);

    app.get('/api/pages/:id', PageController.getById);

    app.post('/api/pages', PageController.create);

    app.put('/api/pages/:id', PageController.update);

    app.delete('/api/pages/:id', PageController.delete);

};