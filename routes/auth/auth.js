const express = require('express')
const router = express.Router()

function route(db){    
    router.get('/api/data', (req, res)=>{             
        res.send({data: `this is from the APIs`})
    })
    return router
}



module.exports = route