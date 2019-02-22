const express = require('express');
const path = require('path');
const helmet = require('helmet')
const mongo = require('mongodb')


//load env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}
const port = process.env.PORT || 5000;

const app = express();
//use helmet defaults
app.use(helmet())


if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

   //connect to db on err report to user no functionality
   mongo.connect(process.env.MLAB_URI, {useNewUrlParser: true}, (err, db)=>{
    if(err){
        //handle db error.  front end shouldnt be able to login etc...
        console.log('Database error: ' + err)
    }else{
        // connected to db...
        //get db
        let database = db.db('fcc')

        //routes
        app.get('/api/data', (req, res)=>{
            res.send({data: `this is from the API `})               
        })


    }

})

app.listen(port, ()=>{

    console.log(`server started on port`)
    //api server started

 

})







