// routes/chapter.js
const ChapterController = require("../controllers/chapter.controller");
const auth = require('../auth/auth');

module.exports = (app) => {
    app.get('/api/chapters', ChapterController.getAll);

    app.get('/api/chapters/:id', ChapterController.getById);

    app.delete('/api/chapters/:id', ChapterController.delete);

    app.patch('/api/chapters/reorder', auth, ChapterController.reorder);

    app.post('/api/chapters/full', ChapterController.createFull);

    app.put('/api/chapters/:id/full', auth, ChapterController.replaceFull);
}