const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const helmet = require('helmet')

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

require('dotenv').config()

const app = express();



app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'"]
  }
}));


// importer module dotenv
// from dotenv pour password et user
// dotenv gitignore



// database connexion //
mongoose.connect(`mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@atlascluster.gqz29cn.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  app.use(express.json());

  // general middleware, for all requests //

  app.use((req, res, next) => {
    // everybody can access to our API //
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Allowing headers //
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Allowing request types//
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });



app.use('/api/auth', userRoutes)
app.use('/api/sauces',sauceRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;