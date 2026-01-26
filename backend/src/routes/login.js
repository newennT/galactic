const { models: { User } } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privatekey = require("../auth/private_key");

module.exports = (app) => {
    app.post('/api/login', (req, res) => {
        User.findOne({
            where: {
                username: req.body.username
            },
            attributes: { include: ["password"] }
        }).then(user => {
            if(!user) {
                const message = "L'utilisateur demandé n'existe pas";
                return res.status(401).json({ message });
            }
            bcrypt.compare(req.body.password, user.password)
            .then(isPasswordValid => {
                if(!isPasswordValid) {
                    const message = "Le mot de passe est incorrect";
                    return res.status(401).json({ message });
                }

                // jwt
                const token = jwt.sign(
                    { userId: user.id_user },
                    privatekey,
                    { expiresIn: "24h" }
                )
                const message = "Connexion réussie";
                return res.json({ message, data: user, token });
            })
        })
        .catch(error => {
            console.error(error);
            const message = "La connexion n'a pas pu fonctionner. Ressayez dans quelques instants.";
            res.status(500).json({ message, data: error });
        })

    })
}