// services/userChapter.service.js

const models = require("../db/models");

async function getUser(id_user) {
  return models.User.findByPk(id_user);
}

async function getUserChapters(id_user) {
  return models.UserChapter.findAll({
    where: { id_user },
    include: [{ model: models.Chapter }],
    order: [["createdAt", "DESC"]]
  });
}

async function getChapterExercises(id_chapter) {
  const pages = await models.Page.findAll({
    where: {
      id_chapter,
      type: "EXERCISE"
    },
    include: [
      {
        model: models.Exercise,
        attributes: ["id_page", "question"]
      }
    ]
  });

  return pages.map(p => p.Exercise).filter(Boolean);
}

async function getUserResults(id_user, pageIds) {
  return models.UserExercise.findAll({
    attributes: ["id_page", "is_correct"],
    where: {
      id_user,
      id_page: pageIds
    },
    raw: true
  });
}

async function upsertUserChapter(id_user, id_chapter) {
  return models.UserChapter.upsert({
    id_user,
    id_chapter
  });
}

function buildExerciseView(exercises, results) {
  return exercises.map(ex => {
    const result = results.find(r => r.id_page === ex.id_page);

    let status = "non fait";
    if (result) {
      status = result.is_correct ? "correct" : "raté";
    }

    return {
      id_page: ex.id_page,
      question: ex.question,
      is_correct: result?.is_correct ?? null,
      status
    };
  });
}

function computeScore(pages, results) {
  const total = pages.length;
  const correct = results.filter(r => r.is_correct).length;

  const percentage =
    results.length === total
      ? Math.round((correct / total) * 100)
      : null;

  return { total, correct, percentage };
}

function buildChapterResult(chapter, pages, results) {
  const exercises = buildExerciseView(pages, results);
  const score = computeScore(pages, results);

  return {
    id_chapter: chapter.id_chapter,
    title: chapter.title,
    total: score.total,
    title_fr: chapter.title_fr,
    abstract: chapter.abstract,
    order: chapter.order,
    id_level: chapter.id_level,
    isPublished: chapter.isPublished,
    correct: score.correct,
    percentage: score.percentage,

    exercises
  };
}

module.exports = {
  getUser,
  getUserChapters,
  getChapterExercises,
  getUserResults,
  upsertUserChapter,
  buildExerciseView,
  computeScore,
  buildChapterResult
};