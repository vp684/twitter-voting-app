const express   = require('express')
const router    = express.Router()
const session   = require('express-session');
const passport  = require('passport')
const TwitterStrat = require('passport-twitter').Strategy

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

function route(db, app){    
    passport.use(new TwitterStrat({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        let pro = profile._json
        console.log(pro)
        done()
      }
    ));
    
    app.use(passport.initialize())

    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave:true, 
      saveUninitialized: true

    }))

    router.get('/auth/twitter/callback', ()=>{console.log('callback')}, passport.authenticate('twitter', {failureRedirect: 'https://www.duckduckgo.com'}, 
      (req, res)=>{
        console.log(req)
        res.send('somehting')
    }))

    router.get('/auth/twitter', passport.authenticate('twitter'))     
   
    return router
}
// auth/twitter/callback




module.exports = route