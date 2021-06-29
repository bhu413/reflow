import { React, Component } from 'react';
import { Button } from 'semantic-ui-react';
import Profile from '../components/Profile';
import { Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';

class Running extends Component {

    componentDidMount() {
        
    }
  
    render() {
      return (
          <>
            <Profile draggable={false}/>
            <Button as={Link} to="/" inverted color='red'>STOP</Button>
          </>
      );
    }
}

export default Running;