
import React, { Component } from "react";
import { SocketContext, socket } from './helpers/socket';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Home from './views/home';
import ProfileList from './views/profileList';
import Running from './views/running';
//import Profile from './components/Profile';


import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import EditProfile from "./views/editProfile";

class App extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.state = {currentProfile: "testprofile3.json", status: "Ready", datapoints: []};
  }

  componentDidMount() {
    fetch('/reflow_profiles/' + this.state.currentProfile)
    .then(response => response.json())
    .then(result => {
      this.setState({ datapoints: result.datapoints });
      //initialize array of datapoints
      //newDatapoints = result.datapoints;
    });
  }

  componentWillUnmount() {
    socket.disconnect();
  }


  render () {
    return (
      <SocketContext.Provider value={socket}>
        <div className="App">
          <header className="App-header">
          
            <Router>
              <Switch>
                <Route exact path="/" >
                  <Home datapoints={this.state.datapoints} />
                </Route>
                <Route path="/editProfile" >
                  <EditProfile datapoints={this.state.datapoints} />
                </Route>
                <Route path="/profileList" >
                  <ProfileList />
                </Route>
                <Route path="/running" >
                  <Running datapoints={this.state.datapoints} />
                </Route>
              </Switch>
            </Router>
          </header>
        </div>
      </SocketContext.Provider>
    );
  }
}
//<h1>{props.isLocal.toString()}</h1>
export {App};
