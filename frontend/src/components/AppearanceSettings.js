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
import { CirclePicker } from 'react-color'

class AppearanceSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            darkMode: this.props.darkMode,
            primary: this.props.primary,
            secondary: this.props.secondary,
            inputChanged: false
        };
        this.save = this.save.bind(this);
        this.handleDarkSwitch = this.handleDarkSwitch.bind(this);
        this.handlePrimaryChange = this.handlePrimaryChange.bind(this);
        this.handleSecondaryChange = this.handleSecondaryChange.bind(this);
    }

    componentDidMount() {
    }

    save() {
        var newSettings = {};
        newSettings.dark_mode = this.state.darkMode;
        newSettings.primary_color = this.state.primary;
        newSettings.secondary_color = this.state.secondary;
        axios.post('/api/settings/appearance', newSettings)
            .then(res => {
                if (res.data.status === 200) {
                    this.setState({ inputChanged: false });
                }
            });
    }

    handleDarkSwitch(e) {
        this.setState({ darkMode: e.target.checked, inputChanged: true });
        this.props.toggleDarkMode(e.target.checked);
    }

    handlePrimaryChange(color, e) {
        this.setState({ primary: color.hex, inputChanged: true });
        this.props.setPrimaryColor(color.hex);
    }

    handleSecondaryChange(color, e) {
        this.setState({ secondary: color.hex, inputChanged: true });
        this.props.setSecondaryColor(color.hex);
    }

    render() {
        return (
            <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography variant='h6'>Appearance</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container direction='column' alignItems="flex-start" spacing={3}>
                        <Grid item>
                            <Typography align='left'>
                                Dark Mode
                            </Typography>
                            <Switch checked={this.state.darkMode} onChange={this.handleDarkSwitch} color='primary' />
                        </Grid>
                        <Grid item>
                            <Typography align='left'>
                                Primary Color
                            </Typography>
                            <CirclePicker color={this.state.primary} onChange={this.handlePrimaryChange}/>
                        </Grid>

                        <Grid item>
                            <Typography align='left'>
                                Secondary Color
                            </Typography>
                            <CirclePicker color={this.state.secondary} onChange={this.handleSecondaryChange} />
                        </Grid>
                        

                        <Grid container justifyContent='flex-end' spacing={3}>
                            <Grid item>
                                <Grid container direction='column' alignItems='center'>
                                    <Grid item>
                                        <Typography variant='caption' >
                                            <span style={{color: 'red'}}>WARNING: </span>If saved, theme will be applied to all connections.
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant='caption' display='inline' >
                                            (useful for differentiating between ovens)
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
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

export default AppearanceSettings;