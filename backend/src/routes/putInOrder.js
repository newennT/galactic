// routes/putInOrder.js

const { models: { PutInOrder } } = require('../db/sequelize')
const { models: { Exercise } } = require('../db/sequelize')
const { ValidationError } = require('sequelize')
const { UniqueConstraintError } = require('sequelize')
const { Op } = require("sequelize");
const putInOrder = require('../models/putInOrder');

module.exports = (app) => {
    // Récupérer la liste des options de type order
    app.get("/api/order", (req, res) => {
        PutInOrder.findAll({
            order: ["id_page"],
            include: [
                {
                    model: Exercise
                }
            ]
        })
            .then(putInOrder => {
                const message = "La liste des options a été récupérée"
                res.json({ message, data: putInOrder })
            })
            .catch(error => {
                const message = "La liste des options n'a pas pu être récupérée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer une option de type order
    app.get("/api/order/:id", (req, res) => {
        PutInOrder.findByPk(req.params.id,
            {
                include: [
                    {
                        model: Exercise
                    }
                ]
            }
        )
            .then(putInOrder => {
                if(putInOrder === null) {
                    const message = "L'option de type order demandée n'a pas été trouvée"
                    return res.status(404).json({ message })
                }
                const message = "Une option de type order a bien été trouvée"
                res.json({ message, data: putInOrder })
            })
            .catch(error => {
                const message = "L'option de type order n'a pas pu être trouvée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Créer une option de type order
    app.post("/api/order", (req, res) => {
        PutInOrder.create(req.body)
            .then(putInOrder => {
                const message = "L'option de type order a bien été créée"
                res.json({ message, data: putInOrder })
            })
            .catch(error => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                const message = "L'option de type order n'a pas pu être créée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Modifier une option de type order
    app.put("/api/order/:id", (req, res) => {
        const id = req.params.id;
        PutInOrder.update(req.body, {
            where: { id_response: id}
        })
        .then(_ => {
            return PutInOrder.findByPk(id).then(putInOrder => {
                if(putInOrder === null) {
                    const message = "L'option demandée n'a pas été trouvée. Réessayez avec un autre identifiant."
                    return res.status(404).json({ message })
                }
                const message = "L'option de type order a bien été modifiée"
                res.json({message, data: putInOrder})
            })
        })
        .catch(error => {
            if(error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if(error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = "L'option de type order n'a pas pu être modifiée. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });

    // Supprimer une option de type order
    app.delete("/api/order/:id", (req, res) => {
        PutInOrder.findByPk(req.params.id).then(putInOrder => {
            if(putInOrder === null) {
                const message = "L'option demandée n'a pas été trouvée. Réessayez avec un autre identifiant."
                return res.status(404).json({ message })
            }
            const putInOrderDeleted = putInOrder;
            PutInOrder.destroy({
                where: { id_response: putInOrder.id_response}
            })
            .then(_ => {
                const message = "L'option de type order a bien été supprimée"
                res.json({message, data: putInOrderDeleted})
            })
        })
        .catch(error => {
            const message = "L'option de type order n'a pas pu être supprimé. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });
}