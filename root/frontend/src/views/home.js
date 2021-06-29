import { React, Component } from 'react';
import Temperature from '../components/Temperature';
import Profile from '../components/Profile';
import Status from '../components/Status';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from "react-router-dom";

class Home extends Component {
    
    componentDidMount() {
        
    }
  
    render() {
      return (
        <>
            <Temperature />
            <Status />
            <Profile draggable={false}/>
            <Button as={Link} to='/profileList' inverted color='blue'>Past Profiles</Button>
            <Button as={Link} to='/editProfile' inverted color='blue'>Edit Profile</Button>
            <Button as={Link} to='/running' inverted color='green'>Start</Button>
        </>
      );
    }
}

export default Home;