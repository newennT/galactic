const { ValidationError, UniqueConstraintError } = require('sequelize');
const ExerciseService = require('../services/exercise.service');

class ExerciseController {

    static async getAll(req, res) {
        try {
            const exercises = await ExerciseService.getAll();
            res.json({ message: "La liste des exercices a été récupérée", data: exercises });
            } catch (error) {
                res.status(500).json({message: "La liste des exercices n'a pas pu'être récupérée. Réessayez dans quelques instants.", data: error  });
        }
    }

    static async getById(req, res) {
        try {
            const exercise = await ExerciseService.getById(req.params.id);
            if (!exercise) {
                return res.status(404).json({ message: "L'exercice demandé n'a pas été trouvé" });
            }

            res.json({ message: "Un exercice a bien été trouvé", data: exercise });

        } catch (error) {
            res.status(500).json({ message: "L'exercice n'a pas pu'être trouvé. Réessayez dans quelques instants.", data: error });
        }
    }

    static async create(req, res) {
        try {
            const exercise = await ExerciseService.create(req.body);
            res.json({ message: "L'exercice a bien été créé", data: exercise });
        } catch (error) {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            res.status(500).json({ message: "L'exercice n'a pas pu être créé. Réessayez dans quelques instants.", data: error });
        }
    }

    static async update(req, res) {
        try {
            const exercise = await ExerciseService.update(req.params.id, req.body);
            if (!exercise) {
                return res.status(404).json({ message: "L'exercice demandé n'a pas été trouvé. Réessayez avec un autre identifiant." });
            }
            res.json({ message: "L'exercice a bien été modifié", data: exercise });

        } catch (error) {
            if ( error instanceof ValidationError || error instanceof UniqueConstraintError ) {
                return res.status(400).json({ message: error.message, data: error });
            }
            res.status(500).json({ message: "L'exercice n'a pas pu être modifié. Réessayez dans quelques instants.", data: error });
        }
    }

    static async delete(req, res) {
        try {
            const exercise = await ExerciseService.delete(req.params.id);

            if (!exercise) {
                return res.status(404).json({
                    message: "L'exercice demandé n'a pas été trouvé. Réessayez avec un autre identifiant.",
                });
            }

            res.json({
                message: "L'exercice a bien été supprimé",
                data: exercise,
            });

        } catch (error) {
            res.status(500).json({
                message: "L'exercice n'a pas pu'être supprimé. Réessayez dans quelques instants.",
                data: error,
            });
        }
    }
}

module.exports = ExerciseController;