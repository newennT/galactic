// routes/uniqueResponse.js

const { models: { UniqueResponse } } = require('../db/sequelize')
const { models: { Exercise } } = require('../db/sequelize')
const { ValidationError } = require('sequelize')
const { UniqueConstraintError } = require('sequelize')
const { Op } = require("sequelize");

module.exports = (app) => {
    // Récupérer la liste des options de type réponse unique
    app.get("/api/unique", (req, res) => {
        UniqueResponse.findAll({
            order: ["id_page"],
            include: [
                {
                    model: Exercise
                }
            ]
        })
            .then(uniqueResponse => {
                const message = "La liste des options a été récupérée"
                res.json({ message, data: uniqueResponse })
            })
            .catch(error => {
                const message = "La liste des options n'a pas pu'être récupérée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer une option de type réponse unique
    app.get("/api/unique/:id", (req, res) => {
        UniqueResponse.findByPk(req.params.id,
            {
                include: [
                    {
                        model: Exercise
                    }
                ]
            }
        )
            .then(uniqueResponse => {
                if(uniqueResponse === null) {
                    const message = "L'option de type réponse unique demandée n'a pas été trouvée"
                    return res.status(404).json({ message })
                }
                const message = "Une option de type réponse unique a bien été trouvée"
                res.json({ message, data: uniqueResponse })
            })
            .catch(error => {
                const message = "L'option de type réponse unique n'a pas pu être trouvée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Créer une option de type réponse unique
    app.post("/api/unique", (req, res) => {
        UniqueResponse.create(req.body)
            .then(uniqueResponse => {
                const message = "L'option de type réponse unique a bien été créée"
                res.json({ message, data: uniqueResponse })
            })
            .catch(error => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                const message = "L'option de type réponse unique n'a pas pu être créée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Modifier une option de type réponse unique
    app.put("/api/unique/:id", (req, res) => {
        const id = req.params.id;
        UniqueResponse.update(req.body, {
            where: { id_response: id}
        })
        .then(_ => {
            return UniqueResponse.findByPk(id).then(uniqueResponse => {
                if(uniqueResponse === null) {
                    const message = "L'option demandée n'a pas été trouvée. Réessayez avec un autre identifiant."
                    return res.status(404).json({ message })
                }
                const message = "L'option de type réponse unique a bien été modifiée"
                res.json({message, data: uniqueResponse})
            })
        })
        .catch(error => {
            if(error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if(error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = "L'option de type réponse unique n'a pas pu être modifiée. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });

    // Supprimer une option de type réponse unique
    app.delete("/api/unique/:id", (req, res) => {
        UniqueResponse.findByPk(req.params.id).then(uniqueResponse => {
            if(uniqueResponse === null) {
                const message = "L'option demandée n'a pas été trouvée. Réessayez avec un autre identifiant."
                return res.status(404).json({ message })
            }
            const uniqueResponseDeleted = uniqueResponse;
            UniqueResponse.destroy({
                where: { id_response: uniqueResponse.id_response}
            })
            .then(_ => {
                const message = "L'option de type réponse unique a bien été supprimée"
                res.json({message, data: uniqueResponseDeleted})
            })
        })
        .catch(error => {
            const message = "L'option de type réponse unique n'a pas pu être supprimé. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });
}