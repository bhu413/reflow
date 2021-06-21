import React from "react";
import logo from './logo.svg';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [data, setData] = React.useState(null);

  
  return (
    <div className="App">
      <header className="App-header">
        <Profile />
      </header>
    </div>
  );
}

export {App};
