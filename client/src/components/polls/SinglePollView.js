import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {TwitterShareButton} from 'react-twitter-embed'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Button } from '@material-ui/core';
import {Pie} from 'react-chartjs-2'



const styles = theme =>({
    root:{     
        textAlign:"center"
    }, 
    paperContainer: {        
        display:"inline-block", 
        verticalAlign:"middle",
        width: 'auto',      
        margin: 10,
        paddingTop: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 5,
        paddingRight: theme.spacing.unit * 5,
        paddingBottom: theme.spacing.unit * 3
    }, 
    choicePaper: {
        width: 'auto',
        margin: 10     
    },
    share:{
        padding:10,
        textAlign:'center'
    }, 
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    textBtnContainer: {
        display: 'flex', 
        padding: 10,
        justifyContent: 'center'
    }, 
    textContainer: {
        
    }, 
    buttonContainer: {
        display:'flex'
    }

})



const chartOpts ={
    maintainAspectRatio: true 
}

const legendOpts = {
    display: false,
    position: 'top',
    fullWidth: true,
    reverse: false,
    labels: {
        padding: 40, 
        fontSize: 12, 
        boxWidth: 50, 
        usePointStyle: true
      
    }
  };



class SinglePollView extends React.Component{   

    state ={
        isLoggedIn: true, //this.props.isLoggedIn,     
        url: this.props.match.params.id,
        choiceValue:'',
        poll:{
            vote:{}
        },
        message: null,
        currentChoice:null, 
        chartData: {
            labels: [], //array of Strings
            datasets: [{
                data: [],// array of Numbers
                backgroundColor: [
                'red',
                '#36A2EB',
                '#FFCE56'
                ],
                hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
                ]
            }]
        }
    } 

    handleChange = this.handleChange.bind(this)
   // submitVote = this.submitVote.bind(this)
    authenticatedAddChoice = this.authenticatedAddChoice.bind(this)
   

    handleChange(event){  
        this.setState({currentChoice: event.target.value})  
    }

    submitVote = ()=>{   
        if(!this.state.currentChoice) return
        
        let url = '/api/vote/'
        fetch(url, {
            method: "PUT", 
            headers: {
            "Content-Type": "application/json"        
            },
            body: JSON.stringify(this.state)
        })
        .then((response)=>{                
            return response.json()
        })
        .then((data)=>{
            this.getPollData()
            if (data.err) {               
                alert("Only one vote per IP")
            }   
            
        })

    }

    authenticatedAddChoice(){
        let url = '/api/authaddchoice/'
        fetch(url, {
            method: "POST", 
            headers: {
            "Content-Type": "application/json"        
            },
            body: JSON.stringify(this.state)
        })
        .then((response)=>{          
            return response.json()
        })
        .then((data)=>{

            if(data.err) return alert(data.err)

            if(data){
                this.getPollData()
                           
            }              
        })
    }

    handleChoiceNameChange =()=>event=>{
        this.setState({choiceValue: event.target.value})
  
    }

    getPollData=()=>{       
        let url = '/getpoll/'+ this.state.url
        fetch(url)
        .then((response)=>{            
            return response.json()
        })
        .then((data)=>{

            if(data.err) return

            if(data){                
                let lbls = data.choices.map((itm)=>{
                    return itm.name
                })
                let counts = data.choices.map((itm)=>{
                    return itm.count
                })
                
                this.setState({
                    poll:data,
                    chartData: {
                        labels: lbls, //array of Strings
                        datasets: [{
                            data: counts// array of Numbers                         
                        }]
                    }
                })
            }              
        })
    }


    componentDidMount(){
       this.getPollData()
    }

   render(){
       const {classes} = this.props
       let choices = this.state.poll.choices
       let pollName = this.state.poll.name  
       let shareUrl = "https://twitter-voting-app.herokuapp.com/poll/" + this.state.url     
       return(
        <div className={classes.root}>          

            <Paper className={classes.paperContainer}>
                <Typography variant="h6">{pollName + ' Poll'}</Typography>
                    
                <FormControl className={classes.formControl}>
                    
                    <RadioGroup
                        className={classes.group}            
                        onChange={this.handleChange}                                        
                    >
                    {choices && choices.map((item, index)=>  
                        <FormControlLabel  key={index} value={item.name} control={<Radio />} label={item.name} />
                    )}                                                                                                                                               
                    </RadioGroup>                                        
                    <Button onClick={this.submitVote}>Submit Vote</Button>
                </FormControl>                              
            </Paper>                                             
            
            <Paper className={classes.paperContainer}>
               <Typography variant="h6">Results</Typography> 
           
                <Pie data={this.state.chartData} 
                    width={250}
                    height={250}
                    legend={legendOpts}
                    options={chartOpts}>
                </Pie>   
                <div className={classes.share}>

                <TwitterShareButton
                    className={classes.share}
                    url={shareUrl}
                    options={{ size:"large", text: 'Check out my poll "'+ pollName +'" at: ' }}

                />                

                </div>     
               
              
                                                         
            </Paper>

            {this.props.isLoggedIn 
            }
            
            <Paper className={classes.choicePaper}>
                <Typography variant="h6">Add a new choice</Typography>
                <form>       
                    <div className={classes.textBtnContainer}>
                        <section className={classes.textContainer}>
                            <TextField 
                            id="outlined-name"                 
                            label="Choice"
                            className={classes.textField}     
                            onChange={this.handleChoiceNameChange()}                                       
                            variant="outlined"
                            />
                        </section>
                    
                        <section className={classes.buttonContainer}> 
                               <Button  onClick={this.authenticatedAddChoice}>Add Choice</Button>
                        </section>
                        
                    
                    </div>                       
               
                </form>
                
            </Paper>
        </div>
       )
   }
}

export default withStyles(styles)(SinglePollView)