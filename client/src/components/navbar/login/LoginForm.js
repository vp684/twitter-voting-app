import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {   
    display: 'block',
    backgroundColor: theme.palette.background.paper,
    height: 'auto'
  },
  textField:{
      padding: 5
  }, 
  button:{
      margin: theme.spacing.unit * 2
  }
})

class LoginForm extends Component {
 
  state = {
    userName: '', 
    userPW: ''
  } 
 
  handleUserNamePWChange = name => event => {        
      this.setState({ [name]: event.target.value });                
  };

  submitUserCreds = (event) =>{
      
    let creds = {
      username: this.state.userName,
      password: this.state.userPW    
    }
    this.setState({userPW:''})
  
    //console.log(creds.user)
    //cleint shoudl check if creds are valid ie enoguh characters, valid email format, valid password format.
    // clear values
    let lengthU = creds.username.length
    let lengthP = creds.password.length
    if(lengthU > 0 && lengthP > 0){

      return window.fetch('/auth/local/', {
        method: "POST", 
        credentials: 'include', 
        headers: {
          "Content-Type": "application/json"                   
        },
     
        body: JSON.stringify(creds)
      }).then(response =>{
        console.log('response to client', response)
        if(response.status === 401){
          //set state to update user on failed authirization.
         return {failed: true, message:'Unauthorized Credentials'}
        }
        return response.json().catch((err)=>{
          console.log(err)
        })
        
      }).then(data=>{
        console.log(data)
        if(data){
            
          if(!data.failed){
            console.log(data.message)
            this.props.checkLogIn()
            this.props.closeMenu()
          }
        }        
      })
    }           

  }
  
  
  render() {   
    const { classes } = this.props;

    return (     
      <form className={classes.root}>   

        <div className={classes.textField} >   
            <TextField
                onChange={this.handleUserNamePWChange('userName')}
                value={this.state.userName}
                type="text"
                label="User Name"             
                variant="outlined"
                autoFocus={true}
                autoComplete="username"
            />
        </div>

        <div className={classes.textField}>
            <TextField
                onChange={this.handleUserNamePWChange('userPW')}    
                value={this.state.userPW}                
                label="Password"   
                type="password"   
                variant="outlined"
                autoComplete="current-password"
            />               
        </div>

        <Button variant="contained" className={classes.button} onClick={this.submitUserCreds}>
            Submit Login
        </Button>

      </form>                                  
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);
