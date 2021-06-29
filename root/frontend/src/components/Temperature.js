import { React, Component } from 'react';
import './Components.css';

class Temperature extends Component {

    componentDidMount() {
        
    }
  
    render() {
      return (
          <div className="component">
            <h1>Current Temperature</h1>
            <h3>60 F</h3>
          </div>
      );
    }
  }

export default Temperature;