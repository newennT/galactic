const { ValidationError, UniqueConstraintError } = require('sequelize');
const LessonService = require('../services/lesson.service');

class LessonController {

    static async getAll(req, res) {
        try {
            const lessons = await LessonService.getAll();
            res.json({ message: "La liste des leçons a été récupérée", data: lessons });
        } catch (error) {
            res.status(500).json({ message: "La liste des leçons n'a pas pu'être récupérée. Réessayez dans quelques instants.", data: error });
        }
    }

    static async getById(req, res) {
        try {
            const lesson = await LessonService.getById(req.params.id);
            if (!lesson) {
                return res.status(404).json({ message: "La leçon demandée n'a pas été trouvée" });
            }
            res.json({ message: "Une leçon a bien été trouvée", data: lesson });
        } catch (error) {
            res.status(500).json({ message: "La leçon n'a pas pu'être trouvée. Réessayez dans quelques instants.", data: error });
        }
    }

    static async create(req, res) {
        try {
            const lesson = await LessonService.create(req.body);
            res.json({ message: "La leçon a bien été créée", data: lesson, });

        } catch (error) {
            if ( error instanceof ValidationError || error instanceof UniqueConstraintError ) {
                return res.status(400).json({ message: error.message, data: error });
            }
            res.status(500).json({ message: "La leçon n'a pas pu être créée. Réessayez dans quelques instants.", data: error });
        }
    }

    static async update(req, res) {
        try {
            const lesson = await LessonService.update(req.params.id, req.body);
            if (!lesson) {
                return res.status(404).json({ message: "La leçon demandée n'a pas été trouvée. Réessayez avec un autre identifiant." });
            }
            res.json({ message: "La leçon a bien été modifiée", data: lesson });

        } catch (error) {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            res.status(500).json({ message: "La leçon n'a pas pu être modifiée. Réessayez dans quelques instants.", data: error });
        }
    }

    static async delete(req, res) {
        try {
            const lesson = await LessonService.delete(req.params.id);
            if (!lesson) {
                return res.status(404).json({ message: "La leçon demandée n'a pas été trouvé. Réessayez avec un autre identifiant." });
            }
            res.json({ message: "La leçon a bien été supprimée", data: lesson });
        } catch (error) {
            res.status(500).json({ message: "La leçon n'a pas pu'être supprimée. Réessayez dans quelques instants.", data: error });
        }
    }
}

module.exports = LessonController;