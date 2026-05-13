// controllers/userChapter.controller.js

const auth = require("../auth/auth");
const service = require("../services/userChapter.service");

exports.getUserChapters = async (req, res) => {
  try {
    const id_user = req.auth.id_user;

    const user = await service.getUser(id_user);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const userChapters = await service.getUserChapters(id_user);

    const chaptersWithScores = await Promise.all(
      userChapters.map(async (uc) => {
        const pages = await service.getChapterExercises(uc.id_chapter);

        const pageIds = pages.map(p => p.id_page);

        if (pageIds.length === 0) {
          return {
            ...uc.Chapter,
            total: 0,
            correct: 0,
            percentage: null
          };
        }

        const results = await service.getUserResults(id_user, pageIds);

        return service.buildChapterResult(
          uc.Chapter,
          pages,
          results
        );
      })
    );

    res.json({
      user,
      chapters: chaptersWithScores
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.upsertUserChapter = async (req, res) => {
  try {
    const id_user = req.auth.id_user;
    const { id_chapter } = req.body;

    if (!id_chapter) {
      return res.status(400).json({ message: "id_chapter requis" });
    }

    await service.upsertUserChapter(id_user, id_chapter);

    res.json({ id_user, id_chapter });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};