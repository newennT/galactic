// routes/page.js

const { models: { Page } } = require('../db/sequelize');
const { models: { Lesson } } = require('../db/sequelize');
const { models: { Exercise } } = require('../db/sequelize');
const { ValidationError } = require('sequelize');
const { UniqueConstraintError } = require('sequelize');

module.exports = (app) => {
    // Récupérer la liste des pages
    app.get("/api/pages", (req, res) => {
        Page.findAll({
            order: ["order_index"],
            include: [
                {
                    model: Lesson
                },
                {
                    model: Exercise,

                }
            ]
        })
            .then(pages => {
                const message = "La liste des pages a été récupérée"
                res.json({ message, data: pages })
            })
            .catch(error => {
                const message = "La liste des pages n'a pas pu'être récupérée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer une page
    app.get("/api/pages/:id", (req, res) => {
        Page.findByPk(req.params.id,
            {
                include: [
                    {
                        model: Lesson
                    },
                    {
                        model: Exercise
                    }
                ]
            }
        )
            .then(page => {
                if(page === null) {
                    const message = "La page demandée n'a pas été trouvée"
                    return res.status(404).json({ message })
                }
                const message = "Une page a bien été trouvée"
                res.json({ message, data: page })
            })
            .catch(error => {
                const message = "Le chapitre n'a pas pu'être trouvé. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Créer une page
    app.post("/api/pages", (req, res) => {
        Page.create(req.body)
            .then(page => {
                const message = `La page a bien été créée`
                res.json({ message, data: page })
            })
            .catch(error => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                const message = "La page n'a pas pu être créée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Modifier une page
    app.put("/api/pages/:id", (req, res) => {
        const id = req.params.id;
        Page.update(req.body, {
            where: { id_page: id}
        })
        .then(_ => {
            return Page.findByPk(id).then(page => {
                if(page === null) {
                    const message = "La page demandée n'a pas été trouvée. Réessayez avec un autre identifiant."
                    return res.status(404).json({ message })
                }
                const message = `La page a bien été modifiée`
                res.json({message, data: page})
            })
        })
        .catch(error => {
            if(error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if(error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = "Le chapitre n'a pas pu être modifié. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });

    // Supprimer une page
    app.delete("/api/pages/:id", (req, res) => {
        Page.findByPk(req.params.id).then(page => {
            if(page === null) {
                const message = "La page demandée n'a pas été trouvée. Réessayez avec un autre identifiant."
                return res.status(404).json({ message })
            }
            const pageDeleted = page;
            Page.destroy({
                where: { id_page: page.id_page}
            })
            .then(_ => {
                const message = `La page a bien été supprimée`
                res.json({message, data: pageDeleted})
            })
        })
        .catch(error => {
            const message = "La page n'a pas pu'être supprimée. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });
}