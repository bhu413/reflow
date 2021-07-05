import { React, Component } from 'react';
import Profile from '../components/Profile';
import { Button } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import axios from'axios';


class EditProfile extends Component {
  constructor(props) {
    super(props);
    
    //this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
  }

  
  componentDidMount() {
  }

  saveProfile() {
    axios.post(`/reflow_profiles/save`, { name: "test profile post 8", last_run: 1000000000 })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  render() {
    return (
      <>
        <Profile draggable={true} datapoints={this.props.datapoints} />
        <Button as={Link} to="/" inverted color='red'>Cancel</Button>
        <Button onClick={this.saveProfile} inverted color='green'>Save</Button>
      </>
    );
  }
}

export default EditProfile;