import { React, Component } from 'react';
import Profile from '../components/Profile';
import { Button } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';



class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    //this.componentWillMount = this.componentWillMount.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = {datapoints: []};
  }

  
  componentDidMount() {
  }

  handleClick() {
    console.log(this.state.datapoints);
  }

  render() {
    return (
      <>
        <Profile draggable={true} datapoints={this.state.datapoints} />
        <Button as={Link} to="/" inverted color='red'>Cancel</Button>
        <Button onClick={this.handleClick} inverted color='green'>Save</Button>
      </>
    );
  }
}

export default EditProfile;