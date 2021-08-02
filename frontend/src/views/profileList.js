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
import { withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import StatusBar from '../components/StatusBar';
import DeleteIcon from '@material-ui/icons/Delete';
import FileSaver from 'file-saver';

class ProfileList extends Component {
  constructor() {
    super();
    var isLocal = false;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "") {
      isLocal = true;
    }
    this.state = ({
      profiles: [],
      activeItem: "",
      dialog: false,
      forceLoadDialog: false,
      allowUploadDownload: !isLocal,
      deleteDialog: false,
    });
    this.loadClicked = this.loadClicked.bind(this);
    this.forceLoadClicked = this.forceLoadClicked.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.downloadProfile = this.downloadProfile.bind(this);
    this.fileChanged = this.fileChanged.bind(this);
    this.handleForceDialogClose = this.handleForceDialogClose.bind(this);
    this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
    this.deleteClicked = this.deleteClicked.bind(this);
    this.deleteProfile = this.deleteProfile.bind(this);
  }

  SelectButton = withStyles({
    root: {
      backgroundColor: '#00ba16',
      '&:hover': {
        backgroundColor: '#009612'
      }
    }
  })(Button);

  DeleteButton = withStyles({
    root: {
      backgroundColor: '#bf0000',
      '&:hover': {
        backgroundColor: '#870000'
      }
    }
  })(Button);

  columns = [
    {
      field: 'name',
      headerName: 'Profile Name',
      width: 300,
    },
    {
      field: 'last_run',
      headerName: 'Last Loaded',
      type: 'dateTime',
      width: 200,
      editable: false,
    },
    {
      field: 'date_created',
      headerName: 'Date Created',
      type: 'dateTime',
      width: 200,
      editable: false,
    }
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

  handleDeleteDialogClose() {
    this.setState({ deleteDialog: false });
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
          if (element.last_run === 0) {
            element['last_run'] = "never";
          } else {
            element['last_run'] = new Date(element.last_run).toLocaleString();
          }
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
    var downloadableProfile = this.state.activeItem;
    downloadableProfile.date_created = Date.now();
    downloadableProfile.last_run = 0;
    delete downloadableProfile['id'];
    var blob = new Blob([JSON.stringify(downloadableProfile, null, 3)], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, downloadableProfile.name + ".json");
  }

  fileChanged(e) {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      var uploadedFile = JSON.parse(e.target.result);
      axios.post('/api/reflow_profiles/save', uploadedFile)
        .then(res => {
          this.getData();
        });
    };
  }

  deleteProfile() {
    axios.post('/api/reflow_profiles/delete', { profile_name: this.state.activeItem.name })
      .then(res => {
        this.getData();
        this.setState({ deleteDialog: false, dialog: false });
      });
  }

  deleteClicked() {
    this.setState({ deleteDialog: true });
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
            <div style={{width: '92%'}}>
              <Profile draggable={false} profile={this.state.activeItem} historicTemps={[]} />
            </div>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent='space-between'>
              <Grid item>
                <this.DeleteButton startIcon={<DeleteIcon />} variant='contained' color='primary' onClick={this.deleteClicked}>Delete</this.DeleteButton>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    {this.state.allowUploadDownload &&
                      <Button startIcon={<SaveAltIcon />} variant="contained" color="primary" onClick={this.downloadProfile}>Download</Button>
                    }
                  </Grid>
                  <Grid item>
                    <Button component={Link} to={{ pathname: '/editProfile', state: { profile: this.state.activeItem } }} startIcon={<EditIcon />} variant="contained" color="primary">Edit Profile</Button>
                  </Grid>
                  <Grid item>
                    <this.SelectButton onClick={this.loadClicked} startIcon={<DoneIcon />} variant="contained" color='primary'>Load</this.SelectButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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

        <Dialog open={this.state.deleteDialog}>
          <DialogTitle>
            Delete Profile
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete {}?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteProfile} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Container maxWidth={false}>
          <Grid container direction={"row"} align={"center"} justifyContent={"center"} spacing={2}>
            <Grid item xs={12} md={8} lg={6} style={{paddingTop: '20px'}}>
              <DataGrid
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
          <Grid container spacing={3} justifyContent="flex-end">
            <Grid item>
              <Button component={Link} to="/" startIcon={<CancelIcon />} variant="contained" color="primary">Cancel</Button>
            </Grid>
              {this.state.allowUploadDownload &&
                <Grid item>
              <Button startIcon={<PublishIcon />} variant="contained" color="primary" component="label" >Upload<input type="file" accept="application/JSON" hidden onChange={this.fileChanged} /></Button>
                </Grid>
              }
            <Grid item>
              <Button component={Link} to={{
                pathname: '/editProfile', state: {
                  profile: {
                    name: "new_profile",
                    date_created: Date.now(),
                    last_run: 0,
                    datapoints: [
                      {
                        x: 0,
                        y: 30
                      },
                      {
                        x: 75,
                        y: 30
                      },
                      {
                        x: 150,
                        y: 30
                      },
                      {
                        x: 225,
                        y: 30
                      },
                      {
                        x: 300,
                        y: 30
                      },
                      {
                        x: 375,
                        y: 30
                      }
                    ]
              } } }} startIcon={<EditIcon />} variant="contained" color="primary" >Create New Profile</Button>
            </Grid>
          </Grid>
        </Container>


        
      </>
    );
  }
}

export default withRouter(ProfileList);