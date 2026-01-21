// routes/chapter.js

const { Chapter } = require('../db/sequelize')

module.exports = (app) => {
    app.get("/api/chapters", (req, res) => {
        Chapter.findAll()
            .then(chapters => {
                const message = "La liste des chapitres a été récupérée"
                res.json({ message, data: chapters })
            })
    });

    app.get("/api/chapters/:id", (req, res) => {
        Chapter.findByPk(req.params.id)
            .then(chapter => {
                const message = "Un chapitre a bien été trouvé"
                res.json({ message, data: chapter })
            })
    });

    app.post("/api/chapters", (req, res) => {
        Chapter.create(req.body)
            .then(chapter => {
                const message = `Le chapitre ${req.body.title} a bien été créé`
                res.json({ message, data: chapter })
            })
    });

    app.put("/api/chapters/:id", (req, res) => {
        const id = req.params.id;
        Chapter.update(req.body, {
            where: { id: id}
        })
        .then(_ => {
            Chapter.findByPk(id).then(chapter => {
                const message = `Le chapitre ${chapter.title} a bien été modifié`
                res.json({message, data: chapter})
            })
        })
    });

    app.delete("/api/chapters/:id", (req, res) => {
        Chapter.findByPk(req.params.id).then(chapter => {
            const chapterDeleted = chapter;
            Chapter.destroy({
                where: { id: chapter.id}
            })
            .then(_ => {
                const message = `Le chapitre n°${chapterDeleted.id} a bien été supprimé`
                res.json({message, data: chapterDeleted})
            })
        })
    });
}