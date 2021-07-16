import { React, Component } from 'react';

import Profile from '../components/Profile';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import { socket } from '../helpers/socket';
import axios from 'axios';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import StatusBar from '../components/StatusBar';

class Home extends Component {
    constructor() {
      super();
      this.runProfile = this.runProfile.bind(this);
      this.stop = this.stop.bind(this);
      this.state = ({ currentProfile: '', historicTemperature: [], percentDone: 0 });
      
    }

    componentDidMount() {
      fetch('/api/current_profile')
      .then(response => response.json())
      .then(result => {
        this.setState({ currentProfile: result.current_profile});
      });
      socket.on("status_update", (message) => {
        this.setState({
          currentProfile: message.current_profile,
          historicTemperature: message.historic_temperature
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
    return (
      <>
          
        <StatusBar />
        <div style={{  paddingTop: "20px", paddingLeft: "20px", width: '85%', display: "flex", justifyContent: "center"}}>
          <Profile draggable={false} profile={this.state.currentProfile} historicTemps={this.state.historicTemperature} />
        </div>
          
          
        <Button component={Link} to={{ pathname: '/editProfile', state: { profile: this.state.currentProfile } }} startIcon={<EditIcon />} variant="contained" color="primary" >Edit Current Profile</Button>
          <Button onClick={this.stop} startIcon={<StopIcon />} variant="contained" color="primary">Stop</Button>
          <Button onClick={this.runProfile} startIcon={<PlayArrowIcon />} variant="contained" color="primary">Start</Button>
          
        </>
      );
    }
}

export default Home;