const express   = require('express')
const router    = express.Router()
const session   = require('express-session');
const passport  = require('passport')
const TwitterStrat = require('passport-twitter').Strategy
const TwitterTokenStrat = require('passport-twitter-token')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const request = require('request')
var homeurl = 'http://localhost:3000'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();    
}else{
  //
  homeurl = ''//  set to heroku app address
}

function route(db, app){ 

    //rest API requirements
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());



  passport.use(new TwitterTokenStrat({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET
  },
    function(token, tokenSecret, profile, done){
      if(profile){
        console.log(profile.id)
        return done(null, profile.id)
      }
      return done(null, null)
    } 
  ))

  var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };
  app.use(cors(corsOption));



  var createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    }, 'my-secret-is-super-secret',
    {
      expiresIn: 60 * 60 * 120
    });
  };
  
  var generateToken = function (req, res, next) {
    
    req.token = createToken(req.auth);
    return next();
  };
  
  var sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    console.log(res.getHeaders())
    
    return res.redirect('http://localhost:3000');
  };

  
  //token handling middleware
  var authenticate = expressJwt({
    secret: 'my-secret-is-super-secret',
    requestProperty: 'auth',
    getToken: function(req) {
      if (req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
      }
      return null;
    }
  });

  router.route('/auth/twitter')
  .post(function(req, res) {
    
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: { 
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",         //http%3A%2F%2Flocalhost%3A5000%2Ftwitter%2Fcallback
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET
      }
    }, function (err, r, body) {  
     
      if (err) {
        return res.send(500, { message: err.message });
      }
   
      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';     
       
      res.send(JSON.parse(jsonStr));
      
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

    next()
  });
}, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {     
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    } 
    // prepare token for API

    console.log('user success')
    req.auth = {
      id: req.user.id
    };

    return next();
}, generateToken, sendToken);

    return router
}




module.exports = route

   // app.use(session({
  //     secret: process.env.SESSION_SECRET,
  //     resave:true, 
  //     saveUninitialized: true

  //   }))
  //   app.use(bodyParser.urlencoded({
  //     extended: true
  //   }));
  //   app.use(bodyParser.json());

  //   passport.use(new TwitterStrat({
  //     consumerKey: process.env.TWITTER_CONSUMER_KEY,
  //     consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  //     callbackURL: "http://127.0.0.1:5000/auth/twitter/callback"
  //   },
  //   function(token, tokenSecret, profile, done) {       
  //     //console.log(token, tokenSecret, profile)
  //     done(null, profile)
  //   }
  // ));        



  // passport.serializeUser(function(user, callback){
  //   callback(null, user);
  // });
  // passport.deserializeUser(function(object, callback){
  //   callback(null, object);
  // });

  // app.use(passport.initialize())
  // app.use(passport.session())

  

  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5000");
  //   res.header("Access-Control-Allow-Credentials", "true");
  //   res.header("Access-Control-Allow-Headers", "Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With, X-Custom-Header");
  //   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  //   next();
  // });

  // function ensureAuthenticated(req, res, next) {  
  //   if (req.isAuthenticated()) {
  //     console.log('is authorized')
  //       return next();
  //   }
  //   console.log('is not auth')
  //   res.redirect('/');
  // };


  //  router.post('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: 'http://127.0.0.1:3000'}),  (req, res)=>{
  //   //console.log(req.user)
  //   res.redirect('http://127.0.0.1:3000')
  //    })

  //  router.post('/auth/twitter/', passport.authenticate('twitter'));  
  


