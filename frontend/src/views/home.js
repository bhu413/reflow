import { React, Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Profile from '../components/Profile';
import EditIcon from '@material-ui/icons/Edit';
import { Button, Container, Grid, Typography, Box, Paper, Hidden } from '@material-ui/core';
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

class Home extends Component {
  constructor(props) {
    super(props);
    this.runProfile = this.runProfile.bind(this);
    this.forceRunProfile = this.forceRunProfile.bind(this);
    this.stop = this.stop.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
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
      } else if (this.state.status === "Cooling") {
        this.setState({ activeStep: 3 });
      }
    });
  }

  //need to fix
  shouldComponentUpdate(nextState) {
    return true;
  }

  componentWillUnmount() {
    socket.off("status_update");
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

  render() {
    const isRunning = this.state.status === "Preheat" || this.state.status === "Running" ;
    let stopStartButton;
    if (isRunning) {
      stopStartButton = <this.StopButton onClick={this.stop} startIcon={<StopIcon />} variant="contained" color="secondary">Stop</this.StopButton>;
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

        <Container maxWidth={false}>
          
          <Grid container>
              <Grid item sm={2}>
                <Box sx={{ paddingTop: 20 }}>
                  <Paper>
                    <Stepper activeStep={this.state.activeStep} orientation='vertical'>
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
            
            <Grid item sm={10}>
              <div style={{ paddingTop: "20px", width: '94%', margin: '0 0 0 auto' }}>
                <Profile draggable={false} profile={this.state.currentProfile} historicTemps={this.state.historicTemperature} />
              </div>
            </Grid>
          </Grid>



          <Grid container spacing={3} alignItems="center" justify="flex-end" style={{ paddingTop: '15px' }}>
            <Grid item xs={3} md={4} lg={6} xl={7}>
              <Typography variant='h5'>
                {this.state.currentProfile.name}
              </Typography>
            </Grid>
            <Grid item>
              <Button component={Link} to={{ pathname: '/editProfile', state: { profile: this.state.currentProfile } }} startIcon={<EditIcon />} variant="contained" color="primary" >Edit Current Profile</Button>
            </Grid>
            <Grid item>
              {stopStartButton}
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}

export default Home;