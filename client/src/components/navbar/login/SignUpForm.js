import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {   
    display: 'block',
    backgroundColor: theme.palette.background.paper

  },
  textField:{
      padding: 5
      
  }, 
  button:{
      margin: theme.spacing.unit * 2
  }
})

class SignUpForm extends Component {
 
  state = {
    newUser: '', 
    newUserPW: '', 
    loginMessage:[]
  } 
 
  handleUserInputChange = name => event => {        
      this.setState({ [name]: event.target.value });                
  };

  submitUserSignUp = (event) =>{     
    let creds = {
      username: this.state.newUser,
      password: this.state.newUserPW    
    }
    
    // clear values

    window.fetch('/auth/local/signup', {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"        
      },
      body: JSON.stringify(creds)
    }).then(response =>{
      return response.json()
    }).then(data=>{
    
      if(data.errors){
        console.log(data)
        let final = data.errors.map((item)=>{
          return item.msg
        })
        this.setState({loginMessage: final})
      }else{// no errors 
        this.setState({loginMessage: data.message})
      }
    })
    
    return this.setState({newUser: '', newUserPW: '' }) 

  }
  
  
  render() {   
    const { classes } = this.props;

    return (     
      <form className={classes.root}>   
        {this.state.loginMessage}
        <div className={classes.textField} >   
            <TextField
                onChange={this.handleUserInputChange('newUser')}
                value={this.state.newUser}
                type="text"
                label="User Name"             
                variant="outlined"
                autoFocus={true}                
            />
        </div>      
        <div className={classes.textField}>
            
            <TextField
                onChange={this.handleUserInputChange('newUserPW')}      
                value={this.state.newUserPW}              
                label="Password"   
                type="password"   
                variant="outlined"    
            />               
        </div>

        <Button variant="contained" className={classes.button} onClick={this.submitUserSignUp}>
            Sign Up
        </Button>

      </form>                                  
    );
  }
}

SignUpForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpForm);
