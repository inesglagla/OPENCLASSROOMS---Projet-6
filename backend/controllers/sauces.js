const Sauce = require('../models/Sauce');
const fs = require('fs');

//Afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
  .then ((sauces) => {res.status(200).json(sauces);})
  .catch ((error) => {res.status(400).json({ error: error });});
};

//Afficher une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne ({
    _id: req.params.id
  })
  .then ((sauce) => {res.status(200).json(sauce)})
  .catch ((error) => {res.status(404).json({ error })});
};

//Créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceThing = JSON.parse(req.body.sauce);
  delete sauceThing._id;
  const sauce = new Sauce({
  ...sauceThing,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
  });
  sauce.save()
  .then((sauce) => res.status(201).json({ message: 'Sauce ajouté!'}))
  .catch(error => res.status(400).json({ error }));
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceThing = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceThing._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(403).json({ message : 'Modification non-autorisée'});
          } else {
            //Si on ne modifie pas l'image
            if (req.file == undefined) {
                Sauce.updateOne(
                  { _id: req.params.id}, 
                  { ...sauceThing, _id: req.params.id}
                  )
                .then(() => res.status(200).json({message : 'La sauce a été modifié!'}))
                .catch(error => res.status(401).json({ error }));
            //Si on modifie l'image
            } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                Sauce.updateOne(
                  { _id: req.params.id}, 
                  { ...sauceThing, _id: req.params.id}
                  )
                .then(() => res.status(200).json({message : 'La sauce a été modifié!'}))
                .catch(error => res.status(401).json({ error }));
            })
          }
        }
      })
      .catch((error) => {res.status(403).json({ error });}
  );
};

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message : 'Suppression non-autorisée'});
    } else {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'La sauce a été supprimé!'}))
          .catch(error => res.status(400).json({ error }));
      });}
    })
    .catch(error => res.status(500).json({ error }));
};

//Liker ou disliker une sauce
exports.addLikeOrDislikeSauce = (req, res) => {
  //On vérifie si un avis a déjà été donné par l'utilisateur
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (req.body.like > 1) {
      res.status(400).json({ message: "Vous ne pouvez pas donner plusieurs fois votre avis sur la sauce."});
    } else {
    //Aimer la sauce
    if (req.body.like == 1) {
        Sauce.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
        .then(() => res.status(200).json({ message: 'La sauce a été liké!' }))
        .catch((error) => res.status(400).json({ error }));

    //Ne pas aimer la sauce
    } else if (req.body.like == -1) {
      Sauce.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
        }
      )
      .then(() => res.status(200).json({ message: 'La sauce a été disliké!' }))
      .catch((error) => res.status(400).json({ error }));

    //Retirer le like ou le dislike
    } else {
      Sauce.findOne({ _id: req.params.id })
      .then((result) => {
        if (result.usersLiked.includes(req.body.userId)) {
            Sauce.findOneAndUpdate(
              { _id: req.params.id },
              { 
                $inc: { likes: -1 }, 
                $pull: { usersLiked: req.body.userId },
              }
              )
              .then(() => res.status(200).json({ message: "Le like a été retiré!" }))
              .catch((error) => res.status(400).json({ error }));
        } else if (result.usersDisliked.includes(req.body.userId)) {
            Sauce.findOneAndUpdate(
              { _id: req.params.id },
              { 
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              })
                .then(() => res.status(200).json({ message: "Le dislike a été retiré!" }))
                .catch((error) => res.status(400).json({ error }));
          }
      });
    }}
  })
};