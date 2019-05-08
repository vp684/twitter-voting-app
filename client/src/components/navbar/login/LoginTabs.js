import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import TwitterLogin from './Twitterlogin'

const styles = theme => ({
    root: {   
        display: 'block',
        backgroundColor: theme.palette.background.paper,
        minHeight: '400px', 
        textAlign: "center"
    },
    loginContainer:{
        display: 'block',
        margin: '20px 0px 20px 0px',                      
    }, 
    twitterButton:{
      
    },
    divider:{
      marginTop: 15,
      marginBottom: 15
    }   

});

class LoginTabs extends React.Component {
    state = {
        value: 0,
        userName: null, 
        userPW: null
    };

    handleTabChange = (event, value) => {
        this.setState({ value: value });
    }; 
   

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleTabChange} variant="fullWidth">
            <Tab label="Log In" />           
          </Tabs>
        </AppBar>

        {value === 0 &&
            <div className={classes.loginContainer}>
                   
                {/* <LoginForm closeMenu={this.props.closeMenu} checkLogIn={this.props.checkLogIn} /> */}
                
                <Divider variant="fullWidth" className={classes.divider} />

                <TwitterLogin className={classes.twitterButton}
                    loginUrl="/auth/twitter/callback" // https://voting-app-vp.herokuapp.com
                    credentials='include'
                    requestTokenUrl="/auth/twitter" 
                />     

            </div>
        }
            
        {/*value === 1 && 
            <div className={classes.loginContainer}>
                  <SignUpForm />  
            </div>
        */}
      </div>
    );
  }
}

LoginTabs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginTabs);