// auth/auth.js

const jwt = require("jsonwebtoken");
const privatekey = require("./private_key");

module.exports = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization 
        if(!authorizationHeader) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const parts = authorizationHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: "Unauthorized" });
        }
    
        const token = parts[1];
        const decodedToken = jwt.verify(token, privatekey);

        req.auth = {
            id_user: decodedToken.id_user,
            is_admin: decodedToken.is_admin
        };
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}