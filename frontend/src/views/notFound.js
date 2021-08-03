import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import StatusBar from '../components/StatusBar';

class NotFound extends Component {


    render() {
        return (
            <>
                <StatusBar />
                <Typography variant='h5' align='center'>404. Hope you find your way back!</Typography>
            </>
            
        );
    }
}

export default NotFound;