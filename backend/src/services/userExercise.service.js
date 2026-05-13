const models = require("../db/models");

function computeScore(results) {
  const total = results.length;
  const correct = results.filter(r => r.is_correct).length;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

  return { total, correct, percentage };
}

async function getUserExercisesByChapter(id_user, id_chapter) {
  return models.UserExercise.findAll({
    include: [{
      model: models.Exercise,
      where: { id_chapter }
    }],
    where: { id_user }
  });
}

async function getChapterScore(id_user, id_chapter) {
  const pages = await models.Page.findAll({
    attributes: ['id_page'],
    where: { id_chapter },
    raw: true
  });

  const pageIds = pages.map(p => p.id_page);

  if (pageIds.length === 0) {
    return { total: 0, correct: 0, percentage: 0 };
  }

  const results = await models.UserExercise.findAll({
    attributes: ['is_correct'],
    where: {
      id_user,
      id_page: pageIds
    },
    raw: true
  });

  return computeScore(results);
}

async function upsertUserExercise(id_user, id_page, is_correct) {
  if (!id_page) {
    const err = new Error("id_page requis");
    err.status = 400;
    throw err;
  }

  await models.UserExercise.upsert({
    id_user,
    id_page,
    is_done: true,
    is_correct
  });

  return { success: true };
}

module.exports = {
  getUserExercisesByChapter,
  getChapterScore,
  upsertUserExercise,
  computeScore
};