import { React, Component } from 'react';
import { socket } from '../helpers/socket';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from "react-router-dom";
import { ListItem, Drawer, ListItemText, ListItemIcon, Divider } from '@material-ui/core';

import { LinearProgress, Grid } from '@material-ui/core';

class StatusBar extends Component {
    constructor() {
        super();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.drawerChange = this.drawerChange.bind(this);
        this.state = { drawer: false };
        this.state = { percentage: 0, temperature: 0, status: "Ready" };
    }

    componentDidMount() {
        socket.on("status_update", (message) => {
            this.setState({
                percentage: message.percent,
                temperature: message.temperature,
                status: message.status
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

    render() {
        return (
            <>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.drawerChange}>
                            <MenuIcon />
                        </IconButton>
                        <Grid container spacing={3}>
                            <Grid item>
                                <Typography  >
                                    Address: ovenpi.local:3001
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography >
                                    Temperature: {this.state.temperature}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography  >
                                    Status: {this.state.status}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Toolbar>
                    <LinearProgress variant="determinate" value={100} />
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

