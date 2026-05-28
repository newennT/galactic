const ChapterService = require('./chapter.service');
const db = require('../db/models');

function makeChapterService() {
  return new ChapterService({
    sequelize: db.sequelize,
    Chapter: db.Chapter,
    Level: db.Level,
    Page: db.Page,
    Lesson: db.Lesson,
    Exercise: db.Exercise,
    UniqueResponse: db.UniqueResponse,
    Pairs: db.Pairs,
    PutInOrder: db.PutInOrder,
    lessonService: db.lessonService,
    exerciseService: db.exerciseService,
  });
}

const chapterService = makeChapterService();

module.exports = { chapterService };