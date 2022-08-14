const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config();
const TOKEN = process.env.TOKEN;

//Validité de l'adresse email avec regEx
emailValidity = (email) => {
    return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
}

//Système d'inscription
exports.signup = (req, res, next) => {
    if (emailValidity(req.body.email)) {
        console.log(req.body.password);
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Compte créé!' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    } else {
        return res.status(401).json({ message: "L'adresse email n'est pas valide!" });
    }
};

//Système de connexion
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                return res.status(401).json({ message: 'Mot de passe ou adresse incorrect!' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ message: 'Mot de passe ou adresse incorrect!' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign (
                            { userId: user._id },
                            `${TOKEN}`,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};