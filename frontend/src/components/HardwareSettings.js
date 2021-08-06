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
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

class HardwareSettings extends Component {
    constructor() {
        super();
        this.state = {
            relayPin: 5,
            fanPin: 6,
            coolingFanPin: 16,
            thermocoupleOffset: 0,
            inputChanged: false,
            relayError: false,
            fanError: false,
            coolingFanError: false,
            fanTurnoffTemp: 0,
            thermo1: "n/a",
            thermo2: "n/a",
            refreshDisabled: false
        };
        this.handleRelayChange = this.handleRelayChange.bind(this);
        this.handleFanChange = this.handleFanChange.bind(this);
        this.handleCoolingFanChange = this.handleCoolingFanChange.bind(this);
        this.handleFanTurnoffChange = this.handleFanTurnoffChange.bind(this);
        this.handleThermocoupleOffset = this.handleThermocoupleOffset.bind(this);
        this.handleThermocoupleRefresh = this.handleThermocoupleRefresh.bind(this);
        this.errorClose = this.errorClose.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        fetch('/api/settings/hardware')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    relayPin: result.relay_pin,
                    fanPin: result.fan_pin,
                    coolingFanPin: result.cooling_fan_pin,
                    fanTurnoffTemp: result.fan_turnoff_temp
                });
            });
    }

    handleRelayChange(e) {
        if (e.target.value === this.state.fanPin || e.target.value === this.state.coolingFanPin) {
            this.setState({ relayError: true });
        } else {
            this.setState({ relayPin: e.target.value, inputChanged: true })
        }
    }

    handleFanChange(e) {
        if (e.target.value === this.state.relayPin || e.target.value === this.state.coolingFanPin) {
            this.setState({ fanError: true });
        } else {
            this.setState({ fanPin: e.target.value, inputChanged: true })
        }
    }

    handleCoolingFanChange(e) {
        if (e.target.value === this.state.relayPin || e.target.value === this.state.fanPin) {
            this.setState({ coolingFanError: true });
        } else {
            this.setState({ coolingFanPin: e.target.value, inputChanged: true })
        }
    }

    handleFanTurnoffChange(e) {
        if (e.target.value >= 0) {
            this.setState({ fanTurnoffTemp: e.target.value, inputChanged: true });
        }
    }

    handleThermocoupleOffset(e) {
        this.setState({ thermocoupleOffset: e.target.value, inputChanged: true });
    }

    handleThermocoupleRefresh() {
        this.setState({ refreshDisabled: true });
        fetch('/api/all_temperatures')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    thermo1: result.sensor_1,
                    thermo2: result.sensor_2,
                    refreshDisabled: false
                });
            });
    }

    errorClose() {
        this.setState({ relayError: false, fanError: false, coolingFanError: false });
    }

    save() {
        var newSettings = {};
        newSettings.relay_pin = this.state.relayPin;
        newSettings.fan_pin = this.state.fanPin;
        newSettings.cooling_fan_pin = this.state.coolingFanPin;
        newSettings.fan_turnoff_temp = this.state.fanTurnoffTemp;
        newSettings.thermocouple_offset = this.state.thermocoupleOffset;
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
                            Relay pin cannot be same as other pins!
                        </MuiAlert>
                    </Snackbar>

                    <Snackbar open={this.state.fanError} autoHideDuration={5000} onClose={this.errorClose}>
                        <MuiAlert elevation={6} variant="filled" severity="error">
                            Fan pin cannot be same as other pins!
                        </MuiAlert>
                    </Snackbar>

                    <Snackbar open={this.state.coolingFanError} autoHideDuration={5000} onClose={this.errorClose}>
                        <MuiAlert elevation={6} variant="filled" severity="error">
                            Cooling fan pin cannot be same as other pins!
                        </MuiAlert>
                    </Snackbar>

                    <Grid container spacing={3} direction='column'>
                        <Grid item>
                            <Grid container spacing={3}>
                                <Grid item>
                                    <FormControl>
                                        <InputLabel>Relay GPIO</InputLabel>
                                        <Select value={this.state.relayPin} onChange={this.handleRelayChange}>
                                            <MenuItem value={4}>4 (pin 7)</MenuItem>
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
                                    <FormControl >
                                        <InputLabel>Cooling Fan GPIO</InputLabel>
                                        <Select value={this.state.coolingFanPin} onChange={this.handleCoolingFanChange}>
                                            <MenuItem value={4}>4 (pin 7)</MenuItem>
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
                                        <InputLabel>Convection Fan GPIO</InputLabel>
                                        <Select value={this.state.fanPin} onChange={this.handleFanChange}>
                                            <MenuItem value={4}>4 (pin 7)</MenuItem>
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
                                    <TextField variant="outlined" type='number' label='Fan off temperature (°C)' value={this.state.fanTurnoffTemp} onChange={this.handleFanTurnoffChange} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Grid container spacing={3}>
                                <Grid item>
                                    <TextField variant="outlined" type='number' label='Thermocouple offset (°C)' value={this.state.thermocoupleOffset} onChange={this.handleThermocoupleOffset} />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item>
                            <Typography>
                                Thermocouple diagnostics
                                <IconButton disabled={this.state.refreshDisabled} onClick={this.handleThermocoupleRefresh}><RefreshIcon/></IconButton>
                            </Typography>
                            <Typography style={{ display: 'block' }} variant='caption'>
                                Thermocouple 1: {this.state.thermo1}°C
                            </Typography>
                            <Typography style={{ display: 'block' }} variant='caption'>
                                Thermocouple 2: {this.state.thermo2}°C
                            </Typography>
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