import React, { Component } from "react";
import { Scatter } from 'react-chartjs-2';
//import * as zoom from 'chartjs-plugin-zoom'
//import { Button } from 'semantic-ui-react';
import {DraggableGraph} from './DraggableGraph';


class Profile extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);

    //hitradius over 25 ensures that touch devices can drag points
    var hitRadius = 1;
    if (this.props.draggable) {
      hitRadius = 30;
    }
    this.options = {
      pointHitRadius: hitRadius,
      animation: {
        duration: 0,
      },
      scales: {
        y: {
          min: 0,
          max: 300,
          stepSize: 1,
          title: {
            text: 'Temperature',
            display: true,
            color: 'rgba(41, 216, 255, 0.7)',
            font: {
              size: 20,
            },
          },
        },
        x: {
          min: 0,
          max: 400,
          stepSize: 1,
          title: {
            text: 'Time (Seconds)',
            display: true,
            color: 'rgba(41, 216, 255, 0.7)',
            font: {
              size: 20,
            },
          },
        },
      },
    
      plugins: {
        dragData: {
          round: 0,
          dragX: true,
          onDrag: function (e, datasetIndex, index, value) {
            //console.log(e, datasetIndex, index, value);
          },
          onDragStart: function (e, element) {
            //console.log(e, element);
          },
          onDragEnd: function (e, datasetIndex, index, value) {
            //update array with new datapoint
            props.arrayUpdater[index] = value;
            
          },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        tooltip: {
          xAlign: 'right',
          yAlign: 'bottom',
          displayColors: false,
          caretPadding: 30,
          caretSize: 10,
          bodySpacing: 20,
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: this.props.profile.name
        },
      },
    };
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <>
        <Scatter data={{
          datasets: [
            {
              label: 'Profile',
              data: this.props.profile.datapoints,
              showLine: true,
              backgroundColor: 'rgba(42, 216, 255, 0.2)',
              borderColor: 'rgba(42, 216, 255, 1)',
              borderWidth: 1,
              pointRadius: 10,
              hoverRadius: 20,
              dragData: this.props.draggable,
            },
            {
              label: 'Historic Temerature',
              data: this.props.historicTemps,
              showLine: true,
              backgroundColor: 'rgba(233, 236, 0, 0.2)',
              borderColor: 'rgba(233, 236, 0, 1)',
              borderWidth: 1,
              pointRadius: 1,
              hoverRadius: 2,
              dragData: false,
              borderDash: [10,5],
            },
          ],
        }} options={this.options} />  
      </>
    );
  }
}
//this.props.historicTemps
export default Profile;