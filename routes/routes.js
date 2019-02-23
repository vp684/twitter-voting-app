const express = require('express')
const router = express.Router()    

function route(err, db){
    if(err){
        // no db or auth routes avail app is down 
        router.use('*', (req, res)=>{
            res.send({data:"Database is down no app."})
        })
    }else{
        const auth = require('./auth/auth')(db)
        router.use(auth)
    }
   
    return router
}


module.exports = route