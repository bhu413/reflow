import { React, Component } from 'react';
import Profile from '../components/Profile';
import { Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid'
import './profileList.css';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios';
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import PublishIcon from '@material-ui/icons/Publish';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { styled } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import StatusBar from '../components/StatusBar';

class ProfileList extends Component {
  constructor() {
    super();
    this.state = ({ profiles: [], activeItem: "", dialog: false });
    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadClicked = this.loadClicked.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);

  }
  MyDataGrid = styled(DataGrid)({
    color: 'white',
    height: 550,
  });

  SelectButton = styled(Button)({
    background: '#3dd900',
    '&:hover': '#3dd900'
  });

  columns = [
    { field: 'name', headerName: 'Profile Name', width: 200 },
    {
      field: 'last_run',
      headerName: 'Last Loaded',
      width: 200,
      editable: false,
    },
    {
      field: 'date_created',
      headerName: 'Date Created',
      width: 200,
      editable: false,
    },
  ];


  handleItemClick(e) {
    this.setState({ activeItem: e.row })
    this.setState({ dialog: true });
  }

  handleDialogClose() {
    this.setState({ dialog: false });
  }

  componentDidMount() {
    fetch('/api/reflow_profiles/all')
      .then(response => response.json())
      .then(result => {
        result.forEach(element => {
          element['id'] = element.name;
          element['date_created'] = new Date(element.date_created).toLocaleString();
          element['last_run'] = new Date(element.last_run).toLocaleString();
        });
        this.setState({ profiles: result });
      });
  }

  loadClicked() {
    axios.post('/api/reflow_profiles/load', { profile_name: this.state.activeItem.name })
      .then(res => {
        //check if response is ok or if validation failed
        if (res.status === 200) {
          //go to home page
          const { history } = this.props;
          if (history) history.push('/');
        }
      });
  }

  render() {
    return (
      <>
        <StatusBar />
        <Dialog onClose={this.handleDialogClose} open={this.state.dialog} fullWidth={true} maxWidth={"sm"}>
          <DialogTitle>
            {this.state.activeItem.name}
            <IconButton aria-label="close" onClick={this.handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Profile draggable={false} profile={this.state.activeItem} historicTemps={[]} />
          </DialogContent>
          <DialogActions>
            <Button component={Link} to={{ pathname: '/editProfile', state: { profile: this.state.activeItem } }} startIcon={<EditIcon />} variant="contained" color="primary">Edit Profile</Button>
            <this.SelectButton onClick={this.loadClicked} startIcon={<DoneIcon />} variant="contained">Load</this.SelectButton>
          </DialogActions>
        </Dialog>

        <Grid container direction={"row"} align={"center"} justifyContent={"center"} spacing={2}>
            <Grid item xs={12} md={8} lg={6}>
              <this.MyDataGrid
                rows={this.state.profiles}
                columns={this.columns}
                pageSize={5}
                checkboxSelection={false}
              disableMultipleSelection={true}
              onRowClick={this.handleItemClick}
              autoHeight={true}
              />
            </Grid>
        </Grid>
        


        <Button component={Link} to="/" startIcon={<CancelIcon />} variant="contained" color="primary">Cancel</Button>
        
        <Button startIcon={<PublishIcon />} variant="contained" color="primary">Upload</Button>
        <Button startIcon={<SaveAltIcon />} variant="contained" color="primary">Download</Button>
        
      </>
    );
  }
}

export default withRouter(ProfileList);