const Sauce = require('../models/Sauce');

// file system module //
const fs = require('fs')

// Creation of a sauce //
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // create new Sauce object with informations given and based fields//
    const sauce = new Sauce({
        ...sauceObject,
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked : [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(201).json({message : 'Sauce enregistré'}))
        .catch((error => res.status(400).json({error})))
}

// Get all sauces //
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({error}))
}

// Get one sauce //
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}))
}

// delete one sauce //
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({message : "Sauce supprimée"}))
                .catch(error => res.status(400).json({ error }));
            })
    })
    .catch(error => res.status(500).json({error}))
}

// modify one sauce //
exports.modifySauce = (req, res, next) => {

    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
        
        Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
               Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
}

// modify like or dislike //
exports.likeSauce = (req, res, next) => {

    switch(req.body.like){

        // a sauce is liked //
        case 1:
            // increment by one likes, push userId into userLiked array //
            Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
                _id: req.params.id
              })
                .then(() => { res.status(200).json({ message: 'sauce liked !' }); })
                .catch((error) => { res.status(400).json({ error: error }); });
                break;

            // decrement by one likes, push UserId into userDisliked array //
        case -1:
           Sauce.updateOne({ _id: req.params.id }, {
               $inc: { likes: -1 },
                $push: { usersDisliked: req.body.userId },
                _id: req.params.id })
                .then(() => { res.status(200).json({ message: 'sauce disliked !' }); })
                .catch((error) => { res.status(400).json({ error: error }); });
                break;    



        case 0:
            Sauce.findOne({_id : req.params.id})    
            .then((sauce) => {
                // if userId is in liked array, decrement like by one and pull out userId from usersLiked array //
                if(sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                      .then(() => { res.status(200).json({ message: 'sauce liked !' }); })
                      .catch((error) => { res.status(400).json({ error: error }); });
                    }

                 // if userId is in disliked array, increment like by one and pull out userId from usersDisliked array //
                if(sauce.usersDisliked.includes(req.body.userId)){
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: 1 },
                        $pull: { usersDisliked: req.body.userId },
                        _id: req.params.id
                    })
                    .then(() => { res.status(200).json({ message: 'sauce liked !' }); })
                    .catch((error) => { res.status(400).json({ error: error }); });  
                    }       
            })
            .catch((error) => { res.status(404).json({ error: error }); });
            break;
    }

}





