import { React, Component } from 'react';
import Profile from '../components/Profile';
import { Button } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';

class EditProfile extends Component {
    
    componentDidMount() {
        
    }
  
    render() {
      return (
          <>
            <Profile draggable={true}/>
            <Button as={Link} to="/" inverted color='red'>Cancel</Button>
            <Button as={Link} to="/" inverted color='green'>Save</Button>
          </>
      );
    }
}

export default EditProfile;