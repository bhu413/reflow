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
import IdleTimer from 'react-idle-timer'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Typography, Button, Grid } from "@material-ui/core";
import axios from 'axios';
import Keyboard from "react-simple-keyboard";
//import { RemoveScrollBar } from 'react-remove-scroll-bar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: true,
      primary: '#3f51b5',
      secondary: '#e91e63',
      locked: false,
      passwordError: false,
      password: '',
      keyboardLayout: 'default',
      isLocal: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    };
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
    this.setPrimaryColor = this.setPrimaryColor.bind(this);
    this.setSecondaryColor = this.setSecondaryColor.bind(this);
    this.fetchAppearance = this.fetchAppearance.bind(this);
    this.appIdle = this.appIdle.bind(this);
    this.handlePasswordEnter = this.handlePasswordEnter.bind(this);
    this.submitPassword = this.submitPassword.bind(this);
    this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
  }

  buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
  }

  componentDidMount() {
    if (localStorage.getItem('locked') === 'true') {
      this.setState({ locked: true });
    }
    this.fetchAppearance();

    socket.on("appearance_update", (message) => {
      this.setState({
        darkMode: message.dark_mode,
        primary: message.primary_color,
        secondary: message.secondary_color,
      });
    });
  }

  fetchAppearance() {
    fetch('/api/settings/appearance')
      .then(response => response.json())
      .then(result => {
        this.setState({ darkMode: result.dark_mode, primary: result.primary_color, secondary: result.secondary_color });
      });

  }

  componentWillUnmount() {
    socket.off("appearance_update");
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

  appIdle() {
    if (this.state.isLocal) {
      this.setState({ locked: true });
      localStorage.setItem('locked', 'true');
    }
  }

  handlePasswordEnter(e) {
    this.setState({ password: e.target.value });
  }

  handleKeyboardInput(button) {
    if (button === '{lock}') {
      if (this.state.keyboardLayout === 'caps' || this.state.keyboardLayout === 'shift') {
        this.setState({ keyboardLayout: 'default' });
      } else {
        this.setState({ keyboardLayout: 'caps' });
      }
    } else if (button === '{shift}') {
      if (this.state.keyboardLayout === 'caps' || this.state.keyboardLayout === 'shift') {
        this.setState({ keyboardLayout: 'default' });
      } else {
        this.setState({ keyboardLayout: 'shift' });
      }
    } else {
      let tempPassword = this.state.password;
      if (button === '{bksp}') {
        tempPassword = tempPassword.substring(0, tempPassword.length - 1);
      } else if (button === '{space}') {
        tempPassword += ' ';
      } else if (button === '{enter}') {
        this.submitPassword();
        return;
      } else {
        if (button !== '{tab}') {
          tempPassword += button;
        } 
      }
      this.setState({ password: tempPassword });
      if (this.state.keyboardLayout === 'shift') {
        this.setState({ keyboardLayout: 'default' });
      }
    }
  }

  submitPassword() {
    window.crypto.subtle.digest('sha-256', Buffer.from(this.state.password)).then((digest) => {
      axios.post('/api/check_password', { hashed: this.buf2hex(digest) })
        .then(res => {
          if (res.data.status === 200) {
            this.setState({ locked: false, password: '', passwordError: false });
            localStorage.setItem('locked', 'false');
          } else if (res.data.status === 403) {
            this.setState({ passwordError: true, password: '' });
          }
        });
    });
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
        
        <IdleTimer
          timeout={7560000}
          onIdle={this.appIdle}
          debounce={250}
        />
        <CssBaseline />
        <Dialog open={this.state.locked} fullWidth={true}>
          <DialogTitle>
            <Typography align='center'>
              Oven locked. Please enter password:
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container justifyContent='center'>
              <TextField
                error={this.state.passwordError}
                onChange={this.handlePasswordEnter}
                value={this.state.password}
                type='password'
                inputProps={{
                  autocomplete: 'new-password',
                  form: {
                    autocomplete: 'off',
                  },
                }}
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color='primary' variant='outline' onClick={this.submitPassword}>Enter</Button>
          </DialogActions>
          <Keyboard
            theme={themeType === 'dark' ? 'hg-theme-dark' : 'hg-theme-default'}
            layoutName={this.state.keyboardLayout}
            layout={{
              default: [
                "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                "{tab} q w e r t y u i o p [ ] \\",
                "{lock} a s d f g h j k l ; ' {enter}",
                "{shift} z x c v b n m , . / {shift}",
                "{space}"
              ],
              shift: [
                "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
                "{tab} Q W E R T Y U I O P { } |",
                '{lock} A S D F G H J K L : " {enter}',
                "{shift} Z X C V B N M < > ? {shift}",
                "{space}"
              ],
              caps: [
                "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
                "{tab} Q W E R T Y U I O P { } |",
                '{lock} A S D F G H J K L : " {enter}',
                "{shift} Z X C V B N M < > ? {shift}",
                "{space}"
              ]
            }}
            onKeyPress={this.handleKeyboardInput}
          />
        </Dialog>
        
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
