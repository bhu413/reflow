import React, { Component } from "react";
import { Scatter, defaults } from 'react-chartjs-2';
//import { DraggableGraph } from './DraggableGraph';

//ensures that touch devices can drag points on chart
defaults.datasets.scatter.pointHitRadius = 40;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.data = {
      datasets: [
        {
          label: 'Profile',
          data: this.props.datapoints,
          showLine: true,
          backgroundColor: 'rgba(42, 216, 255, 0.2)',
          borderColor: 'rgba(42, 216, 255, 1)',
          borderWidth: 1,
          pointRadius: 10,
          hoverRadius: 20,
          dragData: this.props.draggable,
        },
      ],
    };
    this.options = {
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
            console.log(value);
            //update array that was passed in by parent component
            props.datapoints[index] = value;
          },
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
      },
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <>
        <Scatter data={this.data} options={this.options}/>
      </>
    );
  }
}

export default Profile;