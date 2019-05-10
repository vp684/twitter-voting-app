import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TablePagination from '@material-ui/core/TablePagination';
import LastPageIcon from '@material-ui/icons/LastPage';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


//import { FormControlLabel } from '@material-ui/core';
const actionsStyles = theme => ({
    root: {
      display: "inline-block",
      color: theme.palette.text.secondary, 
      
    },
  });
  
  class TablePaginationActions extends React.Component {
    
  
    handleFirstPageButtonClick = event => {
      this.props.onChangePage(event, 0);
    };
  
    handleBackButtonClick = event => {
      this.props.onChangePage(event, this.props.page - 1);
    };
  
    handleNextButtonClick = event => {
      this.props.onChangePage(event, this.props.page + 1);
    };
  
    handleLastPageButtonClick = event => {
      this.props.onChangePage(
        event,
        Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
      );
    };
  
    render() {
      const { classes, count, page, rowsPerPage, theme } = this.props;
  
      return (
        <div className={classes.root}>
          <IconButton
            onClick={this.handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="First Page"
          >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
          </IconButton>
          <IconButton
            onClick={this.handleBackButtonClick}
            disabled={page === 0}
            aria-label="Previous Page"
          >
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          </IconButton>
          <IconButton
            onClick={this.handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Next Page"
          >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </IconButton>
          <IconButton
            onClick={this.handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Last Page"
          >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
          </IconButton>
        </div>
      );
    }
  }
  
  TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired,
  };
  
  const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
  );
//------------------------------------------------------------------------------------------------------------------------------

const styles = theme => ({

    divRoot:{
       
    },
    paperRoot:{
        maxWidth:700,
        display:"inline-block", 
        verticalAlign:"middle",        
        margin: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2
    },
    root: {          
          
    },
    pagination:{

    }, 
    
    toolbar:{
        alignItems:"right",
        paddingLeft:0,
        display:"grid",
        gridTemplateColumns: "auto auto",
        gridTemplateRows: "auto auto",
        gridTemplateAreas:  "'caption pageinput' 'curpage pagebtns'"

    }, 
    actions:{     
        gridArea:"pagebtns",
        placeSelf:"center",
    }, 
    paginationInput:{
        display:"inherit",
        placeSelf:"start",
        width:"70px"
        
    },
    caption:{
        
        
    }, 
    spacer:{
        display:"none"
    }
 
});


function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}


class CustomListPagination extends React.Component {
    state = {
        rows:[],
        page: 0,
        rowsPerPage: 10,
        rowsPerPageOptions:[5,10,20]
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
      };
    
    handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: Number(event.target.value) });
    };

    fetchAllPolls = function(){
    window.fetch("/allpolls")
      .then(response=>{     
        return response.json()
      })
      .then(data=>{      
        if (data) {        
          try{
            let counter = 0
            let retArray = []

            data.polls.map(user =>{// data.polls is an array of users
                return user.polls.map(userPoll =>{
                  let newItem ={
                    id: counter,
                    pollName: userPoll.name,
                    pollCreator: user.name, 
                    url: userPoll.url
                  }                          
                  retArray.push(newItem)
                  counter++
                  return newItem
                })
            })
            
            this.setState({
              rows:retArray
            })

          }
          catch(e){
            console.log(e)
          }
         
        }
        //check if logged in then set state if so.
        })    
        return
    }

    componentDidMount(){
        this.fetchAllPolls()
    }  

    render() {
        const {classes} = this.props
        var {rows, page, rowsPerPage} = this.state       

        return (
            <div className={classes.divRoot}>
                <Paper className={classes.paperRoot} >        
                    
                    <List > 
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (                      
                                                                        
                            <ListItemLink href={`/poll/`+row.url} key={row.id}>
                                <ListItemText primary={row.pollName} />
                            </ListItemLink>                        
                                
                        ))}                
                        <TablePagination
                            name="tablepage"
                            className={classes.root}
                            classes={{
                                root:classes.pagination, 
                                caption:classes.caption,
                                input:classes.paginationInput,                        
                                actions:classes.actions, 
                                toolbar:classes.toolbar, 
                                spacer:classes.spacer
                            }}                            
                            component="span"
                            rowsPerPageOptions={this.state.rowsPerPageOptions}
                            count={rows.length}         
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActionsWrapped}
                        />       
                        
                        
                    </List>
                    

                </Paper>

            </div>
        
    
    
        
        
        );
    }
}

CustomListPagination.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomListPagination);
