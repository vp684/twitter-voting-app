const express = require('express')
const router = express.Router()    

function route(err, db, app){
    if(err){
        // no db or auth routes avail app is down 
        // router.use('*', (req, res)=>{
        //     res.send({data:"Database is down no app."})
        // })
        console.log(err)
    }else{
        const auth = require('./auth/auth')(db, app)
        router.use(auth)
    }
   
    return router
}


module.exports = route