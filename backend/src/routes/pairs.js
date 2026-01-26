// routes/pairs.js

const { models: { Pairs } } = require('../db/sequelize')
const { models: { Exercise } } = require('../db/sequelize')
const { ValidationError } = require('sequelize')
const { UniqueConstraintError } = require('sequelize')
const { Op } = require("sequelize");

module.exports = (app) => {
    // Récupérer la liste des options de type pairs
    app.get("/api/pairs", (req, res) => {
        Pairs.findAll({
            order: ["id_page"],
            include: [
                {
                    model: Exercise
                }
            ]
        })
            .then(pairs => {
                const message = "La liste des options a été récupérée"
                res.json({ message, data: pairs })
            })
            .catch(error => {
                const message = "La liste des options n'a pas pu'être récupérée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer une option de type pairs
    app.get("/api/pairs/:id", (req, res) => {
        Pairs.findByPk(req.params.id,
            {
                include: [
                    {
                        model: Exercise
                    }
                ]
            }
        )
            .then(pairs => {
                if(pairs === null) {
                    const message = "L'option de type pairs demandée n'a pas été trouvée"
                    return res.status(404).json({ message })
                }
                const message = "Une option de type pairs a bien été trouvée"
                res.json({ message, data: pairs })
            })
            .catch(error => {
                const message = "L'option de type pairs n'a pas pu être trouvée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Créer une option de type pairs
    app.post("/api/pairs", (req, res) => {
        Pairs.create(req.body)
            .then(pairs => {
                const message = "L'option de type pairs a bien été créée"
                res.json({ message, data: pairs })
            })
            .catch(error => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                const message = "L'option de type pairs n'a pas pu être créée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Modifier une option de type pairs
    app.put("/api/pairs/:id", (req, res) => {
        const id = req.params.id;
        Pairs.update(req.body, {
            where: { id_response: id}
        })
        .then(_ => {
            return Pairs.findByPk(id).then(pairs => {
                if(pairs === null) {
                    const message = "L'option demandée n'a pas été trouvée. Réessayez avec un autre identifiant."
                    return res.status(404).json({ message })
                }
                const message = "L'option de type pairs a bien été modifiée"
                res.json({message, data: pairs})
            })
        })
        .catch(error => {
            if(error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if(error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = "L'option de type pairs n'a pas pu être modifiée. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });

    // Supprimer une option de type pairs
    app.delete("/api/pairs/:id", (req, res) => {
        Pairs.findByPk(req.params.id).then(pairs => {
            if(pairs === null) {
                const message = "L'option demandée n'a pas été trouvée. Réessayez avec un autre identifiant."
                return res.status(404).json({ message })
            }
            const pairsDeleted = pairs;
            Pairs.destroy({
                where: { id_response: pairs.id_response}
            })
            .then(_ => {
                const message = "L'option de type pairs a bien été supprimée"
                res.json({message, data: pairsDeleted})
            })
        })
        .catch(error => {
            const message = "L'option de type pairs n'a pas pu être supprimé. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });
}