import { React, Component } from 'react';
import Temperature from '../components/Temperature';
import Profile from '../components/Profile';
import Status from '../components/Status';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from "react-router-dom";
import { socket } from '../helpers/socket';
import axios from'axios';

class Home extends Component {
    constructor() {
      super();
      this.runProfile = this.runProfile.bind(this);
      this.stop = this.stop.bind(this);
      this.state = ({currentProfile: '', historicTemperature: [], percentDone: 0});
    }

    componentDidMount() {
      fetch('/current_profile')
      .then(response => response.json())
      .then(result => {
        this.setState({ currentProfile: result.current_profile});
      });
      socket.on("new_profile", (message) => {
        this.setState({currentProfile: message.current_profile});
      });
      socket.on("historic_temperature_update", (message) => {
        this.setState({historicTemperature: message.historic_temperature, percentDone: message.percent});
      });
    }

    componentWillUnmount() {
      socket.off("new_profile");
      socket.off("historic_temperature_update");
    }

    runProfile() {
      axios.post('/run', {profile_name: this.state.currentProfile.name})
      .then(res => {
        console.log(res);
      });
    }

    stop() {
      axios.post('/stop', {reason: "test"})
      .then(res => {
        //console.log(res);
      });
    }

    render() {
      return (
        <>
            <Temperature />
            <Status />
            <Profile draggable={false} profile={this.state.currentProfile} historicTemps={this.state.historicTemperature} />
            <Button as={Link} to='/profileList' inverted color='blue'>Past Profiles</Button>
            <Button as={Link} to={{pathname: '/editProfile', state: {profile: this.state.currentProfile}}} inverted color='blue'>Edit Profile</Button>
            <Button onClick={this.runProfile} inverted color='green'>Start</Button>
            <Button onClick={this.stop} inverted color='red'>Stop</Button>
        </>
      );
    }
}

export default Home;