
// encryption package, hash the password so as not to store it in plain text //
const bcrypt = require('bcrypt');

// package allowing to create and verify token //
const jwt = require('jsonwebtoken');

const User = require('../models/User');



exports.signup = (req, res, next) => {
    // 10 = salt, number of times the password is hashed //
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {
    // Check if the email exist in database //
    User.findOne({ email: req.body.email })
        .then(user => {
            // the user does not exist //
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }

            // compare the user password and the password client//
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // not valid //
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId : user._id},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn : '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };