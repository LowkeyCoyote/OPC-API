const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const router = express.Router();

const sauceCtrl = require('../controllers/sauces')

// ajouter auth sur toutes les routes, pour vérifier l'authentification //


const Sauce = require('../models/Sauce');

router.post('/',auth, multer,sauceCtrl.createSauce)
router.get('/',auth,sauceCtrl.getAllSauces)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth,sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.likeSauce)


module.exports = router;