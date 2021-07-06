import { React, Component } from 'react';
import { Button, List } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Link } from "react-router-dom";

class ProfileList extends Component {
  constructor() {
    super();
    this.state = ({profiles: {}});
  }  


    componentDidMount() {
      fetch('/reflow_profiles/list')
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({ profiles: {result} });
        //initialize array of datapoints
        //newDatapoints = result.datapoints;
      });
    }
  
    render() {
      return (
          <>
          
            <Button as={Link} to="/" inverted color='red'>Cancel</Button>
            <Button as={Link} to="/" inverted color='blue'>Upload</Button>
            <Button as={Link} to="/" inverted color='blue'>Download</Button>
            <Button as={Link} to="/" inverted color='green'>Load</Button>
          </>
      );
    }
}

export default ProfileList;