import React, { Component } from "react";
import { Scatter } from 'react-chartjs-2';
//import * as zoom from 'chartjs-plugin-zoom'
import { DraggableGraph } from './DraggableGraph';
import { Input, Grid, IconButton, Typography } from '@material-ui/core';
import Keyboard from 'react-simple-keyboard';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.dragStart = this.dragStart.bind(this);
        this.drag = this.drag.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.state = {
            hitRadius: 1,
            pointRadius: 3,
        };
    }
/*
    shouldComponentUpdate(nextProps, nextState) {
        return true;
        console.log(this.props.profile.datapoints);
        console.log(nextProps.profile.datapoints);
        if (this.props.profile.datapoints !== nextProps.profile.datapoints ||
            this.props.historicTemps !== nextProps.historicTemps ||
            this.state.colors !== nextState.colors ||
            this.state.hitRadius !== nextState.hitRadius) {
            return true;
        } else {
            return false;
        }
    }
*/
    componentDidMount() {
        if (this.props.draggable) {
            //hitradius over 25 ensures that touch devices can drag points
            this.setState({ hitRadius: 30, pointRadius: 8 });
        }
    }


    dragStart(e, datasetIndex, index, value) {
        this.props.dragStart(e, datasetIndex, index, value);
    }

    drag(e, datasetIndex, index, value) {
        this.props.drag(e, datasetIndex, index, value);
    }

    dragEnd(e, datasetIndex, index, value) {
        this.props.dragEnd(e, datasetIndex, index, value);
    }

    render() {
        var tempColors = new Array(10).fill('rgba(42, 216, 255, 0.2)');
        if (this.props.draggable) {
            tempColors[this.props.activePoint] = '#001df5';
        }
        return (
            <Scatter data={{
                datasets: [
                    {
                        label: 'Profile',
                        data: this.props.profile.datapoints,
                        pointBackgroundColor: tempColors,
                        showLine: true,
                        backgroundColor: 'rgba(42, 216, 255, 0.2)',
                        borderColor: 'rgba(42, 216, 255, 1)',
                        borderWidth: 1,
                        pointRadius: this.state.pointRadius,
                        hoverRadius: this.state.pointRadius + 3,
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
                        borderDash: [10, 5],
                        fill: 0,
                    },
                ],
            }} options={{
                maintainAspectRatio: true,
                responsive: true,
                pointHitRadius: this.state.hitRadius,
                animation: {
                    duration: 0,
                },
                scales: {
                    y: {
                        grid: {
                            color: '#595a5c'
                        },
                        ticks: {
                            color: '#bfbfbf'
                        },
                        min: 0,
                        max: 300,
                        stepSize: 1,
                        title: {
                            text: 'Temperature (°C)',
                            display: true,
                            color: 'rgba(41, 216, 255, 0.7)',
                            font: {
                                size: "20%",
                            },
                        },
                    },
                    x: {
                        grid: {
                            color: '#595a5c'
                        },
                        ticks: {
                            color: '#bfbfbf'
                        },
                        min: 0,
                        max: this.props.maxTime,
                        stepSize: 1,
                        title: {
                            text: 'Time (Seconds)',
                            display: true,
                            color: 'rgba(41, 216, 255, 0.7)',
                            font: {
                                size: "20%",
                            },
                        },
                    },
                },

                plugins: {
                    dragData: {
                        round: 0,
                        dragX: true,
                        onDrag: (e, datasetIndex, index, value) => this.drag(e, datasetIndex, index, value),
                        onDragStart: (e, datasetIndex, index, value) => this.dragStart(e, datasetIndex, index, value),
                        onDragEnd: (e, datasetIndex, index, value) => this.dragEnd(e, datasetIndex, index, value)
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
                        display: false,
                    },
                },
            }} />
        );
    }
}
//this.props.historicTemps
export default Profile;