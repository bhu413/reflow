import { React, Component } from 'react';
import Temperature from '../components/Temperature';
import Profile from '../components/Profile';
import Status from '../components/Status';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from "react-router-dom";

var datapoints = [{
  x: 0,
  y: 30,
}, {
  x: 100,
  y: 150,
}, {
  x: 180,
  y: 150,
}, {
  x: 240,
  y: 250,
}, {
  x: 280,
  y: 250,
}, {
  x: 360,
  y: 30,
}];

class Home extends Component {
    
    componentDidMount() {
        
    }
  
    render() {
      return (
        <>
            <Temperature />
            <Status />
            <Profile draggable={false} datapoints={datapoints}/>
            <Button as={Link} to='/profileList' inverted color='blue'>Past Profiles</Button>
            <Button as={Link} to='/editProfile' inverted color='blue'>Edit Profile</Button>
            <Button as={Link} to='/running' inverted color='green'>Start</Button>
        </>
      );
    }
}

export default Home;