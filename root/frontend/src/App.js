
import React, {useState, useEffect} from "react";
import { socket } from './helpers/socket';
import Main from './views/main';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";


function App(props) {
  //disconnect on page close
  useEffect(() => {
    return () => socket.disconnect();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Main />
      </header>
    </div>
  );
}
//<h1>{props.isLocal.toString()}</h1>
export {App};
