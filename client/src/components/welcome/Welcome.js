import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AllPolls from '../polls/AllPolls'
const styles = theme => ({
    main:{
        display: 'block',
        textAlign:'center',
        justifyContent:'center'
    },
    text: {
      marginBottom: 10  
    }

})


class Welcome extends React.Component {
   

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.main}>
                <Typography variant='h5' className={classes.text}>
                Voting App with Twitter Authentication
                Here you can create and vote on polls and share them on twitter.                                        
                </Typography>

                <AllPolls/>
            </div>
        )
    }
}


export default withStyles(styles)(Welcome);