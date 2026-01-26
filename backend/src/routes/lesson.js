// routes/exercise.js

const { models: { Lesson } } = require('../db/sequelize')
const { ValidationError } = require('sequelize')
const { UniqueConstraintError } = require('sequelize')
const { Op } = require("sequelize");

module.exports = (app) => {
    // Récupérer la liste des leçons
    app.get("/api/lessons", (req, res) => {
        Lesson.findAll({
            page_id: ["page_id"],

        })
            .then(lessons => {
                const message = "La liste des leçons a été récupérée"
                res.json({ message, data: lessons })
            })
            .catch(error => {
                const message = "La liste des leçons n'a pas pu'être récupérée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer une leçon
    app.get("/api/lessons/:id", (req, res) => {
        Lesson.findByPk(req.params.id)
            .then(lesson => {
                if(lesson === null) {
                    const message = "La leçon demandée n'a pas été trouvée"
                    return res.status(404).json({ message })
                }
                const message = "Une leçon a bien été trouvée"
                res.json({ message, data: lesson })
            })
            .catch(error => {
                const message = "La leçon n'a pas pu'être trouvée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Créer une leçon
    app.post("/api/lessons", (req, res) => {
        Lesson.create(req.body)
            .then(lesson => {
                const message = `La leçon a bien été créée`
                res.json({ message, data: lesson })
            })
            .catch(error => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                const message = "La leçon n'a pas pu être créée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Modifier une leçon
    app.put("/api/lessons/:id", (req, res) => {
        const id = req.params.id;
        Lesson.update(req.body, {
            where: { id_page: id}
        })
        .then(_ => {
            return Lesson.findByPk(id).then(lesson => {
                if(lesson === null) {
                    const message = "La leçon demandée n'a pas été trouvée. Réessayez avec un autre identifiant."
                    return res.status(404).json({ message })
                }
                const message = `La leçon a bien été modifiée`
                res.json({message, data: lesson})
            })
        })
        .catch(error => {
            if(error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if(error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = "La leçon n'a pas pu être modifiée. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });

    // Supprimer une leçon
    app.delete("/api/lessons/:id", (req, res) => {
        Lesson.findByPk(req.params.id).then(lesson => {
            if(lesson === null) {
                const message = "La leçon demandée n'a pas été trouvé. Réessayez avec un autre identifiant."
                return res.status(404).json({ message })
            }
            const lessonDeleted = lesson;
            Lesson.destroy({
                where: { id_page: lesson.id_page }
            })
            .then(_ => {
                const message = `La leçon a bien été supprimée`
                res.json({message, data: lessonDeleted})
            })
        })
        .catch(error => {
            const message = "La leçon n'a pas pu'être supprimée. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });
}