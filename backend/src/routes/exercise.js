// routes/exercise.js

const { models: { Exercise } } = require('../db/sequelize')
const { models: { UniqueResponse } } = require('../db/sequelize')
const { models: { Pairs } } = require('../db/sequelize')
const { models: { PutInOrder } } = require('../db/sequelize')
const { ValidationError } = require('sequelize')
const { UniqueConstraintError } = require('sequelize')
const { Op } = require("sequelize");

module.exports = (app) => {
    // Récupérer la liste des exercices
    app.get("/api/exercises", (req, res) => {
        Exercise.findAll({
            page_id: ["page_id"],
            include: [
                {
                    model: UniqueResponse
                },
                {
                    model: Pairs
                },
                {
                    model: PutInOrder
                }
            ]
        })
            .then(exercises => {
                const message = "La liste des exercices a été récupérée"
                res.json({ message, data: exercises })
            })
            .catch(error => {
                const message = "La liste des exercices n'a pas pu'être récupérée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer un exercice
    app.get("/api/exercises/:id", (req, res) => {
        Exercise.findByPk(req.params.id,
            {
                include: [
                    {
                        model: UniqueResponse
                    },
                    {
                        model: Pairs
                    },
                    {
                        model: PutInOrder
                    }
                ]
            }
        )
            .then(exercise => {
                if(exercise === null) {
                    const message = "L'exercice demandé n'a pas été trouvé"
                    return res.status(404).json({ message })
                }
                const message = "Un exercice a bien été trouvé"
                res.json({ message, data: exercise })
            })
            .catch(error => {
                const message = "L'exercice n'a pas pu'être trouvé. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Créer un exercice
    app.post("/api/exercises", (req, res) => {
        Level.create(req.body)
            .then(exercise => {
                const message = `L'exercice a bien été créé`
                res.json({ message, data: exercise })
            })
            .catch(error => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                const message = "L'exercice n'a pas pu être créé. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Modifier un exercice
    app.put("/api/exercises/:id", (req, res) => {
        const id = req.params.id;
        Exercise.update(req.body, {
            where: { id_page: id}
        })
        .then(_ => {
            return Exercise.findByPk(id).then(exercise => {
                if(exercise === null) {
                    const message = "L'exercice demandé n'a pas été trouvé. Réessayez avec un autre identifiant."
                    return res.status(404).json({ message })
                }
                const message = `L'exercice a bien été modifié`
                res.json({message, data: exercise})
            })
        })
        .catch(error => {
            if(error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if(error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = "L'exercice n'a pas pu être modifié. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });

    // Supprimer un exercice
    app.delete("/api/exercises/:id", (req, res) => {
        Exercise.findByPk(req.params.id).then(exercise => {
            if(exercise === null) {
                const message = "L'exercice demandé n'a pas été trouvé. Réessayez avec un autre identifiant."
                return res.status(404).json({ message })
            }
            const exerciseDeleted = exercise;
            Exercise.destroy({
                where: { id_page: exercise.id_page}
            })
            .then(_ => {
                const message = `L'exercice a bien été supprimé`
                res.json({message, data: exerciseDeleted})
            })
        })
        .catch(error => {
            const message = "L'exercice n'a pas pu'être supprimé. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });
}