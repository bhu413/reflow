import { React, Component } from 'react';
import Profile from '../components/Profile';
import { Button, Input, Grid, Container } from '@material-ui/core';
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

import SaveIcon from '@material-ui/icons/Save';


class EditProfile extends Component {
  constructor(props) {
    super(props);
    //this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.goBack = this.goBack.bind(this);
    this.loadClicked = this.loadClicked.bind(this);
    this.forceLoadClicked = this.forceLoadClicked.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
    this.state = ({ loadDialog: false, forceLoadDialog: false, enterNameDialog: false });
    //this array will be sent to the profile child component to be updated with the new points
    this.newDatapoints = this.props.location.state.profile.datapoints;
    this.newName = this.props.location.state.profile.name;
  }

  handleInputChange(e) {
    this.newName = e.target.value;
  }
  
  componentDidMount() {

  }

  goBack() {
    this.props.history.goBack();
  }

  loadClicked() {
    axios.post('/api/reflow_profiles/load', { profile_name: this.newName, force_load: false })
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

    axios.post('/api/reflow_profiles/load', { profile_name: this.newName, force_load: true })
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
    this.setState({ loadDialog: false, forceLoadDialog: false, enterNameDialog: false });
  }

  saveProfile() {
    var newProfile = {};
    newProfile.name = this.newName;
    newProfile.date_created = Date.now();
    newProfile.last_run = 0;
    newProfile.datapoints = this.newDatapoints;

    axios.post('/api/reflow_profiles/save', newProfile)
      .then(res => {
        //console.log(res);
        this.setState({ loadDialog: true });
      });

  }

  render() {
    return (
      <>
        <StatusBar />

        <Dialog open={this.state.loadDialog}>
          <DialogTitle>
            Profile saved
          </DialogTitle>
          <DialogContent>
            Would you like to load the profile now?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelClicked} color="primary">
              Don't Load
            </Button>
            <Button onClick={this.loadClicked} color="primary" autoFocus>
              Load
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.state.forceLoadDialog}>
          <DialogTitle>
            Oven Currently Running
          </DialogTitle>
          <DialogContent>
            Stop oven and load profile?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelClicked} color="primary">
              Cancel
            </Button>
            <Button onClick={this.forceLoadClicked} color="primary" autoFocus>
              Force Load
            </Button>
          </DialogActions>
        </Dialog>

        <div style={{ paddingTop: "30px", width: '82%', margin: '0 auto' }}>
          <Profile draggable={true} profile={this.props.location.state.profile} arrayUpdater={this.newDatapoints} />
        </div>
        
        <Container maxWidth={false}>
          <Grid container spacing={3} alignItems="center" justify="center">
            <Grid item>
              <Button onClick={this.goBack} startIcon={<CancelIcon />} variant="contained" color="primary">Cancel</Button>
            </Grid>
            <Grid item>
              <Button onClick={this.saveProfile} startIcon={<SaveIcon />} variant="contained" color="primary">Save</Button>
            </Grid>
            <Grid item>
              <Input style={{ color: 'white' }} onChange={this.handleInputChange} label='Profile Name' defaultValue={this.newName} />
            </Grid>
          </Grid>
        </Container>
        
        
        
        
        {/*<Keyboard theme={"hg-theme-default"} />*/}
      </>
    );
  }
}

export default withRouter(EditProfile);