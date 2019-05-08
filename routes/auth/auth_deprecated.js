const express   = require('express')
const router    = express.Router()
const passport  = require('passport')
const TwitterTokenStrat = require('passport-twitter-token')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

const request = require('request')
var homeurl = 'http://127.0.0.1:3000/'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();    

}else{//set values for production mode
  //
  homeurl = 'https://voting-app-vp.herokuapp.com'//  set to heroku app address
}

function route(db, app){ 

  passport.use(new TwitterTokenStrat({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET
  },
    function(token, tokenSecret, profile, done){
      if(profile){
        return done(null, profile.id)
      }    
      return done(null, null)
    } 
  ))

  var createToken = function(auth) {    
    return jwt.sign({
      id: auth.id
    }, process.env.JWT_SECRET,
    {
      expiresIn: 60*60*24
    });
  };  
  
  var generateToken = function (req, res, next) {        
    req.token = createToken(req.auth);
    return next();
  };
  
  //final mw for twitter login. 
  var sendToken = function (req, res) {
    // res.setHeader('x-auth-token', req.token);   
    // decodeJWT(req, res)   
    let expiration = 60*60
    //credentials header
    res.header('Access-Control-Allow-Credentials', 'true');
    //create cookie
    res.cookie('auth-token', req.token , {
      httpOnly:true, 
      secure: false, // set to false in development
      expiresIn:expiration
    })    // domain:"http://127.0.0.1:5000/"
    // res.clearCookie('auth-token')
    //res.status(200).send(req.token);
    res.redirect(homeurl)
  };

  // mw to check if logged in on first visit.
  var decodeJWT = function(req, res, next){    
    let token = req.cookies['auth-token']
    let final = {loggedin: false, id: null}
    //token = token + "a"

    jwt.verify(token, process.env.JWT_SECRET, (err, decode)=>{
      if(err){          
        return res.send(final)
      }               
      final.id = decode.id
      final.loggedin = true
      return res.send(final)
    })            
  }

  router.route('/auth/logout')
    .get((req, res)=>{      
      res.clearCookie('auth-token')
      return res.send({isloggedin:false}) 
    }
  )

  //check if user is logged in
  router.route('/auth/loggedin')
    .get((req, res, next)=>{
      if(!req.cookies['auth-token']){            
        return res.json({loggedin:false})
      }      
      return next()
    }, decodeJWT , (req, res)=>{
        res.send()
    }   
  ) 

  

  //twitter token request
  router.route('/auth/twitter').post(function(req, res) {  
      
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: { 
        //oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
      }
    }, function (err, r, body) {  
    
      if (err) {
        return res.send(500, { message: err.message });
      }
      
      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';        
      return res.send(JSON.parse(jsonStr));            
    })
    
  })


 //registered twitter authentication login callback 
  router.route('/auth/twitter/callback')
    .get((req, res, next) => {
    
      request.post({
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      }, function (err, r, body) {        
        
        if (err) {
          
          return res.send(500, { message: err.message });
        }
      
        const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      
        const parsedBody = JSON.parse(bodyString);
        
        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;
        
        return next()
      });
    }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {     
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      } 
      // prepare token for APi
      req.auth = {
        id: req.user
      };
      
    return next();
    }, generateToken, sendToken);

  return router

}

module.exports = route