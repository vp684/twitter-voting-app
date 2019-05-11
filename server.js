
const cors = require('cors')
const express = require('express');
const path = require('path');
const helmet = require('helmet')
const dbDoc = require('./database/db')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')    
const session = require('express-session')
var router

//load env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}


//set port
const port = process.env.PORT || 5000;

//instantiate app
const app = express();

const sess_options = {    
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        secure: false,  //  setup https to set to true
        maxAge: 1000 * 60 * 60 * 3,
        name: 'user'
    }
}

//express-session  prodcution values
if(app.get('env') == 'production'){
    app.set('trust proxy', 1)
    sess_options.cookie.secure = true
}
app.use(cookieParser());



var corsOption = {
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
   // exposedHeaders: ['x-auth-token']
};
//use cors
app.use(cors(corsOption))

//use helmet defaults
app.use(helmet())

//session
app.use(session(sess_options))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')))

    
        //   // Handle React routing, return all requests to React app
        // app.get('*', function(req, res) {   
        //     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
        // });
  
}

//start db and server using async to await db connection result before setting routes.
(async ()=>{
    try{
        //awaiting for db or error, then enable appropritate routes. no functionality with out db
        let doc = await dbDoc()       
        router = require('./routes/routes')(null, doc, app)

    }catch(err){
        console.log(err)      
        router = require('./routes/routes')(err)
    }    
    //add routes      
    app.use(router)
    
    //start server
    app.listen(port, ()=>{
        console.log(`server started on port ${port}`)
        //api server started
    })

})()

