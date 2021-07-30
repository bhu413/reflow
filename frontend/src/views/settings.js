import React, { Component } from "react";
import StatusBar from '../components/StatusBar';
import Container from '@material-ui/core/Container';
import NetworkSettings from '../components/NetworkSettings';
import PidSettings from '../components/PidSettings';
import HardwareSettings from "../components/HardwareSettings";

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
                <Container maxWidth={false} style={{paddingTop: '20px'}} >
                    <PidSettings />
                    <HardwareSettings />
                    <NetworkSettings />
                </Container>
            </>
        );
    }
}

export default Settings;