const express   = require('express')
const router    = express.Router()
const passport  = require('passport')
const TwitterTokenStrategy = require('passport-twitter-token');
const request = require('request')


var homeurl = 'http://127.0.0.1:3000'

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();    

}else{//set values for production mode
  //
  homeurl = 'https://twitter-voting-app.herokuapp.com'//  set to heroku app address
}

function routes(doc){

    passport.use(new TwitterTokenStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET
    }, 
        function(token, tokenSecret, profile, done){ 
           
            if(profile){ //twitter returned authenticated profile.              
              doc.findOne({'userId': profile.id}, (err, result)=>{
                if(err)return done(err, null)//database error no user                
                if(!result){
                  //insert to db and return profile with done.
                  doc.create({                                                                              
                    userId: profile.id, //  twitter id.                       
                    userName: profile.username
                  },(docerr, result)=>{
                    if(docerr)return res.send({errors:[{msg:docerr}]})
                    console.log(result)
                    //return new profile.
                    return done(null, result)
                  }) 
                }else{
                  //result exists return profile.
                  return done(null,result)
                }                              
              })
                     
            }else{
              return done(null, null)
            }    
           // not authenticated profile.            
    }))
   

      

    router.route('/auth/twitter')
        .post(function(req, res) {  
    
        request.post({
            url: 'https://api.twitter.com/oauth/request_token',
            oauth: { 
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
    }, passport.authenticate('twitter-token', {session: true}), function(req, res, next) {     
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      } 
      // prepare token for APi
      req.auth = {
        id: req.user
      };
    //  console.log("auth/twitter/callback", req.user)
      
        return res.redirect(homeurl)
    });
    

    return router
}

module.exports = routes