import { React, Component } from 'react';
import Profile from '../components/Profile';
import { Button, List, Grid, Sticky } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './profileList.css';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios';

class ProfileList extends Component {
  constructor() {
    super();
    this.state = ({ profiles: [], activeItem: "" });
    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadClicked = this.loadClicked.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(e) {
    fetch('/reflow_profiles/' + e.target.innerText)
      .then(response => response.json())
      .then(result => {
        this.setState({ activeItem: result });
    });
  }

  componentDidMount() {
    fetch('/reflow_profiles/list')
      .then(response => response.json())
      .then(result => {
        this.setState({ profiles: result });

          //fetching datapoints
          fetch('/reflow_profiles/' + this.state.profiles[0])
            .then(response => response.json())
            .then(result => {
              this.setState({ activeItem: result });
        });
      });
  }

  loadClicked() {
    axios.post('/reflow_profiles/load', { profile_name: this.state.activeItem.name })
      .then(res => {
        //check if response is ok or if validation failed
        if (res.status === 200) {
          //go to home page
          const { history } = this.props;
          if (history) history.push('/');
        }
      })
  }

  render() {
    return (
      <>

        <Grid centered columns={2}>
          <Grid.Column>
            <Sticky>
              <Profile draggable={false} profile={this.state.activeItem} historicTemps={[]} />
              <h3>Date Created: {(new Date(this.state.activeItem.date_created)).toLocaleString()}</h3>
              <h3>Last Loaded: {(new Date(this.state.activeItem.last_run)).toLocaleString()}</h3>
            </Sticky>
          </Grid.Column>
          <Grid.Column>
            <div className="list">
              <List divided inverted relaxed>
                {this.state.profiles.map((item) => (
                  <List.Item key={item} onClick={this.handleItemClick}>
                    <List.Content>
                      <List.Header>{item}</List.Header>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </div>
          </Grid.Column>
        </Grid>
        
        <Button as={Link} to="/" inverted color='red'>Cancel</Button>
        {/*<Button as={Link} to="/" inverted color='blue'>Upload</Button>*/}
        {/*<Button as={Link} to="/" inverted color='blue'>Download</Button>*/}
        <Button onClick={this.loadClicked} inverted color='green'>Load</Button>
      </>
    );
  }
}

export default withRouter(ProfileList);