import { React, Component } from 'react';
import Profile from '../components/Profile';
import { Button, Input, Grid, Container, InputAdornment, IconButton, Typography, Switch } from '@material-ui/core';
import Keyboard from 'react-simple-keyboard';
import { withRouter } from "react-router-dom";
import 'react-simple-keyboard/build/css/index.css';
import axios from 'axios';
import CancelIcon from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import StatusBar from '../components/StatusBar';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import './keyboard.css';
import { withTheme } from '@material-ui/styles';


class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      loadDialog: false,
      forceLoadDialog: false,
      enterNameDialog: false,
      newName: this.props.location.state.profile.name,
      newDatapoints: this.props.location.state.profile.datapoints,
      newProfile: this.props.location.state.profile,
      currentX: this.props.location.state.profile.datapoints[0].x,
      currentY: this.props.location.state.profile.datapoints[0].y,
      maxTime: 400,
      maxNodes: 6,
      currentPoint: 0,
      showHistory: false,
      keyboardLayout: 'default',
      tempHistory: this.props.location.state.tempHistory || [],
      isLocal: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    });
    this.saveProfile = this.saveProfile.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.loadClicked = this.loadClicked.bind(this);
    this.forceLoadClicked = this.forceLoadClicked.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
    this.saveClicked = this.saveClicked.bind(this);
    this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
    this.cancelEnterName = this.cancelEnterName.bind(this);
    this.clearName = this.clearName.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.drag = this.drag.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.addX = this.addX.bind(this);
    this.subtractX = this.subtractX.bind(this);
    this.addY = this.addY.bind(this);
    this.subtractY = this.subtractY.bind(this);
    this.addTime = this.addTime.bind(this);
    this.subtractTime = this.subtractTime.bind(this);
    this.addNode = this.addNode.bind(this);
    this.subtractNode = this.subtractNode.bind(this);
    this.showHistoryClicked = this.showHistoryClicked.bind(this);
  }

  addX() {
    if (this.state.currentX < this.state.maxTime) {
      var tempProfile = this.state.newProfile;
      tempProfile.datapoints[this.state.currentPoint].x += 1;
      this.setState({ newProfile: tempProfile, currentX: this.state.currentX + 1 });
    }
  }

  subtractX() {
    if (this.state.currentX > 0) {
      var tempProfile = this.state.newProfile;
      tempProfile.datapoints[this.state.currentPoint].x -= 1;
      this.setState({ newProfile: tempProfile, currentX: this.state.currentX - 1 });
    }
  }

  addY() {
    if (this.state.currentY < 300) {
      var tempProfile = this.state.newProfile;
      tempProfile.datapoints[this.state.currentPoint].y += 1;
      this.setState({ newProfile: tempProfile, currentY: this.state.currentY + 1 });
    }
  }

  subtractY() {
    if (this.state.currentY > 0) {
      var tempProfile = this.state.newProfile;
      tempProfile.datapoints[this.state.currentPoint].y -= 1;
      this.setState({ newProfile: tempProfile, currentY: this.state.currentY - 1 });
    }
  }

  addTime() {
    if (this.state.maxTime < 2000) {
      this.setState({maxTime: this.state.maxTime + 100})
    }
  }

  subtractTime() {
    if (this.state.maxTime > 0 && this.state.maxTime - 100 >= this.state.newProfile.datapoints[this.state.newProfile.datapoints.length - 1].x) {
      this.setState({ maxTime: this.state.maxTime - 100 })
    }
  }

  addNode() {
    if (this.state.newProfile.datapoints.length < 10) {
      var tempProfile = this.state.newProfile;
      var newPoint = {};
      if (this.state.currentPoint === this.state.newProfile.datapoints.length - 1) {
        if (this.state.newProfile.datapoints[this.state.currentPoint].x <= this.state.maxTime - 50) {
          newPoint.x = tempProfile.datapoints[this.state.currentPoint].x + 25;
          newPoint.y = tempProfile.datapoints[this.state.currentPoint].y;
          tempProfile.datapoints.splice(this.state.currentPoint + 1, 0, newPoint);
          this.setState({ currentPoint: this.state.currentPoint + 1, currentX: newPoint.x, currentY: newPoint.y });
        } else {
          newPoint.x = Math.floor((tempProfile.datapoints[this.state.currentPoint].x + tempProfile.datapoints[this.state.currentPoint - 1].x) / 2);
          newPoint.y = Math.floor((tempProfile.datapoints[this.state.currentPoint].y + tempProfile.datapoints[this.state.currentPoint - 1].y) / 2)
          tempProfile.datapoints.splice(this.state.currentPoint, 0, newPoint);
          this.setState({ currentX: newPoint.x, currentY: newPoint.y });
        }
      } else {
        newPoint.x = Math.floor((tempProfile.datapoints[this.state.currentPoint].x + tempProfile.datapoints[this.state.currentPoint + 1].x) / 2);
        newPoint.y = Math.floor((tempProfile.datapoints[this.state.currentPoint].y + tempProfile.datapoints[this.state.currentPoint + 1].y) / 2)
        tempProfile.datapoints.splice(this.state.currentPoint + 1, 0, newPoint);
        this.setState({ currentPoint: this.state.currentPoint + 1, currentX: newPoint.x, currentY: newPoint.y });
      }
      this.setState({ newProfile: tempProfile, maxNodes: this.state.maxNodes + 1});
    }
  }

  subtractNode() {
    if (this.state.newProfile.datapoints.length > 2) {
      var tempProfile = this.state.newProfile;
      if (this.state.currentPoint === 0) {
        tempProfile.datapoints.splice(this.state.currentPoint, 1);
        this.setState({
          currentX: this.state.newProfile.datapoints[this.state.currentPoint].x,
          currentY: this.state.newProfile.datapoints[this.state.currentPoint].y
        });
      } else {
        tempProfile.datapoints.splice(this.state.currentPoint, 1);
        this.setState({
          currentPoint: this.state.currentPoint - 1,
          currentX: this.state.newProfile.datapoints[this.state.currentPoint - 1].x,
          currentY: this.state.newProfile.datapoints[this.state.currentPoint - 1].y
        });
      }
      this.setState({ newProfile: tempProfile, maxNodes: this.state.maxNodes - 1 });
    }
  }

  dragStart(e, datasetIndex, index, value) {
    this.setState({ currentPoint: index });
  }

  drag(e, datasetIndex, index, value) {
    var tempProfile = this.state.newProfile;
    tempProfile.datapoints[index] = value;
    this.setState({ currentX: value.x, currentY: value.y, newProfile: tempProfile });
  }

  dragEnd(e, datasetIndex, index, value) {
    var tempProfile = this.state.newProfile;
    tempProfile.datapoints[index] = value;

    //sort datapoints so that lines don't overlap
    for (let i = 0; i < tempProfile.datapoints.length; i++) {
      for (let j = i; j < tempProfile.datapoints.length; j++) {
        if (tempProfile.datapoints[j].x < tempProfile.datapoints[i].x) {
          //keep track of index/current point
          if (i === index) {
            index = j;
          } else if (j === index) {
            index = i;
          }
          var tempPoint = tempProfile.datapoints[i];
          tempProfile.datapoints[i] = tempProfile.datapoints[j];
          tempProfile.datapoints[j] = tempPoint;
        }
      }
    }
    this.setState({ currentX: value.x, currentY: value.y, currentPoint: index, newProfile: tempProfile });
  }

  handleInputChange(e) {
    var tempProfile = this.state.newProfile;
    tempProfile.name = e.target.value;
    this.setState({ newProfile: tempProfile });
  }
  
  componentDidMount() {
    this.setState({
      maxTime: Math.ceil(this.state.newProfile.datapoints[this.state.newProfile.datapoints.length - 1].x / 100) * 100,
      maxNodes: this.state.newProfile.datapoints.length
    });
  }

  goBack() {
    this.props.history.goBack();
  }

  loadClicked() {
    axios.post('/api/reflow_profiles/load', { profile_name: this.state.newProfile.name, force_load: false })
      .then(res => {
        //check if response is ok or if validation failed
        if (res.data.status === 200) {
          //go to home page
          const { history } = this.props;
          if (history) history.push('/');
        }
        else if (res.data.status === 409) {
          this.setState({ loadDialog: false });
          this.setState({ forceLoadDialog: true });
        }
      });
  }

  forceLoadClicked() {
    axios.post('/api/reflow_profiles/load', { profile_name: this.state.newProfile.name, force_load: true })
      .then(res => {
        //check if response is ok or if validation failed
        if (res.data.status === 200) {
          //go to home page
          const { history } = this.props;
          if (history) history.push('/');
        }
      });
  }

  cancelClicked() {
    this.setState({ loadDialog: false, forceLoadDialog: false});
  }

  saveProfile() {
    this.setState({enterNameDialog: false});
    var tempProfile = this.state.newProfile;
    tempProfile.date_created = Date.now();
    tempProfile.last_run = 0;
    this.setState({ newProfile: tempProfile });
    axios.post('/api/reflow_profiles/save', this.state.newProfile)
      .then(res => {
        var tempProfile = this.state.newProfile;
        tempProfile.name = res.data.new_name;
        this.setState({ newProfile: tempProfile });
        this.setState({ loadDialog: true });
      });

  }

  saveClicked() {
    this.setState({ enterNameDialog: true });
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
      let newName = this.state.newProfile.name;
      if (button === '{bksp}') {
        newName = newName.substring(0, newName.length - 1);
      } else if (button === '{space}') {
        newName += ' ';
      } else if (button === '{enter}') {
        this.saveProfile();
        return;
      } else {
        if (button !== '{tab}') {
          newName += button;
        }
      }
      var tempProfile = this.state.newProfile;
      tempProfile.name = newName;
      this.setState({ newProfile: tempProfile });
      if (this.state.keyboardLayout === 'shift') {
        this.setState({ keyboardLayout: 'default' });
      }
    }
  }

  cancelEnterName() {
    this.setState({ enterNameDialog: false });
  }

  clearName() {
    var tempProfile = this.state.newProfile;
    tempProfile.name = "";
    this.setState({ newProfile: tempProfile });
  }

  showHistoryClicked(e) {
    this.setState({ showHistory: e.target.checked });
  }

  render() {
    var keyboard = <></>;
    if (this.state.isLocal) {
      keyboard = <Keyboard
        theme={this.props.theme.palette.type === 'dark' ? 'hg-theme-dark' : 'hg-theme-default'}
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
      />;
    }

    var historySwitch = <></>;
    if (this.state.tempHistory.length > 1) {
      historySwitch = <Grid item>
        <Paper>
          <Grid container justifyContent="space-evenly">
            <Grid item>
              <Typography style={{ paddingLeft: 10 }}>History</Typography>
            </Grid>
            <Grid item>
              <Switch
                checked={this.state.showHistory}
                onChange={this.showHistoryClicked}
                size='small'
                color='secondary'
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>;
    }

    var historicDatapoints = []
    if (this.state.showHistory) {
      historicDatapoints = this.state.tempHistory;
    }

    return (
      <>
        <StatusBar />
        <Dialog open={this.state.loadDialog} onClose={this.cancelClicked}>
          <DialogTitle>
            Profile saved
          </DialogTitle>
          <DialogContent>
            Would you like to load the profile now?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelClicked} color="primary" variant='contained'>
              Don't Load
            </Button>
            <Button onClick={this.loadClicked} color="primary" variant='contained' autoFocus>
              Load
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.forceLoadDialog} onClose={this.cancelClicked}>
          <DialogTitle>
            Oven Currently Running
          </DialogTitle>
          <DialogContent>
            Stop oven and load profile?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelClicked} color="primary" variant='contained'>
              Cancel
            </Button>
            <Button onClick={this.forceLoadClicked} color="primary" variant='contained' autoFocus>
              Force Load
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.enterNameDialog} maxWidth={'md'} fullWidth onClose={this.cancelEnterName}>
          <DialogTitle align='center'>
            Name your profile:
          </DialogTitle>
          <DialogContent>
            <Grid container justifyContent='center'>
              <Input onChange={this.handleInputChange} label='Profile Name' value={this.state.newProfile.name}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={this.clearName}><ClearIcon /></IconButton>
                  </InputAdornment>
                }
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelEnterName} color="primary" variant='contained'>
              Cancel
            </Button>
            <Button onClick={this.saveProfile} color="primary" variant='contained' autoFocus>
              OK
            </Button>
          </DialogActions>
          {keyboard}
        </Dialog>

        <Container maxWidth={false}>
          <Grid container >
            <Grid item sm={2} lg={2}>

              <Hidden xsDown>
                <Grid container spacing={1} direction="column" style={{ paddingTop: '20px' }} >
                  <Grid item align='center'>
                    <Typography variant='h5'>
                      ({this.state.currentX}, {this.state.currentY})
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Paper>
                      <Grid item align='center'>
                      </Grid>
                      <Grid item align='center'>
                        <IconButton color='primary' size='small' onClick={this.addY}><ArrowUpwardIcon /></IconButton>
                      </Grid>
                      <Grid item>
                        <Grid container justifyContent='space-evenly' wrap='nowrap'>
                          <Grid item>
                            <IconButton color='primary' size='small' onClick={this.subtractX}><ArrowBackIcon /></IconButton>
                          </Grid>
                          <Grid item align='center' style={{ minWidth: 10 }}>

                          </Grid>
                          <Grid item>
                            <IconButton color='primary' size='small' onClick={this.addX}><ArrowForwardIcon /></IconButton>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item align='center'>
                        <IconButton color='primary' size='small' onClick={this.subtractY}><ArrowDownwardIcon /></IconButton>
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid item>
                    <Paper>
                      <Grid item align='center'>
                        <Typography variant='subtitle1'>Nodes</Typography>
                      </Grid>
                      <Grid container spacing={1} justifyContent='space-evenly'>
                        <Grid item>
                          <IconButton color='primary' size='small' onClick={this.subtractNode}><RemoveIcon /></IconButton>
                        </Grid>
                        <Grid item align='center'>
                          <Typography variant='h6' >{this.state.maxNodes}</Typography>
                        </Grid>
                        <Grid item>
                          <IconButton color='primary' size='small' onClick={this.addNode}><AddIcon /></IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid item>
                    <Paper>
                      <Grid item align='center'>
                        <Typography variant='subtitle1' >Max Time</Typography>
                      </Grid>
                      <Grid container spacing={1} justifyContent='space-evenly'>
                        <Grid item>
                          <IconButton color='primary' size='small' onClick={this.subtractTime}><RemoveIcon /></IconButton>
                        </Grid>
                        <Grid item align='center'>
                          <Typography variant='h6' >{this.state.maxTime}</Typography>
                        </Grid>
                        <Grid item>
                          <IconButton color='primary' size='small' onClick={this.addTime}><AddIcon /></IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {historySwitch}

                </Grid>
              </Hidden>
              
            </Grid>

            <Grid item sm={10}>
              <Hidden smDown>
                <Typography align='center' variant='h5'>
                  <u>{this.state.newProfile.name}</u>
                </Typography>
              </Hidden>
              <div style={{ paddingTop: "20px", width: '91%', marginLeft: 'auto', minWidth: 350 }}>
                <Profile
                  draggable={true}
                  profile={this.state.newProfile}
                  dragStart={this.dragStart}
                  drag={this.drag}
                  dragEnd={this.dragEnd}
                  maxTime={this.state.maxTime}
                  activePoint={this.state.currentPoint}
                  historicTemps={historicDatapoints}
                />
              </div>
            </Grid>
          </Grid>
        </Container>
        
        <Container maxWidth={false}>
          <Grid container spacing={3} alignItems="center" justifyContent="space-between" style={{ paddingTop: '15px' }}>
            <Grid item xs={4}>
              <Hidden mdUp>
                <Paper style={{ padding: '6px 7px 6px 10px' }}>
                  <Typography>
                    Profile: {this.state.newProfile.name}
                  </Typography>
                </Paper>
              </Hidden>
            </Grid>
            <Grid item>
              <Grid container spacing={3}>
                <Grid item>
                  <Button onClick={this.goBack} startIcon={<CancelIcon />} variant="contained" color="primary">Cancel</Button>
                </Grid>
                <Grid item>
                  <Button onClick={this.saveClicked} startIcon={<SaveIcon />} variant="contained" color="primary">Save</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        
        {/*<Keyboard theme={"hg-theme-default"} />*/}
      </>
    );
  }
}

export default withRouter(withTheme(EditProfile));