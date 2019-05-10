import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Button, Paper } from '@material-ui/core';
import {Pie} from 'react-chartjs-2'
import DeleteModal from './DeleteModal'


const styles = theme =>({

    container:{             
        display:'inline-flex',
        flexWrap:'wrap', 
        maxWidth:700,
        listStyle:'none',
        padding:0,
        margin:0,
        justifyContent:'center'
        
    },
    flexItem:{
        width: 200, 
        height: 'auto', 
        margin: 10
    },   
    textName:{
        fontSize:20, 
        margin: 5
    }, 
    btnShare:{
        margin:5,
        backgroundColor:"green"
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
      
    }
  };


class AuthPollView extends React.Component {
    state={
        userName : '',
        userID:'',
        polls:[],
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

    getUserPolls = ()=>{

        fetch('/api/allUserPolls')
            .then(response=>{
                return response.json()
            })
            .then(data=>{
                this.setState({
                    userName: data.userName,
                    userID:data.userId,
                    polls: data.polls
                })
               
            })

    }


    viewPoll =(url)=>{    
        this.props.history.push('/poll/' + url)
    }

    componentDidMount(){
        this.getUserPolls()
    }

    render(){
        const {classes} = this.props
        var polls = this.state.polls
        var uID = this.state.userID
        return(
            <div className={classes.container}>

                
                {polls && polls.map((item, index)=>{
                    var  chartData = {
                            labels: item.choices.map(name=>{return name.name}), //array of Strings
                            datasets: [{
                                data:  item.choices.map((chc)=>{return chc.count}),// array of Numbers  
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
                            }],
                        } 
                   

                        return <Paper className={classes.flexItem} key={index}>
                            <Typography className={classes.textName}>{item.name}</Typography> 

                            <Pie data={chartData} 
                                width={175}
                                height={175}
                                legend={legendOpts}
                                options={chartOpts}>
                            </Pie>      
                            <Button className={classes.btnShare} onClick={()=> this.viewPoll(item.url)} >View</Button>                                                      
                            <DeleteModal url={item.url} uID={uID} getUserPolls={this.getUserPolls}>Delete</DeleteModal>
                        
                        </Paper> 

                    })                
                }
              
            </div>
        )

    }



}

export default withStyles(styles)(AuthPollView)