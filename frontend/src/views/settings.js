import React, { Component } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StatusBar from '../components/StatusBar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import { InputLabel, TextField } from "@material-ui/core";

class Settings extends Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.currentlyExpanded = '';
        this.state = ({ expanded: '' });
    }

    handleChange(panel) {
        this.currentlyExpanded = panel;
    }

    render() {
        return (
            <>
                <StatusBar />
                <Container maxWidth={false} >
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography >Network</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Note: changes will be applied on server restart.
                            </Typography>
                            <Switch
                                checked={false}

                                name="checkedA"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography >PID</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField variant="outlined" label='Proportional' value={50} />
                            <TextField variant="outlined" label='Integral' value={50} />
                            <TextField variant="outlined" label='Derivative' value={50} />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3bh-content"
                            id="panel3bh-header"
                        >
                            <Typography >Hardware</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControl>
                                <InputLabel>Relay GPIO Pin</InputLabel>
                                <Select
                                    value={27}
                                >
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

                            <FormControl>
                                <InputLabel>Fan GPIO Pin</InputLabel>
                                <Select
                                    value={22}
                                >
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
                        </AccordionDetails>
                    </Accordion>
                    <Accordion >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography >Appearance</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Under Construction
                            </Typography>
                            <FormControl>
                                <InputLabel>Theme</InputLabel>
                                <Select
                                    value={'Dark'}
                                >
                                    <MenuItem value={'Dark'}>Dark</MenuItem>
                                    <MenuItem value={'Light'}>Light</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel>Temperature Units</InputLabel>
                                <Select
                                    value={'Celcius'}
                                >
                                    <MenuItem value={'Celcius'}>Celcius</MenuItem>
                                    <MenuItem value={'Fahrenheit'}>Fahrenheit</MenuItem>
                                </Select>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>
                </Container>
            </>
        );
    }
}

export default Settings;