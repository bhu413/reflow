import { React, Component } from 'react';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from "react-router-dom";

class ProfileList extends Component {
    
    componentDidMount() {
        
    }
  
    render() {
      return (
          <>
            <h3>profile 1</h3>
            <h3>profile 2</h3>
            <h3>profile 3</h3>
            <h3>profile 4</h3>
            <Button as={Link} to="/" inverted color='red'>Cancel</Button>
            <Button as={Link} to="/" inverted color='blue'>Upload</Button>
            <Button as={Link} to="/" inverted color='blue'>Download</Button>
            <Button as={Link} to="/" inverted color='green'>Load</Button>
          </>
      );
    }
}

export default ProfileList;