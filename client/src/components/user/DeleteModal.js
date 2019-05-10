import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        position: 'absolute',
        width: '300px',
        display:'block',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 2,
        outline: 'none', 
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'     
    }, 
    btnDel:{
        margin:5,
        backgroundColor:"maroon"
    }, 
    modalBtns:{
        margin:15
    },
    btnContainer:{
        textAlign:'center'
    }
});

class DeleteModal extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  
  deletePoll = ()=>{
      let pkg = {
          uId: this.props.uId, 
          url: this.props.url
      }
      window.fetch('/api/delpoll', {
        method: "DELETE", 
        headers: {
        "Content-Type": "application/json"        
        },
        body: JSON.stringify(pkg)
    })
    .then(response=>{     
        return response.json()
    })
    .then(data=>{      
        if (data) {        
     
           this.props.getUserPolls()
           this.handleClose()
        }
      
    })
  }
  render() {
    const { classes } = this.props;

    return (
      <div> 
        <Button className={classes.btnDel} onClick={this.handleOpen} >Delete</Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}     
        >               
          <div  className={classes.root}>
            Are you sure you want to delete this poll?
            <div className={classes.btnContainer}>
                <Button className={classes.modalBtns} onClick={this.deletePoll}>Delete</Button>
                <Button className={classes.modalBtns} onClick={this.handleClose}>Cancel</Button>
            </div>
            
                                                
          </div>      
        </Modal>
      </div>
    );
  }
}

DeleteModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeleteModal);;