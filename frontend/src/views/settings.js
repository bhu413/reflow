import React, { Component } from "react";
import StatusBar from '../components/StatusBar';
import Container from '@material-ui/core/Container';
import NetworkSettings from '../components/NetworkSettings';
import PidSettings from '../components/PidSettings';
import HardwareSettings from "../components/HardwareSettings";
import AppearanceSettings from '../components/AppearanceSettings';

class Settings extends Component {

    render() {
        return (
            <>
                <StatusBar />
                <Container maxWidth={false} style={{paddingTop: '20px'}} >
                    <PidSettings />
                    <HardwareSettings />
                    <NetworkSettings />
                    <AppearanceSettings
                        toggleDarkMode={this.props.toggleDarkMode}
                        setPrimaryColor={this.props.setPrimaryColor}
                        setSecondaryColor={this.props.setSecondaryColor}
                        primary={this.props.primary}
                        secondary={this.props.secondary}
                        darkMode={this.props.darkMode}
                    />
                </Container>
            </>
        );
    }
}

export default Settings;