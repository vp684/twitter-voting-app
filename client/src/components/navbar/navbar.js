import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { withStyles } from '@material-ui/core/styles';

import AccountCircle from '@material-ui/icons/AccountCircle';
import LoginModal from './login/LoginModal'
import MoreIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'block'
  },
 
 

  login:{
    marginRight: theme.spacing.unit,
    color:'inherit'
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class Navbar extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null
  };

  

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  logOut = () => {
    console.log('we logged out')
    window.fetch('/auth/logout').then(()=>{
      this.props.checkLogIn()
    })         
    return this.handleMenuClose()               
   
  }

  createpollURL = () =>{
      this.props.history.push('/createpoll')
  }
  
  goToUserPoll = ()=>{
    this.props.history.push('/userpolls')
  }


  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const menuItems = (
    
        <MenuItem onClick={this.logOut}>Log Out</MenuItem> 
     
    )

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >                      
      {this.props.isLoggedIn &&
        menuItems     
      }        
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMenuClose}
      >
       
        <MenuItem onClick={this.handleMenuClose}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>My Polls</p>
        </MenuItem>

        <MenuItem onClick={this.logOut}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Logout</p>
        </MenuItem>
      </Menu>
    );



    const userPollButtons = (
      <div>
        <Button onClick={this.createpollURL}>
          Create Poll
        </Button>
        <Button onClick={this.goToUserPoll}>
          My Polls
        </Button>
      </div>    
    )

      

    return (
      
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Button href="/">
              <Typography className={classes.title} variant="h6" color="inherit">
                Voting App
              </Typography>  
            </Button>                 

            <div className={classes.grow} />

            {!this.props.isLoggedIn && <LoginModal checkLogIn={this.props.checkLogIn} />}  
            {this.props.isLoggedIn && userPollButtons}  
            
            

            <div className={classes.sectionDesktop}>              
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.props.isLoggedIn ? this.handleProfileMenuOpen : null}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>

            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.props.isLoggedIn ? this.handleMobileMenuOpen : null} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>

          </Toolbar>
          
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool
};

export default withStyles(styles)(Navbar);