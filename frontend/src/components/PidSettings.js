import React, { Component } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import { Button, TextField, Grid } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';

class PidSettings extends Component {
    constructor() {
        super();
        this.state = { p: 0, i: 0, d: 0, lookAhead: 0, preheat: false, preheatPower: 0, alwaysHitPeak: false, inputChanged: false };
        this.save = this.save.bind(this);
        this.handlePChange = this.handlePChange.bind(this);
        this.handleIChange = this.handleIChange.bind(this);
        this.handleDChange = this.handleDChange.bind(this);
        this.handlePreheatChange = this.handlePreheatChange.bind(this);
        this.handleLookAheadChange = this.handleLookAheadChange.bind(this);
        this.handlePreheatPowerChange = this.handlePreheatPowerChange.bind(this);
        this.handleAlwaysHitPeakChange = this.handleAlwaysHitPeakChange.bind(this);
    }

    componentDidMount() {
        fetch('/api/settings/pid')
            .then(response => response.json())
            .then(result => {
                this.setState({ p: result.p, i: result.i, d: result.d, lookAhead: result.look_ahead, 
                    preheat: result.preheat, preheatPower: result.preheat_power, alwaysHitPeak: result.always_hit_peak });
            });
    }

    save() {
        var newSettings = {};
        newSettings.p = this.state.p;
        newSettings.i = this.state.i;
        newSettings.d = this.state.d;
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

    handleLookAheadChange(e) {
        if (e.target.value >= 0) {
            this.setState({ lookAhead: e.target.value, inputChanged: true });
        }
    }

    handlePreheatChange(e) {
        this.setState({ preheat: e.target.checked, inputChanged: true });
    }

    handlePreheatPowerChange(e) {
        if (e.target.value >= 0 && e.target.value <= 1) {
            this.setState({ preheatPower: e.target.value, inputChanged: true });
        }
    }

    handleAlwaysHitPeakChange(e) {
        this.setState({ alwaysHitPeak: e.target.checked, inputChanged: true });
    }


    render() {
        return (
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
                                    <TextField variant="outlined" type='number' label='Proportional' value={this.state.p} onChange={this.handlePChange} />
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" type='number' label='Integral' value={this.state.i} onChange={this.handleIChange} />
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" type='number' label='Derivative' value={this.state.d} onChange={this.handleDChange} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography align='left'>
                                Look Ahead (seconds)
                            </Typography>
                            <TextField variant="outlined" type='number' value={this.state.lookAhead} onChange={this.handleLookAheadChange} />
                        </Grid>
                        <Grid item>
                            <Grid container spacing={3}>
                                <Grid item>
                                    <Typography align='left'>
                                        Enable Preheat
                                    </Typography>
                                    <Switch checked={this.state.preheat} onChange={this.handlePreheatChange} color='primary' />
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" type='number' label='Preheat Power' value={this.state.preheatPower} onChange={this.handlePreheatPowerChange} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography align='left'>
                                Always Hit Peak
                            </Typography>
                            <Switch checked={this.state.alwaysHitPeak} onChange={this.handleAlwaysHitPeakChange} color='primary' />
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

export default PidSettings;