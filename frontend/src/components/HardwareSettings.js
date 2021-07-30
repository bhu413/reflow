import React, { Component } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import { InputLabel, Grid } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

class HardwareSettings extends Component {
    constructor() {
        super();
        this.state = { relayPin: 0, fanPin: 0, inputChanged: false, relayError: false, fanError: false, fanTimeout: 0 };
        this.handleRelayChange = this.handleRelayChange.bind(this);
        this.handleFanChange = this.handleFanChange.bind(this);
        this.handleFanTimeoutChange = this.handleFanTimeoutChange.bind(this);
        this.errorClose = this.errorClose.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        fetch('/api/settings/hardware')
            .then(response => response.json())
            .then(result => {
                this.setState({ relayPin: result.relay_pin, fanPin: result.fan_pin, fanTimeout: result.fan_timeout });
            });
    }

    handleRelayChange(e) {
        if (e.target.value === this.state.fanPin) {
            this.setState({ relayError: true });
        } else {
            this.setState({relayPin: e.target.value, inputChanged: true})
        }
    }

    handleFanChange(e) {
        if (e.target.value === this.state.relayPin) {
            this.setState({ fanError: true });
        } else {
            this.setState({ fanPin: e.target.value, inputChanged: true })
        }
    }

    handleFanTimeoutChange(e) {
        if (e.target.value >= 0) {
            this.setState({ fanTimeout: e.target.value, inputChanged: true });
        }
    }

    errorClose() {
        this.setState({ relayError: false, fanError: false });
    }

    save() {
        var newSettings = {};
        newSettings.relay_pin = this.state.relayPin;
        newSettings.fan_pin = this.state.fanPin;
        newSettings.fan_timeout = this.state.fanTimeout;
        axios.post('/api/settings/hardware', newSettings)
            .then(res => {
                if (res.data.status === 200) {
                    this.setState({ inputChanged: false });
                }
            });
    }

    render() {
        return (
            <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography variant='h6' >Hardware</Typography>
                </AccordionSummary>
                <AccordionDetails>

                    <Snackbar open={this.state.relayError} autoHideDuration={5000} onClose={this.errorClose}>
                        <MuiAlert elevation={6} variant="filled" severity="error">
                            Relay pin cannot be same as fan pin!
                        </MuiAlert>
                    </Snackbar>

                    <Snackbar open={this.state.fanError} autoHideDuration={5000} onClose={this.errorClose}>
                        <MuiAlert elevation={6} variant="filled" severity="error">
                            Fan pin cannot be same as Relay pin!
                        </MuiAlert>
                    </Snackbar>

                    <Grid container spacing={3}>
                        <Grid item>
                            <FormControl>
                                <InputLabel>Relay GPIO</InputLabel>
                                <Select value={this.state.relayPin} onChange={this.handleRelayChange}>
                                    <MenuItem value={5}>5 (pin 29)</MenuItem>
                                    <MenuItem value={6}>6 (pin 31)</MenuItem>
                                    <MenuItem value={16}>16 (pin 36)</MenuItem>
                                    <MenuItem value={17}>17 (pin 11)</MenuItem>
                                    <MenuItem value={22}>22 (pin 15)</MenuItem>
                                    <MenuItem value={23}>23 (pin 16)</MenuItem>
                                    <MenuItem value={24}>24 (pin 18)</MenuItem>
                                    <MenuItem value={25}>25 (pin 22)</MenuItem>
                                    <MenuItem value={26}>26 (pin 37)</MenuItem>
                                    <MenuItem value={27}>27 (pin 13)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <InputLabel>Fan GPIO</InputLabel>
                                <Select value={this.state.fanPin} onChange={this.handleFanChange}>
                                    <MenuItem value={5}>5 (pin 29)</MenuItem>
                                    <MenuItem value={6}>6 (pin 31)</MenuItem>
                                    <MenuItem value={16}>16 (pin 36)</MenuItem>
                                    <MenuItem value={17}>17 (pin 11)</MenuItem>
                                    <MenuItem value={22}>22 (pin 15)</MenuItem>
                                    <MenuItem value={23}>23 (pin 16)</MenuItem>
                                    <MenuItem value={24}>24 (pin 18)</MenuItem>
                                    <MenuItem value={25}>25 (pin 22)</MenuItem>
                                    <MenuItem value={26}>26 (pin 37)</MenuItem>
                                    <MenuItem value={27}>27 (pin 13)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" type='number' label='Fan off delay (seconds)' value={this.state.fanTimeout} onChange={this.handleFanTimeoutChange} />
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

export default HardwareSettings;