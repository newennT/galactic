// auth/auth.js

const jwt = require("jsonwebtoken");
const privatekey = require("./private_key");

module.exports = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization 

        if(!authorizationHeader) {
            const message = "Vous n'avez pas passé de token";
            return res.status(401).json({ message });
        }
    
        const parts = authorizationHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: "Format du token invalide" });
        }

        const token = parts[1];

        const decodedToken = jwt.verify(token, privatekey);
        console.log(decodedToken);

        req.auth = {
            id_user: decodedToken.id_user,
            is_admin: decodedToken.is_admin
        };
        console.log("AUTH KEY:", privatekey);
        next();


    } catch (error) {
        const message = "L'utilisateur n'est pas autorisé à accéder à la ressource";
        return res.status(401).json({ message, data: error.message });
    }
}