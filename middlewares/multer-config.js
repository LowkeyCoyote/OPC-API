const multer = require('multer');

// Package Multer //
// Middleware de configuration de Multer //
// On enregistre les images dans le dossier image //

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};


// diskStorage => on enregistre sur le disque 
// destination => dans quel fichier on enregistre les fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // nom du dossier 'images'
    callback(null, 'images');
  },
  // quel nom de fichier utilisé ?
  filename: (req, file, callback) => {
    // créer le nom du nouveau fichier
    // nom d'origine, on split les espaces et on join
    const name = file.originalname.split(' ').join('_');
    // on remplace l'extension
    const extension = MIME_TYPES[file.mimetype];
    // name + timestamp pour le rendre unique + "." + extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

// On exporte multer complètement configuré //
// single = fichier unique

module.exports = multer({storage: storage}).single('image');