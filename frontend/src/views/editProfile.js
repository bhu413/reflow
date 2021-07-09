import { React, Component } from 'react';
import Profile from '../components/Profile';
import { Button, Input } from 'semantic-ui-react';
import Keyboard from 'react-simple-keyboard';
import { Link, withRouter } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import 'react-simple-keyboard/build/css/index.css';
import axios from'axios';


class EditProfile extends Component {
  constructor(props) {
    super(props);
    //this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    //this array will be sent to the profile child component to be updated with the new points
    this.newDatapoints = this.props.location.state.profile.datapoints;
    this.newName = this.props.location.state.profile.name;
    //this.date = new Date(date.now()).toISOString();
  }

  handleInputChange(e) {
    this.newName = e.target.value;
  }
  
  componentDidMount() {

  }

  saveProfile() {
    var newProfile = {};
    newProfile.name = this.newName;
    newProfile.date_created = Date.now();
    newProfile.last_run = 0;
    newProfile.datapoints = this.newDatapoints;

    axios.post('/reflow_profiles/save', newProfile)
      .then(res => {
        console.log(res);
      });
      //ask if user would like to load
      //go to home page
      const { history } = this.props;
      if(history) history.push('/');

  }

  render() {
    return (
      <>
        <Profile draggable={true} profile={this.props.location.state.profile} arrayUpdater={this.newDatapoints}/>
        <Button as={Link} to="/" inverted color='red'>Cancel</Button>
        <Button onClick={this.saveProfile} inverted color='green'>Save</Button>
        <Input onChange={this.handleInputChange} label='Profile Name' defaultValue={this.newName} />
        <Keyboard theme={"hg-theme-default"} />
      </>
    );
  }
}

export default withRouter(EditProfile);