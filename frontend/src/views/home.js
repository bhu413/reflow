import { React, Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Profile from '../components/Profile';
import EditIcon from '@material-ui/icons/Edit';
import { Button, Container, Grid, Typography, Box, Paper } from '@material-ui/core';
import { Link } from "react-router-dom";
import { socket } from '../helpers/socket';
import axios from 'axios';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import StatusBar from '../components/StatusBar';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Hidden from '@material-ui/core/Hidden';

class Home extends Component {
  constructor(props) {
    super(props);
    this.runProfile = this.runProfile.bind(this);
    this.forceRunProfile = this.forceRunProfile.bind(this);
    this.stop = this.stop.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
    this.coolingDialogClose = this.coolingDialogClose.bind(this);
    this.state = ({
      currentProfile: {
        "name": "flat",
        "date_created": 0,
        "last_run": 0,
        "datapoints": [
          {
            "x": 0,
            "y": 30
          },
          {
            "x": 75,
            "y": 30
          },
          {
            "x": 150,
            "y": 30
          },
          {
            "x": 225,
            "y": 30
          },
          {
            "x": 300,
            "y": 30
          },
          {
            "x": 375,
            "y": 30
          }
        ]
      },
      historicTemperature: [],
      percentDone: 0,
      status: "Ready",
      activeStep: 0,
      startWhenCoolingDialog: false,
      coolingDialog: false
    });

  }

  steps = [
    {
      label: 'Ready'
    },
    {
      label: 'Preheat',
      description: ''
    },
    {
      label: 'Run Profile',
      description: ''
    },
    {
      label: 'Peak',
      description: ''
    },
    {
      label: 'Cooling',
      description: ''
    }
  ];

  StartButton = withStyles({
    root: {
      backgroundColor: '#00ba16',
      '&:hover': {
        backgroundColor: '#009612'
      }
    }
  })(Button);

  StopButton = withStyles({
    root: {
      backgroundColor: '#bf0000',
      '&:hover': {
        backgroundColor: '#870000'
      }
    }
  })(Button);

  componentDidMount() {
    fetch('/api/current_profile')
      .then(response => response.json())
      .then(result => {
        this.setState({ currentProfile: result.current_profile });
      });
    socket.on("status_update", (message) => {
      this.setState({
        currentProfile: message.current_profile,
        historicTemperature: message.historic_temperature,
        status: message.status
      });
      if (this.state.status === "Ready") {
        this.setState({ activeStep: 0 });
      } else if (this.state.status === "Preheat") {
        this.setState({ activeStep: 1 });
      } else if (this.state.status === "Running") {
        this.setState({ activeStep: 2 });
      } else if (this.state.status === "Peak") {
        this.setState({ activeStep: 3 });
      } else if (this.state.status === "Cooling") {
        this.setState({ activeStep: 4 });
      }
    });
    socket.on("notify_cooling", (message) => {
      this.setState({
        coolingDialog: true
      });
    });
  }

  //need to fix
  shouldComponentUpdate(nextState) {
    return true;
  }

  componentWillUnmount() {
    socket.off("status_update");
    socket.off("notify_cooling");
  }

  runProfile() {
      axios.post('/api/run', { override: false })
        .then(res => {
          if (res.data.status === 200) {
            this.setState({ status: "Running" });
          } else if (res.data.status === 409) {
            this.setState({ startWhenCoolingDialog: true });
          }
        });
  }

  forceRunProfile() {
    axios.post('/api/run', { override: true })
      .then(res => {
        if (res.data.status === 200) {
          this.setState({ status: "Running", startWhenCoolingDialog: false  });
        }
      });
  }

  stop() {
    axios.post('/api/stop', { reason: "test" })
      .then(res => {
        if (res.data.status === 200) {
          this.setState({ status: "Ready" });
        }
      });
  }

  cancelClicked() {
    this.setState({ startWhenCoolingDialog: false });
  }

  coolingDialogClose() {
    this.setState({ coolingDialog: false });
  }

  render() {
    const isRunning = this.state.status === "Preheat" || this.state.status === "Running" || this.state.status === "Peak" ;
    let stopStartButton;
    if (isRunning) {
      stopStartButton = <this.StopButton onClick={this.stop} startIcon={<StopIcon />} variant="contained" color="primary">Stop</this.StopButton>;
    } else {
      stopStartButton = <this.StartButton onClick={this.runProfile} startIcon={<PlayArrowIcon />} variant="contained" color="primary">Start</this.StartButton>;
    }
    return (
      <>
        <StatusBar />

        <Dialog open={this.state.startWhenCoolingDialog} onClose={this.cancelClicked}>
          <DialogTitle>
            Oven still cooling
          </DialogTitle>
          <DialogContent>
            Start profile anyway?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelClicked} color="primary">
              Cancel
            </Button>
            <Button onClick={this.forceRunProfile} color="primary" autoFocus>
              Start Anyway
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.coolingDialog} onClose={this.coolingDialogClose}>
          <DialogTitle>
            Cooling Started
          </DialogTitle>
          <DialogContent>
            Door can be opened
          </DialogContent>
          <DialogActions>
            <Button onClick={this.coolingDialogClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        <Container maxWidth={false}>
          
          <Grid container>
            <Hidden xsDown>
              <Grid item sm={2}>
                <Box sx={{ paddingTop: 20 }}>
                  <Paper>
                    <Stepper activeStep={this.state.activeStep} orientation='vertical' square={false}>
                      {this.steps.map((step, index) => (
                        <Step key={step.label} >
                          <StepLabel>
                            <Typography variant='subtitle2' align='left'>
                              {step.label}
                            </Typography>
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Paper>
                </Box>
              </Grid>
            </Hidden>
              
            
            <Grid item sm={10}>
              <div style={{ paddingTop: "20px", width: '93%', margin: '0 0 0 auto', minWidth: 350 }}>
                <Paper>
                  <Hidden smDown>
                    <Typography align='center' variant='h5'>
                      <u>{this.state.currentProfile.name}</u>
                    </Typography>
                  </Hidden>
                  <div style={{padding: '10px 10px 6px 10px '}}>
                    <Profile draggable={false} profile={this.state.currentProfile} historicTemps={this.state.historicTemperature}/>
                  </div>
                </Paper>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={3} alignItems="center" justifyContent='space-between' style={{ paddingTop: '15px' }}>
            <Grid item xs={4}>
              <Hidden mdUp>
                <Paper style={{ padding: '6px 7px 6px 10px' }}>
                  <Typography>
                    Profile: {this.state.currentProfile.name}
                  </Typography>
                </Paper>
              </Hidden>
            </Grid>
            
            
            <Grid item>
              
              <Grid container spacing={3}>
                <Grid item>
                  <Button component={Link} to={{ pathname: '/profileList' }} startIcon={<ListAltIcon />} variant="contained" color="primary" >Profile List</Button>
                </Grid>
                <Grid item>
                  <Button component={Link} to={{ pathname: '/editProfile', state: { profile: this.state.currentProfile, tempHistory: this.state.historicTemperature } }} startIcon={<EditIcon />} variant="contained" color="primary" >Edit</Button>
                </Grid>
                <Grid item>
                  {stopStartButton}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}

export default Home;