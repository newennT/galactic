// login.js

const { models: { User } } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privatekey = require("../auth/private_key");

module.exports = (app) => {
    app.post('/api/login', async (req, res) => {
        try {
            const user = await User.findOne({
                where: {
                    email: req.body.email
                }, 
                attributes: { include: ["password"] }
            });

            if (!user) {
                return res.status(401).json({ message: "L'utilisateur n'existe pas" });
            }

            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Le mot de passe est incorrect" });
            }

            // mettre à jour dernière connexion 
            await user.update({
                last_login: new Date()
            });

            // jwt 
            const token = jwt.sign(
                { id_user: user.id_user,
                    is_admin: user.is_admin
                 },
                privatekey,
                { expiresIn: "24h" }
            )
            const message = "Connexion réussie";
            console.log("LOGIN KEY:", privatekey);
            return res.json({ message, data: user, token });
        } catch (error) {
            console.error("LOGIN ERROR: ", error);
            return res.status(500).json({
                message: "Erreur lors de la connexion",
                data: error
            })
        }

    })
}