
import React, {useState, useEffect} from "react";
import { socket } from './helpers/socket';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Home from './views/home';
import ProfileList from './views/profileList';
import Running from './views/running';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect,
} from "react-router-dom";
import EditProfile from "./views/editProfile";


function App(props) {
  //disconnect on page close
  useEffect(() => {
    return () => socket.disconnect();
  }, []);

  return (
    
    <div className="App">
      <header className="App-header">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/editProfile" component={EditProfile} />
            <Route path="/profileList" component={ProfileList} />
            <Route path="/running" component={Running} />
          </Switch>
        </Router>
      </header>
    </div>
  );
}
//<h1>{props.isLocal.toString()}</h1>
export {App};
