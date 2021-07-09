
import React, { Component } from "react";
import { SocketContext, socket } from './helpers/socket';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Home from './views/home';
import ProfileList from './views/profileList';
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
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    socket.disconnect();
  }


  render () {
    return (
      <SocketContext.Provider value={socket}>
        <div className="App">

            <Router>
              <Switch>
                <Route exact path="/" >
                  <Home />
                </Route>
                <Route path="/editProfile" >
                  <EditProfile />
                </Route>
                <Route path="/profileList" >
                  <ProfileList />
                </Route>
              </Switch>
            </Router>

        </div>
      </SocketContext.Provider>
    );
  }
}
//<h1>{props.isLocal.toString()}</h1>
export {App};
