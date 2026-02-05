// routes/chapter.js

const auth = require('../auth/auth');
const { models: { User }, models } = require('../db/sequelize');
const { models: { Chapter } } = require('../db/sequelize');
const { ValidationError } = require('sequelize');
const { UniqueConstraintError } = require('sequelize');

module.exports = (app) => {
    // Récupérer la liste des utilisateurs
    app.get("/api/users", (req, res) => {
        User.findAll({
            order: ["last_login"],
            include: [
                {
                    model: Chapter,
                    through: {
                        attributes: []
                    }
                }
            ]
        })
            .then(users => {
                const message = "La liste des utilisateurs a été récupérée"
                res.json({ message, data: users })
            })
            .catch(error => {
                const message = "La liste des utilisateurs n'a pas pu être récupérée. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer un utilisateur
    app.get("/api/users/:id", (req, res) => {
        User.findByPk(req.params.id)
            .then(user => {
                if(user === null) {
                    const message = "L'utilisateur demandé n'a pas été trouvé"
                    return res.status(404).json({ message })
                }
                const message = "Un utilisateur a bien été trouvé"
                res.json({ message, data: user })
            })
            .catch(error => {
                const message = "L'utilisateur n'a pas pu être trouvé. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Récupérer l'utilisateur connecté 
    // app.get("/api/users/me", auth, async (req, res) => {
    //     try {
    //         const user = await User.findByPk(req.auth.id_user);

    //         if (!user) {
    //         return res.status(404).json({ message: "Utilisateur introuvable" });
    //         }

    //         res.json({ user });

    //     } catch (error) {
    //         res.status(500).json({ message: error.message });
    //     }
    // });

    // Créer un utilisateur
    app.post("/api/users", (req, res) => {
        User.create(req.body)
            .then(user => {
                const message = `L'utilisateur ${req.body.pseudo} (${user.email}) a bien été créé`
                res.json({ message, data: user })
            })
            .catch(error => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                const message = "L'utilisateur n'a pas pu être créé. Réessayez dans quelques instants."
                res.status(500).json({ message, data: error })
            })
    });

    // Modifier un utilisateur
    app.put("/api/users/:id", (req, res) => {
        const id = req.params.id;
        User.update(req.body, {
            where: { id_user: id}
        })
        .then(_ => {
            return User.findByPk(id).then(user => {
                if(user === null) {
                    const message = "L'utilisateur demandé n'a pas été trouvé. Réessayez avec un autre identifiant."
                    return res.status(404).json({ message })
                }
                const message = `L'utilisateur ${user.pseudo} a bien été modifié`
                res.json({message, data: user})
            })
        })
        .catch(error => {
            if(error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            if(error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }
            const message = "L'utilisateur n'a pas pu être modifié. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });

    // Supprimer un utilisateur
    app.delete("/api/users/:id", (req, res) => {
        User.findByPk(req.params.id).then(user => {
            if(user === null) {
                const message = "L'utilisateur demandé n'a pas été trouvé. Réessayez avec un autre identifiant."
                return res.status(404).json({ message })
            }
            const userDeleted = user;
            User.destroy({
                where: { id_user: user.id_user }
            })
            .then(_ => {
                const message = `L'utilisateur n°${chapterDeleted.pseudo} a bien été supprimé`
                res.json({message, data: userDeleted})
            })
        })
        .catch(error => {
            const message = "L'utilisateur n'a pas pu'être supprimé. Réessayez dans quelques instants."
            res.status(500).json({ message, data: error })
        })
    });
}