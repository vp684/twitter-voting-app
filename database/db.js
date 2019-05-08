const mongo = require('mongodb').MongoClient
const mongoose = require('mongoose')
var Schema = mongoose.Schema;
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
           mongoose.connect(process.env.MLAB_URI, {useNewUrlParser: true}).then(()=>{
               //mongoose connect resolves to undefined set db manually
                console.log('new db resolved')
                var voteSchema = new Schema({             

                    userId: String, //twitter id or local user name
                    userName: String, //twitter name also local username.
                    password: String, // local user pw

                    polls: [{ 
                        _id: false,
                        name: String, //name of poll
                        url: String,
                        ips:[String], //list of ips that have already voted for this poll, votes limited to one per ip
                        choices: [{  
                            _id:false,
                            name: String, //name of voting option
                            count: Number //  number of times this option has been submitted. 
                        }]
                    }]
                
                })
                var doc = mongoose.model('User', voteSchema)    

                resolve(doc)
           },(err)=>{
               console.log('Database error:' + err)
               reject(err)
            })           
        }
       

    })
    
}

module.exports = connect