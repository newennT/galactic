// routes/chapter.js
const chapterController = require("../controllers/chapter.controller");
const auth = require('../auth/auth');

module.exports = (app) => {
    app.get('/api/chapters', chapterController.getAll);

    app.get('/api/chapters/:id', chapterController.getById);

    app.get('/api/chapters/:id/single', chapterController.getByIdSingle);

    app.delete('/api/chapters/:id', chapterController.delete);

    app.patch('/api/chapters/reorder', auth, chapterController.reorder);

    app.post('/api/chapters/full', chapterController.createFull);

    app.put('/api/chapters/:id/full', auth, chapterController.replaceFull);
}