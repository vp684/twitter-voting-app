const express = require('express')
const router = express.Router()
const passport = require('passport')

function routes(err, dbDoc, app){
    if(err){
        // no db or auth routes avail app is down 
        // router.use('*', (req, res)=>{
        //     res.send({data:"Database is down no app."})
        // })
        console.log(err)
    }else{
        
        //add passport
        app.use(passport.initialize())
        app.use(passport.session())

        //passport settings
        passport.serializeUser(function(user, done) {
            if(user){
                return done(null, user);
            }
            done(null, false);
        });
        
        passport.deserializeUser(function(id, done) {
            //search database for user and return user data.
            done(null, id)
        });
       

        const twitterauth = require('./auth/twitterlogin')(dbDoc)   
        const polls = require('./data/polls')(dbDoc, app)
             
        router.use(twitterauth)
        router.use(polls)

         //
        router.route('/auth/loggedin')
            .get((req, res)=>{
            // console.log('here', req.session)
            let final = {loggedin: false, id: null}
            if(req.user){
                final.id = req.user
                final.loggedin = true
            }          
            return res.send(final)
            
        })

        router.route('/auth/logout')
            .get((req, res)=>{
                if(req.user){
                    console.log('logging out')
                    req.logout()
                }
            console.log('returning logging out')
            return res.end()
        }) 
        
        
    }
   
    return router
}


module.exports = routes