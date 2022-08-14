//Middleware pour contrôler les caractères minimum pour le mot de passe
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

//Schéma avec les conditions pour le mot de passe
passwordSchema
.is().min(8)
.is().max(100)
.has().uppercase(1)
.has().lowercase()
.has().digits(2)
.has().not().spaces()

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)){
        next();
    } else {
        return res.status(400).json({ message: "Le mot de passe doit être composé de 8 caractères minimum, une majuscule et deux chiffres" });
    }
};