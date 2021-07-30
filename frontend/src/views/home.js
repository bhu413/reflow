import { React, Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Profile from '../components/Profile';
import EditIcon from '@material-ui/icons/Edit';
import { Button, Container, Grid, Typography, Box } from '@material-ui/core';
import { Link } from "react-router-dom";
import { socket } from '../helpers/socket';
import axios from 'axios';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import StatusBar from '../components/StatusBar';
import { styled } from '@material-ui/core/styles';

class Home extends Component {
  constructor() {
    super();
    this.runProfile = this.runProfile.bind(this);
    this.stop = this.stop.bind(this);
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
      activeStep: 0
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

  StartButton = styled(Button)({
    background: '#3dd900',
    '&:hover': '#3dd900'
  });

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

  render() {
    const isRunning = this.state.status !== "Ready";
    let stopStartButton;
    if (isRunning) {
      stopStartButton = <Button onClick={this.stop} startIcon={<StopIcon />} variant="contained" color="secondary">Stop</Button>;
    } else {
      stopStartButton = <this.StartButton onClick={this.runProfile} startIcon={<PlayArrowIcon />} variant="contained" color="primary">Start</this.StartButton>;
    }
    return (
      <>

        <StatusBar />
        <Container maxWidth={false}>
          <Grid container>
            <Grid item sm={2}>
              <Box sx={{ paddingTop: 20}}>
                <Stepper activeStep={this.state.activeStep} orientation='vertical' style={{ background: '#454647' }}>
                  {this.steps.map((step, index) => (
                    <Step key={step.label} >
                      <StepLabel style={{ color: '#FFFFFF' }}>
                        {step.label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Grid>
            <Grid item sm={10}>
              <div style={{ paddingTop: "20px", width: '96%', margin: '0 0 0 auto' }}>
                <Profile draggable={false} profile={this.state.currentProfile} historicTemps={this.state.historicTemperature} />
              </div>
            </Grid>
          </Grid>



          <Grid container spacing={3} alignItems="center" justify="flex-end" style={{ paddingTop: '10px' }}>
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