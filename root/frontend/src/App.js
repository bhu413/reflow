
import React, {useState, useEffect} from "react";
import { socket } from './context/socket';
import Profile from './components/Profile';
import './App.css';


function App(props) {
  //disconnect on page close
  useEffect(() => {
    return () => socket.disconnect();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Profile />
      </header>
    </div>
  );
}
//<h1>{props.isLocal.toString()}</h1>
export {App};
