const mongo = require('mongodb').MongoClient
var database =  null
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

//returns a promise resolving to a database object
function connect(){

    return new Promise((resolve, reject)=>{
      
        if(database){
            //already connected to db 
            console.log('have db')
            resolve(database)        
           
       }else{
           console.log('connecting db')
           mongo.connect(process.env.MLAB_URI, {useNewUrlParser: true}, (err, db)=>{
            if(err){
                //handle db error.  front end shouldnt be able to login etc...
                console.log('Database error: ' + err)
                reject(err)
            }else{
                // connected to db...
                database = db.db('fcc');       
                console.log('new db resolved')
                resolve(database)                     
            }
        })   
           
       }
       

    })
    
}

module.exports = connect