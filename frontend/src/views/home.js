import { React, Component } from 'react';

import Profile from '../components/Profile';
import EditIcon from '@material-ui/icons/Edit';
import { Button, Container, Grid } from '@material-ui/core';
import { Link } from "react-router-dom";
import { socket } from '../helpers/socket';
import axios from 'axios';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import StatusBar from '../components/StatusBar';
import { styled } from '@material-ui/core/styles';

class Home extends Component {
    constructor() {
      super();
      this.runProfile = this.runProfile.bind(this);
      this.stop = this.stop.bind(this);
      this.state = ({ currentProfile: '', historicTemperature: [], percentDone: 0, status: "Ready" });
      
  }
  
  StartButton = styled(Button)({
    background: '#3dd900',
    '&:hover': '#3dd900'
  });

    componentDidMount() {
      fetch('/api/current_profile')
      .then(response => response.json())
        .then(result => {
        this.setState({ currentProfile: result.current_profile});
      });
      socket.on("status_update", (message) => {
        this.setState({
          currentProfile: message.current_profile,
          historicTemperature: message.historic_temperature,
          status: message.status
        });
      });
    }

    componentWillUnmount() {
      socket.off("status_update");
    }

    runProfile() {
      axios.post('/api/run', {profile_name: this.state.currentProfile.name})
      .then(res => {
      });
    }

    stop() {
      axios.post('/api/stop', {reason: "test"})
      .then(res => {
        //console.log(res);
      });
    }

  render() {
    const isRunning = this.state.status !== "Ready";
    let stopStartButton;
    if (isRunning) {
      stopStartButton = <Button onClick={this.stop} startIcon={<StopIcon />} variant="contained" color="secondary">Stop</Button>;
    } else {
      stopStartButton = <this.StartButton onClick={this.runProfile} startIcon={<PlayArrowIcon />} variant="contained" color="primary">Start</this.StartButton>;
    }
    return (
      <>
          
        <StatusBar />
        <div style={{  paddingTop: "30px", width: '82%', margin: '0 auto'}}>
          <Profile draggable={false} profile={this.state.currentProfile} historicTemps={this.state.historicTemperature} />
        </div>
          
        <Container maxWidth={false}>
          <Grid container spacing={3} alignItems="center" justify="center">
            <Grid item>
              <Button component={Link} to={{ pathname: '/editProfile', state: { profile: this.state.currentProfile } }} startIcon={<EditIcon />} variant="contained" color="primary" >Edit Current Profile</Button>
            </Grid>
            <Grid item>
              {stopStartButton}
            </Grid>
          </Grid>
        </Container>
        
        
          
        </>
      );
    }
}

export default Home;