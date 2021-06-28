import React, { Component } from "react";
import { Scatter, defaults } from 'react-chartjs-2';
import { DraggableGraph } from './DraggableGraph';

defaults.datasets.line.pointHitRadius = 30;

const data = {
  labels: ['Ramp to Soak', 'Heat Soak', 'Ramp to Peak', 'Reflow', 'Reflow End', 'Cooling'],
  datasets: [
    {
      label: 'Temperature',
      data: [{
        x: 10,
        y: 20
      }, {
        x: 15,
        y: 10
      }],
      showLine: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

const options = {
  
  scales: {
    y: {
      min: 0,
      max: 300,
      stepSize: 1,
    },
    x: {
      min: 0,
      max: 300,
      stepSize: 1,
    },
  },

  plugins: {
    dragData: {
      dragX: true,
      magnet: {
        to: Math.round,
      },
      onDrag: function (e, datasetIndex, index, value) {
        //console.log(e, datasetIndex, index, value);
      },
      onDragStart: function (e, element) {
        //console.log(e, element);
      },
      onDragEnd: function (e, datasetIndex, index, value) {
        //console.log(e, datasetIndex, index, value);
      },
    },
  },
};

class Profile extends Component {
  
    componentDidMount() {
        
    }
  
    render() {
      return (
        <>
          <Scatter data={data} options={options} />
        </> 
      );
    }
  }

export default Profile;