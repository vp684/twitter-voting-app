const express = require('express');
const router = express.Router()
const path = require('path');
const helmet = require('helmet')
const db = require('./database/db')
//load env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

//set port
const port = process.env.PORT || 5000;

//instantiate app
const app = express();
//use helmet defaults
app.use(helmet())



if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    // app.get('*', function(req, res) {
    //   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    // });
}

//start db and server using async to await db connection result before setting routes.
(async ()=>{
    try{
        //awaiting for db or error, then enable appropritate routes. no functionality with out db
        let dbase = await db()       
        router.use(require('./routes/routes')(null, dbase, app))

    }catch(err){
        console.log(err)      
        router.use(require('./routes/routes')(err))  
    }    
    //add routes
    app.use(router)
    //start server
    app.listen(port, ()=>{
        console.log(`server started on port`)
        //api server started
    })

})()

