import React, { Component } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import './keyboard.css';
import Keyboard from "react-simple-keyboard";
import { withTheme } from '@material-ui/styles';

class NetworkSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            port: 3001,
            remoteConnections: true,
            messageToSend: "",
            inputChanged: false,
            focused: false,
            currentFocused: null,
            focusInputChange: null,
            isLocal: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        };
        this.save = this.save.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handlePortChange = this.handlePortChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
        this.handleInputClose = this.handleInputClose.bind(this);
        this.handleDialogInput = this.handleDialogInput.bind(this);
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

    handleMessageChange(e) {
        this.setState({ messageToSend: e.target.value });
    }

    sendMessage() {
        axios.post('/api/send_message', { message: this.state.messageToSend })
            .then(res => {});
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
            tempString = '3001'
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
                                        "0 {bksp}"
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
                                <TextField
                                    variant="outlined"
                                    type='number'
                                    onChange={this.handlePortChange}
                                    onClick={(e) => this.handleOnFocus(e, this.handlePortChange, 'port')}
                                    value={this.state.port} />
                            </Grid>
                            <Grid item>
                                <Typography align='left'>
                                    Allow Remote Connections
                                </Typography>
                                <Checkbox checked={this.state.remoteConnections} onChange={this.handleSwitch} color='primary' />
                            </Grid>

                            {/*
                            <Grid item>
                                <Typography align='left'>
                                    Send message to all connections
                                </Typography>
                                <TextField variant="outlined" onChange={this.handleMessageChange} value={this.state.messageToSend} />
                                <Button variant='contained' color='primary' onClick={this.sendMessage}>
                                    Send
                                </Button>
                            </Grid>
                            */}
                            
                            <Grid container justifyContent='flex-end' spacing={3}>
                                <Grid item>
                                    <Typography variant='caption'>
                                        Changes will be applied after a manual restart of the server.
                                    </Typography>
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
            </>
        );
    }
}

export default withTheme(NetworkSettings);