const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const checkSauce = require('../middleware/validationSauce')

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, checkSauce, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.addLikeOrDislikeSauce);

module.exports = router;