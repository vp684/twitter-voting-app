const express   = require('express')
const router    = express.Router()
const crypto = require('crypto')



function routes (doc){
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    router.route("/allpolls") // no authentication required.
    .get((req, res)=>{
        doc.find({'polls.0':{$exists:true}}, (err, result)=>{// finds any polls as long as array length is greater than 0
            if(err) return res.send({error: err})              
            let userPolls = result.map(user =>{
                return {
                    name: user.twitterName || user.username,
                    polls: user.polls
                }
            })         
            return res.send({polls: userPolls})
        })
    })
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    router.route("/createpoll/newpoll")
    .post((req, res)=>{
        if(req.user){   
            let randId
            let error = null
            
            crypto.randomBytes(8, (err, buf)=>{
                if(err) return error = err
                randId = buf.toString('hex')
                let query = {'userId': req.user.userId, 'polls.name': req.body.name }
                doc.findOne(query, (err, result)=>{
                    if(err) return res.send({error:'Databse Error'})                   
                    if(result) return res.send({error:'Poll Already Exists'}) // poll exists
                    let choiceArr = req.body.choices.map((val)=>{
                        return{
                            name: val, 
                            count: 0
                        }
                    })
                    let newPoll = {
                        name: req.body.name, 
                        choices: choiceArr, 
                        url: randId 
                    }                    
                    doc.updateOne({userId:req.user.userId}, {$push:{polls: newPoll }}, (err, result)=>{
                        if(err)return res.send({error: 'Update Error'})
                        if(result) return res.send({message:"", url:randId})
                    })                        
                })                                        
            })
        }
    })  

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    router.route('/api/delpoll')
        .delete((req, res)=>{
            if(!req.user) return res.send({err:"need to login first"})
            console.log(req.body.url)
            doc.update({userId: req.user.userId}, { $pull:{ polls: {url: req.body.url} }}, (err, result)=>{
                console.log(err)
                if(err)return res.send({error: 'Update Error'})
                console.log(result)
                if(result) return res.send({message:"poll deleted"})
            })                                  

        })    


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
    router.route('/getpoll/:id')
    .get((req,res)=>{
        console.log(req.params.id)
        //consider adding validation for pararms.id...
        if(req.params.id.length !== 16) return res.send({error:'invalid url'})
        let query = {'polls.url': req.params.id}
        doc.findOne(query, (err, result)=>{
            if(err)return res.send({err:'database error'})      
                     
            if(result){
                //change these to async if app gets big.
                result.polls.forEach(item=>{
                        if(item.url === req.params.id) return res.send(item)
                })                    
            }     
        })
    })    

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    router.route('/api/vote/')
    .put((req, res)=>{
        //validate user input id req.body.url
        let query = {'polls.url': req.body.url}
        doc.findOne(query, (err, result)=>{
           
            if(err) return res.send({err:"database error"})
            if(result){
                //change these to async if app gets big.
                result.polls.some((item)=>{
                    if(item.url === req.body.url){
                        let voted = item.ips.some((ipItem)=>{ return ipItem === req.ip })
                        if(voted) return res.send({err:"already voted"})    
                        //hasnt voted yet           
                        item.ips.push(req.ip)// add ip to ips list      
                        item.choices.forEach(choice =>{ if(choice.name === req.body.currentChoice) return choice.count++ })
                        doc.updateOne({userId:result.userId, "polls.url": req.body.url },{"polls.$": item }, (err, result)=>{
                            if(err)return res.send({error: "Update Error"})
                            if(result) return res.send({message:"voted!"})
                        }) 
                    }
                })
            }else{
                //shouldnt hit here
                return res.send({err:"this shouldnt happen ever..."})
            }
        })        
    })
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    router.route('/api/authaddchoice/')
    .post((req,res)=>{     
        if(!req.user) return res.send({err:"please login first"})  // must be authenticated
        if(req.body.choiceValue.length ===0) return res.send({err:'choice must have some text'}) // choice must have some text not empty
        let query = {'polls.url': req.body.url}
        doc.findOne(query, (err, result)=>{
        
            if(err) return res.send({err:"database error"})
            if(result){
                //change these to async if app gets big.
                result.polls.some((item)=>{
                    if(item.url === req.body.url){
                                             
                        let newChoice = {
                            name: req.body.choiceValue,
                            count:0
                        }

                        let exists = item.choices.some((choiceItem)=>{
                            return choiceItem.name === req.body.choiceValue
                        })
                        if(!exists){
                            doc.updateOne({userId:result.userId, "polls.url": req.body.url },{$push:{'polls.$.choices': newChoice }}, (err, result)=>{
                                if(err)return res.send({error: "Update Error"})
                                if(result) return res.send({message:"choice added"})
                            }) 
                        }
                        else{
                            return res.send({err:'choice already exists'})
                        }                        
                    }
                })
            }else{
                //shouldnt hit here
                return res.send({err:"this shouldnt happen ever..."})
            }
        })   
    })

    router.route("/api/allUserPolls")
    .get((req,res)=>{
        //if(!req.user) return res.send({err:"not logged in"})

        let query = {'userId':req.user.userId } // req.user.userId
                doc.findOne(query, (err, result)=>{
                    if(err) return res.send({error:'Database Error'})
                  
                    if(result) {
                        console.log('result', result)
                        return res.send(result)
                    }
                }) 

    })


    return router
}

module.exports = routes