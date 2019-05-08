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
import FormLabel from '@material-ui/core/FormLabel';
import { Button } from '@material-ui/core';
import {Pie} from 'react-chartjs-2'



const styles = theme =>({
    root:{     
        textAlign:"center"
    }, 
    paperContainer:{
        display:"inline-block", 
        verticalAlign:"middle",
        width: '50',
        height: "50",
        margin: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2
    }, 
    share:{
        padding:10,
        textAlign:'center'
    }
})
const chartOpts ={
    maintainAspectRatio: true 
}

const legendOpts = {
    display: true,
    position: 'top',
    fullWidth: true,
    reverse: false,
    labels: {
      
    }
  };



class SinglePollView extends React.Component{

   

    state ={
        isLoggedIn: this.props.isLoggedIn,     
        url: this.props.match.params.id ,
        choiceValue:'',
        poll:{
            vote:{}
        },
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
            console.log(data)
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
            console.log(response)
            return response.json()
        })
        .then((data)=>{

            if(data.err) return console.log(data.err)

            if(data){
                this.getPollData()
                console.log(data)                
            }              
        })
    }

    handleChoiceNameChange =()=>event=>{
        this.setState({choiceValue: event.target.value}, ()=>{
            console.log(this.state.choiceValue)
        })
  
    }

    getPollData=()=>{
        console.log(this.props)
        let url = '/getpoll/'+ this.state.url
        fetch(url)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{

            if(data.err) return

            if(data){
                console.log(data)
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
       let shareUrl = "https://voting-app-vp.herokuapp.com/poll/" + this.state.url     
       return(
        <div className={classes.root}>          

            <Paper className={classes.paperContainer}>
                <div>{pollName}</div>
                    
                <FormControl className={classes.formControl}>
                    <FormLabel>Choices</FormLabel>
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
                chart
           
                <Pie data={this.state.chartData} 
                    width={188}
                    height={188}
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

            {this.props.isLoggedIn && 
            <Paper>
                <form>
                <Typography>Add a new choice</Typography>
                <TextField 
                    id="outlined-name"
                 
                    label="Choice"
                    className={classes.textField}     
                    onChange={this.handleChoiceNameChange()}
                    margin="normal"                     
                    variant="outlined"
                />

                <Button onClick={this.authenticatedAddChoice}>Add Choice</Button>
                </form>
                
            </Paper>}
            
        </div>
       )
   }
}

export default withStyles(styles)(SinglePollView)