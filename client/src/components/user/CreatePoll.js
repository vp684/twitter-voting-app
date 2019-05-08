import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';



const styles = theme =>({
    root:{
        textAlign:"center"
        
    }, 
    paperContainer:{   
        display:"inline-block", 
        verticalAlign:"middle",
        width: 'auto',
        height: "auto",
        margin: theme.spacing.unit * 3

    }, 
    text:{
        padding: "15px 0px 15px 0px", 
        fontWeight: "bold"
    },
    errors:{
        color:"red"
    }

    
})






class CreatePoll extends React.Component {

    state={
        user: null,
        pollName: '',
        choiceArray:[1,2],
        choiceValues:[], 
        choiceNameError:null, 
        choiceValueError:null // index is choice number, false or true is if theres an error.
    }

    handlePollNameChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
        
    };

    handleChoiceNameChange = index => event =>{
      let temp = this.state.choiceValues
      temp.splice(index, 1, event.target.value)
      this.setState({choiceValues: temp}, ()=>{
          console.log(this.state.choiceValues)
      })

    }

    addChoice = () =>{
        let temp = this.state.choiceArray
        let newItem = temp[temp.length-1] +1
        temp.push(newItem)
        return this.setState({choiceArray: temp})        
    }
    
    removeChoice= () =>{
        let tempChoice = this.state.choiceArray
        let tempChoiceVal = this.state.choiceValues
        tempChoice.pop() //remove the component
        tempChoiceVal.pop() // remove the text
        this.setState({
            choiceArray: tempChoice, 
            choiceValues: tempChoiceVal
        })
    }
    checkErrors = ()=>{
           //make sure choices and name arent empty.
           let nameError = false
           let valError = false
           if(this.state.pollName.length === 0){
               //no name return with error            
               nameError = true
           }
          
           if(this.state.choiceValues.length < 2){
               //minimum of first two choices need to have text.
               //return some error first two choices need text.
               valError = true
           }else if(this.state.choiceValues.length !== 0){            
               for(let i=0; i < 2; i++){
                   if(this.state.choiceValues[i].trim().length === 0){
                      valError = true
                   }
               }            
           }
   
          
          if(nameError || valError){
              //have one or more errors, dont call api , display errors.
              if(nameError){
                   this.setState({choiceNameError: 'Name field must have text'})
              }
              if(valError){
                  this.setState({choiceValueError:'First two choices must have text'})
              }
              return
          }
          this.submitPoll()
         

    }

    submitPoll =() =>{
        console.log('api call')
        this.setState({choiceNameError: null, choiceValueError: null})
        var poll ={
            name: this.state.pollName,
            choices: this.state.choiceValues
        }

        window.fetch('/createpoll/newpoll', {
                method: "POST", 
                headers: {
                "Content-Type": "application/json"        
                },
                body: JSON.stringify(poll)
            })
            .then(response=>{     
            console.log(response)
             return response.json()
            })
            .then(data=>{      
                if (data) {        
                   console.log(data)
                }
              
            })    
            return
    
    }



    render(){
        const { classes } = this.props;
        var choices = this.state.choiceArray.map((item, index)=>{
            
            return <div key={index.toString()}>
                <Typography>Choice #{index + 1}</Typography>
                <TextField 
                    id="outlined-name"
                 
                    label="Choice"
                    className={classes.textField}     
                    onChange={this.handleChoiceNameChange(index)}
                    margin="normal"                     
                    variant="outlined"
                />

            </div>
           
        })
    
        
        return(
            <div className={classes.root}>

            <Paper className={classes.paperContainer}>
                <form >
                <Typography className={classes.text}>Create A Poll</Typography>
                <Typography>Name Of Poll</Typography>
                
                {this.state.choiceNameError && <Typography className={classes.errors}>{this.state.choiceNameError}</Typography>}
                <TextField
                        id="outlined-name"
                        label="Name"
                        className={classes.textField}
                        value={this.state.pollName}
                        onChange={this.handlePollNameChange('pollName')}
                        margin="normal"
                        variant="outlined"
                    />

                    <Typography className={classes.text}>Choices</Typography>
                    {this.state.choiceValueError && <Typography className={classes.errors} >{this.state.choiceValueError}</Typography>}             
                    <div className="root">
                        {choices}
                    </div>

                    <div>
                    <Button onClick={this.addChoice}>Add Choice</Button>
                    {this.state.choiceArray.length > 2 && <Button onClick={this.removeChoice}>Remove Choice</Button> }
                    
                    </div>

                    <Button onClick={this.checkErrors}>Create Poll</Button>                              
                
                </form>

            </Paper>

            </div>
          
          
        )
    }




}


export default withStyles(styles)(CreatePoll);