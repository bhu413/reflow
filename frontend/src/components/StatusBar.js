import { React, Component } from 'react';
import { socket } from '../helpers/socket';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from "react-router-dom";
import axios from 'axios';
import StopIcon from '@material-ui/icons/Stop';
import QRCode from "qrcode.react";
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ListItem, Drawer, ListItemText, ListItemIcon, Divider, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { LinearProgress, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

class StatusBar extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.drawerChange = this.drawerChange.bind(this);
        this.stop = this.stop.bind(this);
        this.qrClicked = this.qrClicked.bind(this);
        this.qrClosed = this.qrClosed.bind(this);
        this.snackbarClosed = this.snackbarClosed.bind(this);
        this.state = {
            drawer: false,
            qrDialog: false,
            thermoDialog: false,
            percentage: 0,
            temperature: 0,
            status: "Ready",
            address: "",
            currentProfile: "",
            serverMessage: "",
            serverMessageSeverity: "",
            serverMessageSnackbar: false
        };
    }

    StopButton = withStyles({
        root: {
            backgroundColor: '#bf0000',
            '&:hover': {
                backgroundColor: '#870000'
            }
        }
    })(Button);

    stop() {
        axios.post('/api/stop', { reason: "test" })
            .then(res => {
                if (res.data.status === 200) {
                    this.setState({ status: "Ready" });
                }
            });
    }

    componentDidMount() {
        fetch('/api/status')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    address: result.address,
                    percentage: result.status.percent,
                    status: result.status.status,
                    currentProfile: result.status.current_profile
                });
            });
        socket.on("status_update", (message) => {
            this.setState({
                percentage: message.percent,
                temperature: message.temperature,
                status: message.status,
                currentProfile: message.current_profile
            });
        });
        socket.on("server_message", (message) => {
            this.setState({
                serverMessage: message.message,
                serverMessageSeverity: message.severity,
            });
            this.setState({
                serverMessageSnackbar: true
            });
        });
    }

    drawerChange() {
        if (this.state.drawer) {
            this.setState({ drawer: false });
        } else {
            this.setState({ drawer: true });
        }
    }

    componentWillUnmount() {
        socket.off("status_update");
    }

    qrClicked() {
        this.setState({ qrDialog: true });
    }

    qrClosed() {
        this.setState({ qrDialog: false });
    }

    snackbarClosed() {
        this.setState({serverMessageSnackbar: false})
    }

    render() {
        var temperatureDisplay = this.state.temperature + "°C";
        if (this.state.temperature === -1) {
            temperatureDisplay = "Thermocouple Disconnected!";
        } else if (this.state.temperature === -2) {
            temperatureDisplay = "Thermocouple Error!";
        }
        return (
            <>
                <Snackbar anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'}} open={this.state.serverMessageSnackbar} autoHideDuration={20000}>
                    <MuiAlert elevation={6} variant="filled" severity={this.state.serverMessageSeverity} onClose={this.snackbarClosed}>
                        {this.state.serverMessage}
                    </MuiAlert>
                </Snackbar>
                <Dialog onClose={this.qrClosed} open={this.state.qrDialog} fullWidth={false} maxWidth={"sm"}>
                    <DialogTitle>
                        <Grid container justifyContent='center'>
                            <Grid item>
                                <Typography variant='h5'>
                                    http://{this.state.address}
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container alignItems='center' direction='column'>
                            <Grid item>
                                <QRCode value={"http://" + this.state.address} size={200} />
                            </Grid>
                            <Grid item>
                                <IconButton aria-label="close" onClick={this.qrClosed}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.drawerChange}>
                            <MenuIcon />
                        </IconButton>
                        <Grid container spacing={5} style={{paddingLeft: 20}}>
                            <Grid item>
                                <QRCode style={{ cursor: 'pointer' }} onClick={this.qrClicked} value={"http://" + this.state.address + ":3001"} size={25} />
                            </Grid>
                            <Grid item xs={2}>
                                <Typography >
                                    {temperatureDisplay}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography  >
                                    {this.state.status}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography  >
                                    {this.state.currentProfile.name}
                                </Typography>
                            </Grid>

                        </Grid>
                        <div style={{ marginLeft: 'auto' }}>
                            {(this.state.status === "Preheat" || this.state.status === "Running") &&
                                <this.StopButton onClick={this.stop} startIcon={<StopIcon />} variant="contained" color="secondary">Stop</this.StopButton>
                            }
                        </div>

                    </Toolbar>
                    <LinearProgress style={{height: 5}} variant="determinate" color='secondary' value={this.state.percentage} />
                </AppBar>

                <Drawer open={this.state.drawer} onClose={this.drawerChange} >
                    <ListItem button key={"menu"} onClick={this.drawerChange}>
                        <ListItemIcon><MenuIcon /></ListItemIcon>
                    </ListItem>
                    <Divider />
                    <ListItem button key={"Home"} component={Link} onClick={this.drawerChange} to='/'>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText>Home</ListItemText>
                    </ListItem>
                    <ListItem button key={"ProfileList"} component={Link} onClick={this.drawerChange} to='/profileList'>
                        <ListItemIcon><HistoryIcon /></ListItemIcon>
                        <ListItemText>Profile List</ListItemText>
                    </ListItem>
                    <ListItem button key={"Settings"} component={Link} onClick={this.drawerChange} to='/settings'>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText>Settings</ListItemText>
                    </ListItem>
                </Drawer>
            </>
        );
    }
}

export default StatusBar;

