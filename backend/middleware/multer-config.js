//Middleware contenant la configuration pour multer (pour les images)
const multer = require('multer');

//Types d'images acceptées
const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png',
};

//Destination des images
const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.fieldname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
});

module.exports = multer({storage: storage}).single('image');