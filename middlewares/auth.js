const jwt = require('jsonwebtoken');
 


module.exports = (req, res, next) => {
   try {
       // récupération du token, il est composé du mot-clé BEARER et du Token
       // On récupère le la deuxième partie (on prends juste le Token pas le mot-clé BEARER) 
       const token = req.headers.authorization.split(' ')[1];
       // On utilise la méthode verify, on passe le token récupéré et la clé secrète 
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       // On récupère le User ID
       const userId = decodedToken.userId;
       if(req.body.userId && req.body.userId !== userId){
        res.status(403).json({error : "403: unauthorized request"})
       }
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};