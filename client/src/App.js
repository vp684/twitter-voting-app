import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import SinglePollView from './components/polls/SinglePollView';
import AuthPollView from './components/user/AuthPollView';
import CreatePoll from './components/user/CreatePoll';
import Navbar from './components/navbar/NavigationBar';
import Welcome from './components/welcome/Welcome'

import { Route } from "react-router-dom";


const styles = theme => ({
  //no styles yet   
  main:{
    display:'flex',
    justifyContent:'center'
  }
  
})

class App extends Component {


  state = {
    isLoggedIn: false,
    user: null
  }
 

  checkLogIn = ()=>{
    window.fetch('/auth/loggedin')
    .then(response=>{     
      return response.json()
    })
    .then(data=>{      
      if (data) {        
        this.setState({isLoggedIn: data.loggedin, user: data});      
      }
      //check if logged in then set state if so.
    })    
    return
  }

  componentWillMount(){
    this.checkLogIn()
  }

  render() {    
    const { classes } = this.props;
    
    return (      
      <div>

        <Route path="/" render={props=> <Navbar {...props} isLoggedIn={this.state.isLoggedIn} checkLogIn={this.checkLogIn}/>} />
        <div name="mainView" className={classes.main}>  
          <Route exact path="/" component={Welcome} />
          <Route path="/poll/:id" render={props => <SinglePollView {...props} checkLogIn={this.checkLogIn} isLoggedIn={this.state.isLoggedIn}/> }/>  
          <Route exact path="/createpoll/" component={CreatePoll} />
          <Route path="/userpolls" render={props => <AuthPollView {...props} checkLogIn={this.checkLogIn} isLoggedIn={this.state.isLoggedIn}/> }  />
        </div>                    

      </div>
    );
  }
}

export default withStyles(styles)(App);
