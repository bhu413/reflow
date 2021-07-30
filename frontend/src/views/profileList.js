import { React, Component } from 'react';
import Profile from '../components/Profile';
import { Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Container } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid'
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
import FileSaver from 'file-saver';

class ProfileList extends Component {
  constructor() {
    super();
    this.state = ({ profiles: [], activeItem: "", dialog: false, forceLoadDialog: false });
    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadClicked = this.loadClicked.bind(this);
    this.forceLoadClicked = this.forceLoadClicked.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.downloadProfile = this.downloadProfile.bind(this);
    this.fileChanged = this.fileChanged.bind(this);
    this.handleForceDialogClose = this.handleForceDialogClose.bind(this);
  }
  MyDataGrid = styled(DataGrid)({
    backgroundColor: 'white'
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

  handleForceDialogClose() {
    this.setState({ forceLoadDialog: false });
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
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
    
    axios.post('/api/reflow_profiles/load', { profile_name: this.state.activeItem.name, force_load: false })
      .then(res => {
        //check if response is ok or if validation failed
        if (res.data.status === 200) {
          //go to home page
          const { history } = this.props;
          if (history) history.push('/');
        }
        else if (res.data.status === 409) {
          console.log('got 409')
          this.setState({ forceLoadDialog: true });
        }
      });
  }

  forceLoadClicked() {

    axios.post('/api/reflow_profiles/load', { profile_name: this.state.activeItem.name, force_load: true })
      .then(res => {
        //check if response is ok or if validation failed
        if (res.data.status === 200) {
          //go to home page
          const { history } = this.props;
          if (history) history.push('/');
        }
      });
  }

  downloadProfile() {
    var blob = new Blob([JSON.stringify(this.state.activeItem, null, 3)], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, this.state.activeItem.name + ".json");
  }

  fileChanged(e) {
    console.log(e.target.files[0]);
    axios.post('/api/reflow_profiles/save', e.target.files[0])
      .then(res => {
        this.getData();
      });
  }


  render() {
    return (
      <>
        <StatusBar />
        <Dialog onClose={this.handleDialogClose} open={this.state.dialog} fullWidth={true}>
          <DialogTitle>
            {this.state.activeItem.name}
            <IconButton aria-label="close" onClick={this.handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div style={{width: '97%'}}>
              <Profile draggable={false} profile={this.state.activeItem} historicTemps={[]} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button startIcon={<SaveAltIcon />} variant="contained" color="primary" onClick={this.downloadProfile}>Download</Button>
            <Button component={Link} to={{ pathname: '/editProfile', state: { profile: this.state.activeItem } }} startIcon={<EditIcon />} variant="contained" color="primary">Edit Profile</Button>
            <this.SelectButton onClick={this.loadClicked} startIcon={<DoneIcon />} variant="contained">Load</this.SelectButton>
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
            <Button onClick={this.handleForceDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.forceLoadClicked} color="primary" autoFocus>
              Force Load
            </Button>
          </DialogActions>
        </Dialog>

        <Container maxWidth={false}>
          <Grid container direction={"row"} align={"center"} justifyContent={"center"} spacing={2}>
            <Grid item xs={12} md={8} lg={6} style={{paddingTop: '20px'}}>
              <this.MyDataGrid
                rows={this.state.profiles}
                rowHeight={45}
                columns={this.columns}
                pageSize={5}
                checkboxSelection={false}
                disableMultipleSelection={true}
                onRowClick={this.handleItemClick}
                autoHeight={true}
              />
            </Grid>
          </Grid>
        </Container>
        
        <Container maxWidth={false}>
          <Grid container spacing={3} alignItems="center" justify="center">
            <Grid item>
              <Button component={Link} to="/" startIcon={<CancelIcon />} variant="contained" color="primary">Cancel</Button>
            </Grid>
            <Grid item>
              <Button startIcon={<PublishIcon />} variant="contained" color="primary" component="label" >Upload<input type="file" accept=".json" hidden onChange={this.fileChanged} /></Button>
            </Grid>
          </Grid>
        </Container>


        
      </>
    );
  }
}

export default withRouter(ProfileList);