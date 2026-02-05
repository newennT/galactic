// routes/register.js

const { models: { User } } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privatekey = require("../auth/private_key");

module.exports = (app) => {
    app.post('/api/register', async (req, res) => {
        try {
            const { email, password, username } = req.body;

            if(!email || !password || !username) {
                const message = "Tous les champs sont obligatoires";
                return res.status(400).json({ message });
            }

            const existingEmail = await User.findOne({ where: { email } });
            if(existingEmail) {
                const message = "L'email est deja utilisé";
                return res.status(400).json({ message });
            }

            const hash = await bcrypt.hash(password, 10);

            const user = await User.create({
                email,
                password: hash,
                username
            });

            const token = jwt.sign(
                { id_user: user.id_user },
                privatekey,
                { expiresIn: "24h" }
            );

            res.json({ data: user, token });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    });
}