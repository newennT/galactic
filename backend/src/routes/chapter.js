// routes/chapter.js

const models = require("../db/models");
const ChapterController = require("../controllers/chapter.controller");

const {
  Chapter,
  Level,
  Page,
  Lesson,
  Exercise,
  UniqueResponse,
  Pairs,
  PutInOrder
} = models;

const { sequelize } = require("../db/sequelize");
const { ValidationError } = require('sequelize');
const { UniqueConstraintError } = require('sequelize');
const auth = require('../auth/auth');

module.exports = (app) => {
    app.get('/api/chapters', ChapterController.getAll);

    app.get('/api/chapters/:id', ChapterController.getById);

    app.delete('/api/chapters/:id', ChapterController.delete);

    app.patch('/api/chapters/reorder', auth, ChapterController.reorder);

    app.post('/api/chapters/full', ChapterController.createFull);

    app.put('/api/chapters/:id/full', auth, ChapterController.replaceFull);
}