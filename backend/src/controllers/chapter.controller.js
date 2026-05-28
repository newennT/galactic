const ChapterServiceClass = require('../services/chapter.service');
const db = require('../db/models');


const ChapterService = new ChapterServiceClass({
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

class ChapterController {
    static async getAll(req, res) {
        try {
            const chapters = await ChapterService.getAll();
            const message = "La liste des chapitres a été récupérée";
            res.json({ message, data: chapters});
        } catch (error) {
            const message = "La liste des chapitres n'a pas pu'être récupérée. Réessayez dans quelques instants.";
            res.status(500).json({ message, data: error });
        }
    }

    static async getById(req, res) {
        try {
            const chapter = await ChapterService.getById(req.params.id);
            if (!chapter) {
                return res.status(404).json({ message: "Le chapitre demandé n'a pas été trouvé" });
            }
            res.json({ message: "Un chapitre a bien été trouvé", data: chapter });
        } catch (error) {
            res.status(500).json({ message: "Le chapitre n'a pas pu'être trouvé. Réessayez dans quelques instants.", data: error });
        }
    }

    static async getByIdSingle(req, res) {
        try {
            const chapter = await ChapterService.getByIdSingle(req.params.id);
            if (!chapter) {
                return res.status(404).json({ message: "Le chapitre demandé n'a pas été trouvée" });
            }
            res.json({ message: "Un chapitre a bien été trouvée", data: chapter });
        } catch (error) {
            res.status(500).json({ message: "Le chapitre n'a pas pu'être trouvé. Réessayez dans quelques instants.", data: error });
        }
    }

    static async delete(req, res) {
        try {
            const chapter = await ChapterService.delete(req.params.id);

            if (!chapter) {
                return res.status(404).json({
                message: "Le chapitre demandé n'a pas été trouvé. Réessayez avec un autre identifiant.",
                });
            }

            res.json({
                message: `Le chapitre n°${chapter.id} a bien été supprimé`,
                data: chapter,
            });

        } catch (error) {
            res.status(500).json({
                message: "Le chapitre n'a pas pu'être supprimé. Réessayez dans quelques instants.",
                data: error,
            });
        }
    }

    static async reorder(req, res) {
        try {
            if (!Array.isArray(req.body)) {
                return res.status(400).json({
                    message: "Format invalide : tableau attendu",
                    data: req.body
                });
            }

            await ChapterService.reorder(req.body);
            res.json({ message: "Ordre des chapitres mis à jour avec succès" });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Erreur lors de la mise à jour de l'ordre",
                data: error?.message || error
            });
        }
    }

    static async createFull(req, res) {
        try {
            const { pages = [], ...chapterData } = req.body;
            const chapter = await ChapterService.createFull(chapterData, pages);
            res.json({ message: "Chapitre complet créé", data: chapter });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Erreur création chapitre", data: error });
        }
    }

    static async replaceFull(req, res) {
        try {
            const { pages = [], ...chapterData } = req.body;
            const chapter = await ChapterService.replaceFull(req.params.id, chapterData, pages);
            if (!chapter) {
                return res.status(404).json({ message: "Chapitre non trouvé" });
            }
            res.json({ message: "Chapitre mis à jour" });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Erreur mise à jour chapitre", data: error });
        }
    }
    
}

module.exports = ChapterController;