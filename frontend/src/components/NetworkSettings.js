import React, { Component } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import axios from 'axios';

class NetworkSettings extends Component {
    constructor() {
        super();
        this.state = { port: 3001, remoteConnections: true, inputChanged: false };
        this.save = this.save.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handlePortChange = this.handlePortChange.bind(this);
    }

    componentDidMount() {
        fetch('/api/settings/network')
            .then(response => response.json())
            .then(result => {
                this.setState({ port: result.port, remoteConnections: result.remote_connections });
            });
    }

    save() {
        var newSettings = {};
        newSettings.port = this.state.port;
        newSettings.remote_connections = this.state.remoteConnections;
        axios.post('/api/settings/network', newSettings)
            .then(res => {
                if (res.data.status === 200) {
                    this.setState({ inputChanged: false });
                }
            });
    }

    handleSwitch(e) {
        this.setState({ remoteConnections: e.target.checked, inputChanged: true });
    }

    handlePortChange(e) {
        this.setState({ port: e.target.value, inputChanged: true });
    }

    render() {
        return (
            <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography variant='h6'>Network</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container direction='column' alignItems="flex-start" spacing={3}>
                        <Grid item>
                            <Typography align='left'>
                                Server Port
                            </Typography>
                            <TextField variant="outlined" type='number' onChange={this.handlePortChange} value={this.state.port} />
                        </Grid>
                        <Grid item>
                            <Typography align='left'>
                                Allow Remote Connections (not implemented yet)
                            </Typography>
                            <Switch checked={this.state.remoteConnections} onChange={this.handleSwitch} color='primary' />
                        </Grid>

                        <Grid container justifyContent='flex-end' spacing={3}>
                            <Grid item>
                                <Button variant='contained' color='primary' disabled={!this.state.inputChanged} onClick={this.save}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                </AccordionDetails>
            </Accordion>
        );
    }
}

export default NetworkSettings;