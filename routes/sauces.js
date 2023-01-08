const express = require('express');

// authentification middleware //
const auth = require('../middlewares/auth');

// package to handle incoming files in http requests //
const multer = require('../middlewares/multer-config');

const router = express.Router();

const sauceCtrl = require('../controllers/sauces')
const Sauce = require('../models/Sauce');


// adding "auth" middleware to all routes, verify that the user is well connected //

// POST route, creation of a sauce //
router.post('/',auth, multer,sauceCtrl.createSauce)

// GET route, return an array with all the sauces
router.get('/',auth,sauceCtrl.getAllSauces)

// GET route, return a specific sauce //
router.get('/:id', auth, sauceCtrl.getOneSauce)

// PUT route, modify a sauce //
router.put('/:id', auth, multer, sauceCtrl.modifySauce)

// DELETE route, delete a sauce //
router.delete('/:id', auth,sauceCtrl.deleteSauce)

// POST route, adding like or dislike to a sauce //
router.post('/:id/like', auth, sauceCtrl.likeSauce)


module.exports = router;