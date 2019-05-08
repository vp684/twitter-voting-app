const express   = require('express')
const router    = express.Router()
const passport  = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {body, check, validationResult} = require('express-validator/check')

const request = require('request')


function routes(doc, app){

    /**
     * Local Passport Strategy
     */
    passport.use(new LocalStrategy(
        function(username, password, done) {
            //check username password creds against db...   
          
            doc.findOne({'userName': username}, (err, result)=>{
               
                if(err)return done(err, null)//database error no user                
                if(!result)return done(null, null) //  no user name exists
                         
                bcrypt.compare(password, result.password, (err, res)=>{
                 
                    if(err)return done(err, null)
                    if(!res)return done(null, null)
 
                    return done(null, result.userName)
                })         
            })               
        }
    ));
    
    /**
     *  Array of validator functions for user and password inputs. Pass as middleware.
     */
    validatorUserPass =  [
        body('username', "Username must be atleast 2 characters and not all numbers")
            .not().isEmpty()
            .not().isNumeric()
            .isLength({min:2})
            .escape(), 
        body('password', "Password must be atleast 6 characters")                
            .isLength({min:6}) 
            .escape()
    ]

    /**
     * Validation middleware  
     */
    Validate = function(req, res, next){
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(422).json({ errors: errors.array() });
        }  
        return next()
    }
    

    /**     
     *  sign up route
     */        
    router.route('/auth/local/signup').post( validatorUserPass, Validate,
        (req, res)=>{ //insert new user form data into db check if username exists, brcypt pw
            doc.findOne({'user.username': req.body.username}, (finderr, user)=>{
                if(finderr) return res.send({errors: [{ msg: finderr}]})                
                if(user) return res.send({errors: [{msg:"User already exists try logging in"}]})      
                
                //salt and hash password
                bcrypt.hash(req.body.password, 10, function(hasherr, hash){                    
                    if(hasherr) return res.send({errors: [{ msg: 'hashing error'}]})

                    doc.create({                                                             
                        userId: req.body.username, // unique username
                        userName: req.body.username,
                        password: hash                                          
                    },(docerr, result)=>{
                        if(docerr)return res.send({errors:[{msg:docerr}]})
                        return res.send({message: "Sign up successfull! Try logging in with your new username and password"})
                        
                    }) 

                })                                                
            })                            
        }

    )
    
    //authenticate user credentials route
    router.route('/auth/local').post( validatorUserPass, Validate,

        passport.authenticate('local'),

        function(req, res){
            console.log('passed local strategy')
            if(req.user){
                console.log('user is:', req.user)
                return res.send(true)
            }
            return res.send(false)
        }
    )  
        
        


    return router

}


module.exports = routes