
import React, { Component } from "react";
import { SocketContext, socket } from './helpers/socket';
import './App.css';
import Home from './views/home';
import Settings from './views/settings';
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
    this.componentWillUnmount = this.componentWillUnmount.bind(this);

  }



  componentWillUnmount() {
    socket.disconnect();
  }


  render() {
    return (

      
        <div className="App">
        <Router>
          <SocketContext.Provider value={socket}>
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
              <Route path="/settings" >
                <Settings />
              </Route>
            </Switch>
          </SocketContext.Provider>
          </Router>

        </div>
      
    );
  }
}
//<h1>{props.isLocal.toString()}</h1>
export { App };
