import React, { Component } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import { Button, TextField, Grid } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import './keyboard.css';
import Keyboard from "react-simple-keyboard";
import { withTheme } from '@material-ui/styles';

class PidSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            p: 0,
            i: 0,
            d: 0,
            useCoolingFan: false,
            lookAhead: 0,
            preheat: false,
            preheatPower: 0,
            alwaysHitPeak: false,
            inputChanged: false,
            focused: false,
            currentFocused: null,
            focusInputChange: null,
            isLocal: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        };
        this.save = this.save.bind(this);
        this.handlePChange = this.handlePChange.bind(this);
        this.handleIChange = this.handleIChange.bind(this);
        this.handleDChange = this.handleDChange.bind(this);
        this.handleCoolingFanChange = this.handleCoolingFanChange.bind(this);
        this.handlePreheatChange = this.handlePreheatChange.bind(this);
        this.handleLookAheadChange = this.handleLookAheadChange.bind(this);
        this.handlePreheatPowerChange = this.handlePreheatPowerChange.bind(this);
        this.handleAlwaysHitPeakChange = this.handleAlwaysHitPeakChange.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
        this.handleInputClose = this.handleInputClose.bind(this);
        this.handleDialogInput = this.handleDialogInput.bind(this);
    }

    componentDidMount() {
        fetch('/api/settings/pid')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    p: result.p,
                    i: result.i,
                    d: result.d,
                    useCoolingFan: result.use_cooling_fan,
                    lookAhead: result.look_ahead,
                    preheat: result.preheat,
                    preheatPower: result.preheat_power,
                    alwaysHitPeak: result.always_hit_peak
                });
            });
    }

    save() {
        var newSettings = {};
        newSettings.p = this.state.p;
        newSettings.i = this.state.i;
        newSettings.d = this.state.d;
        newSettings.use_cooling_fan = this.state.useCoolingFan;
        newSettings.look_ahead = this.state.lookAhead;
        newSettings.preheat = this.state.preheat;
        newSettings.preheat_power = this.state.preheatPower;
        newSettings.always_hit_peak = this.state.alwaysHitPeak;
        axios.post('/api/settings/pid', newSettings)
            .then(res => {
                if (res.data.status === 200) {
                    this.setState({ inputChanged: false });
                }
            });
    }

    handlePChange(e) {
        this.setState({ p: e.target.value, inputChanged: true });
    }

    handleIChange(e) {
        this.setState({ i: e.target.value, inputChanged: true });
    }

    handleDChange(e) {
        this.setState({ d: e.target.value, inputChanged: true });
    }

    handleCoolingFanChange(e) {
        this.setState({ useCoolingFan: e.target.checked, inputChanged: true });
    }

    handleLookAheadChange(e) {
        if (e.target.value >= 0) {
            if (e.target.value == '') {
                this.setState({ lookAhead: e.target.value, inputChanged: true });
            } else if (e.target.value == '-') {
                this.setState({ lookAhead: -0, inputChanged: true });
            } else {
                this.setState({ lookAhead: parseInt(e.target.value), inputChanged: true });
            }
        }
    }

    handlePreheatChange(e) {
        this.setState({ preheat: e.target.checked, inputChanged: true });
    }

    handlePreheatPowerChange(e) {
        if (e.target.value >= 0 && e.target.value <= 100) {
            this.setState({ preheatPower: e.target.value, inputChanged: true });
        }
    }

    handleAlwaysHitPeakChange(e) {
        this.setState({ alwaysHitPeak: e.target.checked, inputChanged: true });
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
                                        "7 8 9 {bksp}",
                                        "4 5 6 ",
                                        "1 2 3 ",
                                        "0 . - "
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
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                    >
                        <Typography variant='h6'>PID</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3} direction='column' alignItems="flex-start" >

                            <Grid item>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <TextField id='p' variant="outlined" type='number' label='Proportional' value={this.state.p} onChange={this.handlePChange} onClick={(e) => this.handleOnFocus(e, this.handlePChange, 'p')} style={{ width: 150 }} />
                                    </Grid>
                                    <Grid item>
                                        <TextField variant="outlined" type='number' label='Integral' value={this.state.i} onChange={this.handleIChange} onClick={(e) => this.handleOnFocus(e, this.handleIChange, 'i')} style={{ width: 150 }} />
                                    </Grid>
                                    <Grid item>
                                        <TextField variant="outlined" type='number' label='Derivative' value={this.state.d} onChange={this.handleDChange} onClick={(e) => this.handleOnFocus(e, this.handleDChange, 'd')} style={{ width: 150 }} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <Typography align='left'>
                                    Use cooling fan with PID
                                </Typography>
                                <Checkbox checked={this.state.useCoolingFan} onChange={this.handleCoolingFanChange} color='primary' />
                            </Grid>

                            <Grid item>
                                <Typography align='left'>
                                    Look Ahead
                                </Typography>
                                <TextField
                                    variant="outlined"
                                    type='number'
                                    value={this.state.lookAhead}
                                    onChange={this.handleLookAheadChange}
                                    onClick={(e) => this.handleOnFocus(e, this.handleLookAheadChange, 'lookAhead')}
                                    style={{ width: 150 }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">Seconds</InputAdornment>,
                                    }}
                                />
                            </Grid>

                            <Grid item>
                                <Grid container spacing={3}>
                                    <Grid item>
                                        <Typography align='left'>
                                            Enable Preheat
                                        </Typography>
                                        <Checkbox checked={this.state.preheat} onChange={this.handlePreheatChange} color='primary' />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            variant="outlined"
                                            type='number'
                                            label='Preheat Power'
                                            value={this.state.preheatPower}
                                            onChange={this.handlePreheatPowerChange}
                                            onClick={(e) => this.handleOnFocus(e, this.handlePreheatPowerChange, 'preheatPower')}
                                            style={{ width: 150 }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography align='left'>
                                    Always Hit Peak
                                </Typography>
                                <Checkbox checked={this.state.alwaysHitPeak} onChange={this.handleAlwaysHitPeakChange} color='primary' />
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

export default withTheme(PidSettings);