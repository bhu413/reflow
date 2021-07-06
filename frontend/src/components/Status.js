import { React, Component } from 'react';
import {SocketContext} from '../helpers/socket';
import './Components.css';

class Status extends Component {

  static contextType = SocketContext;

  constructor () {
    super();
    this.state = {status: "Ready"};
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  componentDidMount() {
    const socket = this.context;
    socket.on("status_update", (message) => {
      console.log('setting');
      this.setState({status: message.status});
    });
  }

  componentWillUnmount() {
    const socket = this.context;
    socket.off("status_update");
  }

  render() {
    return (
      <div className="component">
      <h1>Status</h1>
      <h3>{this.state.status}</h3>
      </div>
    );
  }
    
}

export default Status;