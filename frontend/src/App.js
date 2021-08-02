
import React, { Component } from "react";
import { SocketContext, socket } from './helpers/socket';
import './App.css';
import Home from './views/home';
import Settings from './views/settings';
import ProfileList from './views/profileList';
import NotFound from './views/notFound';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import EditProfile from "./views/editProfile";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: true,
      primary: '#3f51b5',
      secondary: '#e91e63',
    };
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
    this.setPrimaryColor = this.setPrimaryColor.bind(this);
    this.setSecondaryColor = this.setSecondaryColor.bind(this);
  }

  componentDidMount() {
    fetch('/api/settings/appearance')
      .then(response => response.json())
      .then(result => {
        this.setState({ darkMode: result.dark_mode, primary: result.primary_color, secondary: result.secondary_color });
      });
    
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  toggleDarkMode(isDark) {
    if (isDark) {
      this.setState({ darkMode: true });
    } else {
      this.setState({ darkMode: false });
    }
  }

  setPrimaryColor(color) {
    this.setState({ primary: color });
  }

  setSecondaryColor(color) {
    this.setState({ secondary: color });
  }


  render() {
    var themeType = 'dark';
    if (!this.state.darkMode) {
      themeType = 'light'
    }
    const theme = createTheme({
      palette: {
        type: themeType,
        primary: {
          main: this.state.primary,
        },
        secondary: {
          main: this.state.secondary,
        },
      }

    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
                <Settings
                  toggleDarkMode={this.toggleDarkMode}
                  setPrimaryColor={this.setPrimaryColor}
                  setSecondaryColor={this.setSecondaryColor}
                  primary={this.state.primary}
                  secondary={this.state.secondary}
                  darkMode={this.state.darkMode}
                />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </SocketContext.Provider>
        </Router>
      </ThemeProvider>



    );
  }
}
//<h1>{props.isLocal.toString()}</h1>
export { App };
