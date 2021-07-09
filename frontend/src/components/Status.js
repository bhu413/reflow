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
    fetch('/status')
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({ status: result.status});
    });
    const socket = this.context;
    socket.on("status_update", (message) => {
      this.setState({status: message.new_status});
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