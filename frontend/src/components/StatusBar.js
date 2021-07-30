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
import { ListItem, Drawer, ListItemText, ListItemIcon, Divider, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { LinearProgress, Grid } from '@material-ui/core';

class StatusBar extends Component {
    constructor() {
        super();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.drawerChange = this.drawerChange.bind(this);
        this.stop = this.stop.bind(this);
        this.qrClicked = this.qrClicked.bind(this);
        this.qrClosed = this.qrClosed.bind(this);
        this.state = { drawer: false, qrDialog: false, percentage: 0, temperature: 0, status: "Ready", address: ":", currentProfile: "" };
    }

    stop() {
        axios.post('/api/stop', { reason: "test" })
            .then(res => {
                if (res.data.status === 200) {
                    this.setState({ status: "Ready" });
                }
            });
    }

    componentDidMount() {
        socket.on("status_update", (message) => {
            this.setState({
                percentage: message.percent,
                temperature: message.temperature,
                status: message.status,
                currentProfile: message.current_profile
            });
        });
        fetch('/api/server_address')
            .then(response => response.json())
            .then(result => {
                this.setState({ address: result["Ethernet"][0] });
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

    render() {
        return (
            <>
                <Dialog onClose={this.qrClosed} open={this.state.qrDialog} fullWidth={false} maxWidth={"sm"}>
                    <DialogTitle>
                        <Grid container justifyContent='center'>
                            <Grid item>
                                <Typography variant='h5'>
                                    http://{this.state.address}:3001
                                </Typography>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container alignItems='center' direction='column'>
                            <Grid item>
                                <QRCode value={"http://" + this.state.address + ":3001"} size={200} />
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
                                    {this.state.temperature} °C
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
                            {this.state.status !== "Ready" &&
                                <Button onClick={this.stop} startIcon={<StopIcon />} variant="contained" color="secondary">Stop</Button>
                            }
                        </div>

                    </Toolbar>
                    <LinearProgress variant="determinate" color='secondary' value={this.state.percentage} />
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

