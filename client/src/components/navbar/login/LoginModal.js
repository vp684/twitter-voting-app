import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import LoginTabs from './LoginTabs'

const styles = theme => ({
  root: {
    position: 'absolute',
    width: 'auto',
   
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2,
    outline: 'none', 
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'     
  }
});

class LoginModal extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div> 
        <Button onClick={this.handleOpen}>Login</Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}     
        >               
          <div  className={classes.root}>
            <LoginTabs closeMenu={this.handleClose}  checkLogIn={this.props.checkLogIn}></LoginTabs>                                       
          </div>      
        </Modal>
      </div>
    );
  }
}

LoginModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginModal);;