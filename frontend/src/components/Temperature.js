import { React, Component } from 'react';
import {SocketContext} from '../helpers/socket';
import './Components.css';

class Temperature extends Component {

  static contextType = SocketContext;

  constructor () {
    super();
    this.state = {temperature: 0};
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  componentDidMount() {
    const socket = this.context;
    socket.on("temperature_update", (message) => {
      console.log('setting');
      this.setState({temperature: message.temperature});
    });
  }

  componentWillUnmount() {
    const socket = this.context;
    socket.off("temperature_update");
  }

  render() {
    return (
      <div className="component">
      <h1>Current Temperature</h1>
      <h3>{this.state.temperature} C</h3>
      </div>
    );
  }
    
}

export default Temperature;
