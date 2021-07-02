import { React, Component } from 'react';
import { Button } from 'semantic-ui-react';
import Profile from '../components/Profile';
import { Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';

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

class Running extends Component {
    
    componentDidMount() {
        
    }
  
    render() {
      return (
          <>
            <Profile draggable={false} datapoints={datapoints}/>
            <Button as={Link} to="/" inverted color='red'>STOP</Button>
          </>
      );
    }
}

export default Running;