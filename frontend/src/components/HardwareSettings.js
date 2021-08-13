import React, { Component } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import { InputLabel, Grid, FormControlLabel } from "@material-ui/core";
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
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import './keyboard.css';
import Keyboard from "react-simple-keyboard";
import { withTheme } from '@material-ui/styles';

class HardwareSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            relayPin: 4,
            fanPin: 22,
            coolingFanPin: 16,
            buzzerPin: 6,
            thermocoupleOffset: 0,
            percentOffset: 0,
            inputChanged: false,
            relayError: false,
            fanError: false,
            coolingFanError: false,
            buzzerError: false,
            fanTurnoffTemp: 0,
            thermo1: "n/a",
            thermo2: "n/a",
            calculated: "n/a",
            refreshDisabled: false,
            thermocoupleAverageMode: 'false',
            focused: false,
            currentFocused: null,
            focusInputChange: null,
            isLocal: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        };
        this.handleRelayChange = this.handleRelayChange.bind(this);
        this.handleFanChange = this.handleFanChange.bind(this);
        this.handleCoolingFanChange = this.handleCoolingFanChange.bind(this);
        this.handleBuzzerChange = this.handleBuzzerChange.bind(this);
        this.handleFanTurnoffChange = this.handleFanTurnoffChange.bind(this);
        this.handleThermocoupleOffset = this.handleThermocoupleOffset.bind(this);
        this.handleThermocoupleRefresh = this.handleThermocoupleRefresh.bind(this);
        this.handlePercentOffset = this.handlePercentOffset.bind(this);
        this.handleThermocoupleMode = this.handleThermocoupleMode.bind(this);
        this.errorClose = this.errorClose.bind(this);
        this.save = this.save.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
        this.handleInputClose = this.handleInputClose.bind(this);
        this.handleDialogInput = this.handleDialogInput.bind(this);
    }

    componentDidMount() {
        fetch('/api/settings/hardware')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    relayPin: result.relay_pin,
                    fanPin: result.fan_pin,
                    coolingFanPin: result.cooling_fan_pin,
                    buzzerPin: result.buzzer_pin,
                    fanTurnoffTemp: result.fan_turnoff_temp,
                    thermocoupleOffset: result.thermocouple_offset,
                    percentOffset: result.percent_offset
                });
                if (result.thermocouple_average_mode === true) {
                    this.setState({ thermocoupleAverageMode: 'true' });
                } else {
                    this.setState({ thermocoupleAverageMode: 'false' });
                }
            });
    }

    handleRelayChange(e) {
        this.setState({ relayPin: e.target.value, inputChanged: true });
    }

    handleFanChange(e) {
        this.setState({ fanPin: e.target.value, inputChanged: true });
    }

    handleCoolingFanChange(e) {
        this.setState({ coolingFanPin: e.target.value, inputChanged: true });
    }

    handleBuzzerChange(e) {
        this.setState({ buzzerPin: e.target.value, inputChanged: true });
    }

    handleFanTurnoffChange(e) {
        if (e.target.value >= 0) {
            this.setState({ fanTurnoffTemp: e.target.value, inputChanged: true });
        }
    }

    handleThermocoupleOffset(e) {
        this.setState({ thermocoupleOffset: e.target.value, inputChanged: true });
    }

    handlePercentOffset(e) {
        this.setState({ percentOffset: e.target.value, inputChanged: true });
    }

    handleThermocoupleMode(e) {
        this.setState({ thermocoupleAverageMode: e.target.value, inputChanged: true });
    }

    handleThermocoupleRefresh() {
        this.setState({ refreshDisabled: true });
        fetch('/api/all_temperatures')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    thermo1: result.sensor_1,
                    thermo2: result.sensor_2,
                    calculated: result.current,
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
        newSettings.buzzer_pin = this.state.buzzerPin;
        newSettings.fan_turnoff_temp = this.state.fanTurnoffTemp;
        newSettings.thermocouple_offset = this.state.thermocoupleOffset;
        newSettings.percent_offset = this.state.percentOffset;
        newSettings.thermocouple_average_mode = this.state.thermocoupleAverageMode === 'true';
        axios.post('/api/settings/hardware', newSettings)
            .then(res => {
                if (res.data.status === 200) {
                    this.setState({ inputChanged: false });
                }
            });
    }

    handleOnFocus(e, changeFunction, name) {
        if (this.state.isLocal) {
            this.setState({ focusInputChange: changeFunction, currentFocused: name, focused: true });
        }
    }

    handleInputClose() {
        //get rid of trailing '.' if needed
        var tempString = this.state[this.state.currentFocused].toString();
        if (tempString === '') {
            tempString = '0'
        } else if (tempString.charAt(tempString.length - 1) === '.') {

            tempString = tempString.substring(0, tempString.length - 1);
        }

        //this is super bad code but idk how else to do this
        //i am making a 'fake' event and setting the value so that the method can access it
        var e = {};
        e.target = {};
        e.target.value = tempString;

        this.state.focusInputChange(e);
        this.setState({ focused: false, inputValue: '' });
    }

    handleKeyboardInput(button) {
        var tempInput = this.state[this.state.currentFocused].toString();
        if (button === '{bksp}') {
            tempInput = tempInput.substring(0, tempInput.length - 1);
        } else {
            tempInput += button;
        }

        //again, really bad code. Maybe you can fix it somehow
        var e = {};
        e.target = {};
        e.target.value = tempInput;
        this.state.focusInputChange(e);
    }

    handleDialogInput(e) {
        this.state.focusInputChange(e);
    }

    render() {
        var inputDialog = <></>;
        if (this.state.focused) {
            inputDialog = <Dialog open={this.state.focused} onClose={this.handleInputClose} fullWidth>
                <DialogTitle>
                    <Typography>
                        Enter value
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={1} justifyContent='space-between'>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                value={this.state[this.state.currentFocused]}
                                onChange={this.handleDialogInput}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Keyboard
                                onKeyPress={this.handleKeyboardInput}
                                layout={{
                                    default: [
                                        "7 8 9",
                                        "4 5 6",
                                        "1 2 3",
                                        "0 . {bksp}"
                                    ]
                                }}
                                display={{
                                    '{bksp}': "<"
                                }}
                                theme={this.props.theme.palette.type === 'dark' ? 'hg-theme-dark' : 'hg-theme-default'}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color='primary' variant='contained' onClick={this.handleInputClose}>OK</Button>
                </DialogActions>
            </Dialog>;
        }
        return (
            <>
                {inputDialog}
                <Accordion >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                    >
                        <Typography variant='h6' >Hardware</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        <Grid container spacing={3} direction='column'>
                            <Grid item>
                                <Grid container spacing={3}>
                                    <Grid item>
                                        <FormControl error={this.state.relayError}>
                                            <InputLabel>Relay GPIO</InputLabel>
                                            <Select value={this.state.relayPin} onChange={this.handleRelayChange}>
                                                <MenuItem value={0}>Disabled</MenuItem>
                                                <MenuItem value={4} disabled={this.state.fanPin === 4 || this.state.coolingFanPin === 4 || this.state.buzzerPin === 4}>4 (pin 7)</MenuItem>
                                                <MenuItem value={5} disabled={this.state.fanPin === 5 || this.state.coolingFanPin === 5 || this.state.buzzerPin === 5}>5 (pin 29)</MenuItem>
                                                <MenuItem value={6} disabled={this.state.fanPin === 6 || this.state.coolingFanPin === 6 || this.state.buzzerPin === 6}>6 (pin 31)</MenuItem>
                                                <MenuItem value={16} disabled={this.state.fanPin === 16 || this.state.coolingFanPin === 16 || this.state.buzzerPin === 16}>16 (pin 36)</MenuItem>
                                                <MenuItem value={17} disabled={this.state.fanPin === 17 || this.state.coolingFanPin === 17 || this.state.buzzerPin === 17}>17 (pin 11)</MenuItem>
                                                <MenuItem value={22} disabled={this.state.fanPin === 22 || this.state.coolingFanPin === 22 || this.state.buzzerPin === 22}>22 (pin 15)</MenuItem>
                                                <MenuItem value={23} disabled={this.state.fanPin === 23 || this.state.coolingFanPin === 23 || this.state.buzzerPin === 23}>23 (pin 16)</MenuItem>
                                                <MenuItem value={24} disabled={this.state.fanPin === 24 || this.state.coolingFanPin === 24 || this.state.buzzerPin === 24}>24 (pin 18)</MenuItem>
                                                <MenuItem value={25} disabled={this.state.fanPin === 25 || this.state.coolingFanPin === 25 || this.state.buzzerPin === 25}>25 (pin 22)</MenuItem>
                                                <MenuItem value={26} disabled={this.state.fanPin === 26 || this.state.coolingFanPin === 26 || this.state.buzzerPin === 26}>26 (pin 37)</MenuItem>
                                                <MenuItem value={27} disabled={this.state.fanPin === 27 || this.state.coolingFanPin === 27 || this.state.buzzerPin === 27}>27 (pin 13)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item>
                                        <FormControl error={this.state.coolingFanError}>
                                            <InputLabel>Cooling Fan GPIO</InputLabel>
                                            <Select value={this.state.coolingFanPin} onChange={this.handleCoolingFanChange}>
                                                <MenuItem value={0}>Disabled</MenuItem>
                                                <MenuItem value={4} disabled={this.state.relayPin === 4 || this.state.fanPin === 4 || this.state.buzzerPin === 4}>4 (pin 7)</MenuItem>
                                                <MenuItem value={5} disabled={this.state.relayPin === 5 || this.state.fanPin === 5 || this.state.buzzerPin === 5}>5 (pin 29)</MenuItem>
                                                <MenuItem value={6} disabled={this.state.relayPin === 6 || this.state.fanPin === 6 || this.state.buzzerPin === 6}>6 (pin 31)</MenuItem>
                                                <MenuItem value={16} disabled={this.state.relayPin === 16 || this.state.fanPin === 16 || this.state.buzzerPin === 16}>16 (pin 36)</MenuItem>
                                                <MenuItem value={17} disabled={this.state.relayPin === 17 || this.state.fanPin === 17 || this.state.buzzerPin === 17}>17 (pin 11)</MenuItem>
                                                <MenuItem value={22} disabled={this.state.relayPin === 22 || this.state.fanPin === 22 || this.state.buzzerPin === 22}>22 (pin 15)</MenuItem>
                                                <MenuItem value={23} disabled={this.state.relayPin === 23 || this.state.fanPin === 23 || this.state.buzzerPin === 23}>23 (pin 16)</MenuItem>
                                                <MenuItem value={24} disabled={this.state.relayPin === 24 || this.state.fanPin === 24 || this.state.buzzerPin === 24}>24 (pin 18)</MenuItem>
                                                <MenuItem value={25} disabled={this.state.relayPin === 25 || this.state.fanPin === 25 || this.state.buzzerPin === 25}>25 (pin 22)</MenuItem>
                                                <MenuItem value={26} disabled={this.state.relayPin === 26 || this.state.fanPin === 26 || this.state.buzzerPin === 26}>26 (pin 37)</MenuItem>
                                                <MenuItem value={27} disabled={this.state.relayPin === 27 || this.state.fanPin === 27 || this.state.buzzerPin === 27}>27 (pin 13)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item>
                                        <FormControl error={this.state.fanError}>
                                            <InputLabel>Convection Fan GPIO</InputLabel>
                                            <Select value={this.state.fanPin} onChange={this.handleFanChange}>
                                                <MenuItem value={0}>Disabled</MenuItem>
                                                <MenuItem value={4} disabled={this.state.relayPin === 4 || this.state.coolingFanPin === 4 || this.state.buzzerPin === 4}>4 (pin 7)</MenuItem>
                                                <MenuItem value={5} disabled={this.state.relayPin === 5 || this.state.coolingFanPin === 5 || this.state.buzzerPin === 5}>5 (pin 29)</MenuItem>
                                                <MenuItem value={6} disabled={this.state.relayPin === 6 || this.state.coolingFanPin === 6 || this.state.buzzerPin === 6}>6 (pin 31)</MenuItem>
                                                <MenuItem value={16} disabled={this.state.relayPin === 16 || this.state.coolingFanPin === 16 || this.state.buzzerPin === 16}>16 (pin 36)</MenuItem>
                                                <MenuItem value={17} disabled={this.state.relayPin === 17 || this.state.coolingFanPin === 17 || this.state.buzzerPin === 17}>17 (pin 11)</MenuItem>
                                                <MenuItem value={22} disabled={this.state.relayPin === 22 || this.state.coolingFanPin === 22 || this.state.buzzerPin === 22}>22 (pin 15)</MenuItem>
                                                <MenuItem value={23} disabled={this.state.relayPin === 23 || this.state.coolingFanPin === 23 || this.state.buzzerPin === 23}>23 (pin 16)</MenuItem>
                                                <MenuItem value={24} disabled={this.state.relayPin === 24 || this.state.coolingFanPin === 24 || this.state.buzzerPin === 24}>24 (pin 18)</MenuItem>
                                                <MenuItem value={25} disabled={this.state.relayPin === 25 || this.state.coolingFanPin === 25 || this.state.buzzerPin === 25}>25 (pin 22)</MenuItem>
                                                <MenuItem value={26} disabled={this.state.relayPin === 26 || this.state.coolingFanPin === 26 || this.state.buzzerPin === 26}>26 (pin 37)</MenuItem>
                                                <MenuItem value={27} disabled={this.state.relayPin === 27 || this.state.coolingFanPin === 27 || this.state.buzzerPin === 27}>27 (pin 13)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item>
                                        <FormControl error={this.state.buzzerError}>
                                            <InputLabel>Buzzer GPIO</InputLabel>
                                            <Select value={this.state.buzzerPin} onChange={this.handleBuzzerChange}>
                                                <MenuItem value={0}>Disabled</MenuItem>
                                                <MenuItem value={4} disabled={this.state.relayPin === 4 || this.state.coolingFanPin === 4 || this.state.fanPin === 4}>4 (pin 7)</MenuItem>
                                                <MenuItem value={5} disabled={this.state.relayPin === 5 || this.state.coolingFanPin === 5 || this.state.fanPin === 5}>5 (pin 29)</MenuItem>
                                                <MenuItem value={6} disabled={this.state.relayPin === 6 || this.state.coolingFanPin === 6 || this.state.fanPin === 6}>6 (pin 31)</MenuItem>
                                                <MenuItem value={16} disabled={this.state.relayPin === 16 || this.state.coolingFanPin === 16 || this.state.fanPin === 16}>16 (pin 36)</MenuItem>
                                                <MenuItem value={17} disabled={this.state.relayPin === 17 || this.state.coolingFanPin === 17 || this.state.fanPin === 17}>17 (pin 11)</MenuItem>
                                                <MenuItem value={22} disabled={this.state.relayPin === 22 || this.state.coolingFanPin === 22 || this.state.fanPin === 22}>22 (pin 15)</MenuItem>
                                                <MenuItem value={23} disabled={this.state.relayPin === 23 || this.state.coolingFanPin === 23 || this.state.fanPin === 23}>23 (pin 16)</MenuItem>
                                                <MenuItem value={24} disabled={this.state.relayPin === 24 || this.state.coolingFanPin === 24 || this.state.fanPin === 24}>24 (pin 18)</MenuItem>
                                                <MenuItem value={25} disabled={this.state.relayPin === 25 || this.state.coolingFanPin === 25 || this.state.fanPin === 25}>25 (pin 22)</MenuItem>
                                                <MenuItem value={26} disabled={this.state.relayPin === 26 || this.state.coolingFanPin === 26 || this.state.fanPin === 26}>26 (pin 37)</MenuItem>
                                                <MenuItem value={27} disabled={this.state.relayPin === 27 || this.state.coolingFanPin === 27 || this.state.fanPin === 27}>27 (pin 13)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item>
                                        <TextField
                                            variant="outlined"
                                            type='number'
                                            label='Stop cooling at:'
                                            value={this.state.fanTurnoffTemp}
                                            onChange={this.handleFanTurnoffChange}
                                            onClick={(e) => this.handleOnFocus(e, this.handleFanTurnoffChange, 'fanTurnoffTemp')}
                                            style={{ width: 150 }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                                            }} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Typography style={{ paddingBottom: 10 }}>
                                    Temperature Adjustment
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item>
                                        <TextField
                                            variant="outlined"
                                            type='number'
                                            label='Constant offset'
                                            value={this.state.thermocoupleOffset}
                                            onChange={this.handleThermocoupleOffset}
                                            onClick={(e) => this.handleOnFocus(e, this.handleThermocoupleOffset, 'thermocoupleOffset')}
                                            style={{ width: 150 }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            variant="outlined"
                                            type='number'
                                            label='Percent offset'
                                            value={this.state.percentOffset}
                                            onChange={this.handlePercentOffset}
                                            onClick={(e) => this.handleOnFocus(e, this.handlePercentOffset, 'percentOffset')}
                                            style={{ width: 150 }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Typography style={{ paddingBottom: 10 }}>
                                    Dual Thermocouple
                                </Typography>
                                <RadioGroup value={this.state.thermocoupleAverageMode} onChange={this.handleThermocoupleMode} >
                                    <FormControlLabel value='false' control={<Radio color="primary" />} label='Use Highest Temperature' />
                                    <FormControlLabel value='true' control={<Radio color="primary" />} label='Use Average' />
                                </RadioGroup>
                            </Grid>

                            <Grid item>
                                <Typography>
                                    Diagnostics
                                    <IconButton disabled={this.state.refreshDisabled} onClick={this.handleThermocoupleRefresh}><RefreshIcon /></IconButton>
                                </Typography>
                                <Typography style={{ display: 'block' }} variant='caption'>
                                    Thermocouple 1: {this.state.thermo1}°C
                                </Typography>
                                <Typography style={{ display: 'block' }} variant='caption'>
                                    Thermocouple 2: {this.state.thermo2}°C
                                </Typography>
                                <Typography style={{ display: 'block' }} variant='caption'>
                                    Calculated: {this.state.calculated}°C
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
            </>
        );
    }
}

export default withTheme(HardwareSettings);