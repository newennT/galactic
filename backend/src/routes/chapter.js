// routes/chapter.js

const { Chapter } = require('../db/sequelize')

module.exports = (app) => {
    // Récupérer la liste des chapitres
    app.get("/api/chapters", (req, res) => {
        Chapter.findAll()
            .then(chapters => {
                const message = "La liste des chapitres a été récupérée"
                res.json({ message, data: chapters })
            })
            .catch(error => {
                const message = "La liste des chapitres n'a pas pu'être récupérée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer un chapitre
    app.get("/api/chapters/:id", (req, res) => {
        Chapter.findByPk(req.params.id)
            .then(chapter => {
                if(chapter === null) {
                    const message = "Le chapitre demandé n'a pas été trouvé"
                    return res.status(404).json({ message })
                }
                const message = "Un chapitre a bien été trouvé"
                res.json({ message, data: chapter })
            })
            .catch(error => {
                const message = "Le chapitre n'a pas pu'être trouvé. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Créer un chapitre
    app.post("/api/chapters", (req, res) => {
        Chapter.create(req.body)
            .then(chapter => {
                const message = `Le chapitre ${req.body.title} a bien été créé`
                res.json({ message, data: chapter })
            })
            .catch(error => {
                const message = "Le chapitre n'a pas pu être créé. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Modifier un chapitre
    app.put("/api/chapters/:id", (req, res) => {
        const id = req.params.id;
        Chapter.update(req.body, {
            where: { id: id}
        })
        .then(_ => {
            return Chapter.findByPk(id).then(chapter => {
                if(chapter === null) {
                    const message = "Le chapitre demandé n'a pas été trouvé. Réessayez avec un autre identifiant."
                    return res.status(404).json({ message })
                }
                const message = `Le chapitre ${chapter.title} a bien été modifié`
                res.json({message, data: chapter})
            })
        })
        .catch(error => {
            const message = "Le chapitre n'a pas pu être modifié. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });

    // Supprimer un chapitre
    app.delete("/api/chapters/:id", (req, res) => {
        Chapter.findByPk(req.params.id).then(chapter => {
            if(chapter === null) {
                const message = "Le chapitre demandé n'a pas été trouvé. Réessayez avec un autre identifiant."
                return res.status(404).json({ message })
            }
            const chapterDeleted = chapter;
            Chapter.destroy({
                where: { id: chapter.id}
            })
            .then(_ => {
                const message = `Le chapitre n°${chapterDeleted.id} a bien été supprimé`
                res.json({message, data: chapterDeleted})
            })
        })
        .catch(error => {
            const message = "Le chapitre n'a pas pu'être supprimé. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });
}