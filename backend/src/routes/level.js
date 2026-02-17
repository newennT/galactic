// routes/level.js

const { models: { Level } } = require('../db/sequelize')
const { models: { Chapter } } = require('../db/sequelize')
const { ValidationError } = require('sequelize')
const { UniqueConstraintError } = require('sequelize')
const { Op } = require("sequelize");

module.exports = (app) => {
    // Récupérer la liste des niveaux
    app.get("/api/levels", (req, res) => {
        if(req.query.title) {
            const title = req.query.title
            return Level.findAll({
                where: {
                    title: {
                        [Op.like]: `%${title}%`
                    }
                },
                order: ["title"]
            })
            .then(levels => {
                const message = `Il y a ${levels.length} niveaux qui correspondent au titre ${title}`
                res.json({ message, data: levels })
            })
        }
        Level.findAll({
            order: ["title"],
            include: [
                {
                    model: Chapter,
                }
            ]
        })
            .then(levels => {
                const message = "La liste des niveaux a été récupérée"
                res.json({ message, data: levels })
            })
            .catch(error => {
                const message = "La liste des niveaux n'a pas pu'être récupérée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer un niveau
    app.get("/api/levels/:id", (req, res) => {
        Level.findByPk(req.params.id,
            {
                include: [
                    {
                        model: Chapter,
                    }
                ]
            }
        )
            .then(level => {
                if(level === null) {
                    const message = "Le niveau demandé n'a pas été trouvé"
                    return res.status(404).json({ message })
                }
                const message = "Un niveau a bien été trouvé"
                res.json({ message, data: level })
            })
            .catch(error => {
                const message = "Le niveau n'a pas pu'être trouvé. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Créer un niveau
    app.post("/api/levels", (req, res) => {
        Level.create(req.body)
            .then(level => {
                const message = `Le niveau ${req.body.title} a bien été créé`
                res.json({ message, data: level })
            })
            .catch(error => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                const message = "Le niveau n'a pas pu être créé. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Modifier un niveau
    app.put("/api/levels/:id", (req, res) => {
        const id = req.params.id;
        Level.update(req.body, {
            where: { id_level: id}
        })
        .then(_ => {
            return Level.findByPk(id).then(level => {
                if(level === null) {
                    const message = "Le niveau demandé n'a pas été trouvé. Réessayez avec un autre identifiant."
                    return res.status(404).json({ message })
                }
                const message = `Le niveau ${level.title} a bien été modifié`
                res.json({message, data: level})
            })
        })
        .catch(error => {
            if(error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if(error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = "Le niveau n'a pas pu être modifié. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });

    // Supprimer un niveau
    app.delete("/api/levels/:id", (req, res) => {
        Level.findByPk(req.params.id).then(level => {
            if(level === null) {
                const message = "Le niveau demandé n'a pas été trouvé. Réessayez avec un autre identifiant."
                return res.status(404).json({ message })
            }
            const levelDeleted = level;
            Level.destroy({
                where: { id_level: level.id_level}
            })
            .then(_ => {
                const message = `Le niveau ${levelDeleted.title} a bien été supprimé`
                res.json({message, data: levelDeleted})
            })
        })
        .catch(error => {
            const message = "Le niveau n'a pas pu'être supprimé. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });
}