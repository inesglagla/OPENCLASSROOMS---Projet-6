//Ce middleware demande un token d'authentification, le décode et le valide ou le refuse si il n'est pas bon
const jwt = require('jsonwebtoken');
require("dotenv").config();
const TOKEN = process.env.TOKEN;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${TOKEN}`);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    next ();
    } catch(error) {
        res.status(401).json({ error });
    }
};