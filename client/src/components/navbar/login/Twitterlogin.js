import React, { Component } from "react";
import PropTypes from "prop-types";
//import TwitterIcon from "react-icons/lib/fa/twitter";
import Button from '@material-ui/core/Button';

class TwitterLogin extends Component {
    constructor(props) {
      super(props);  
      this.onButtonClick = this.onButtonClick.bind(this);
    }
  
    onButtonClick(e) {
      e.preventDefault();
      return this.getRequestToken();
    }
  
  
    getRequestToken() {       
      return window
        .fetch(this.props.requestTokenUrl, {
          method: "POST",
          credentials: 'include'   
        })
        .then(response => {
          return response.json();
        })
        .then(data => { /// authentication request token
          let authenticationUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${
            data.oauth_token
          }&force_login=${this.props.forceLogin}`;

          window.location = authenticationUrl;          
        })
        
        .catch(error => {
          console.log(error)
        //  popup.close();
          return 
        });
    }

    render() {
      // const defaultIcon = (
      //   <TwitterIcon color="#00aced" size={25} />
      // )
      return (
        <Button  variant="contained"  onClick={this.onButtonClick}>
           Login With Twitter
        </Button>
      )
    
    }
    
  }
  
  TwitterLogin.propTypes = {
    tag: PropTypes.string,
    text: PropTypes.string,
    loginUrl: PropTypes.string.isRequired,
    requestTokenUrl: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
    showIcon: PropTypes.bool,
    credentials: PropTypes.oneOf(["omit", "same-origin", "include"]),
    forceLogin: PropTypes.bool,
    
  };
  
  TwitterLogin.defaultProps = {
    tag: "button",
    text: "Sign in with Twitter",
    disabled: false,
    showIcon: true,
    credentials: "same-origin",
    forceLogin: false,
   
  };
  
  export default TwitterLogin;