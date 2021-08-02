import React, { Component } from "react";
import { Scatter } from 'react-chartjs-2';
//import * as zoom from 'chartjs-plugin-zoom'
import { DraggableGraph } from './DraggableGraph';
import { Input, Grid, IconButton, Typography } from '@material-ui/core';
import Keyboard from 'react-simple-keyboard';
import { withTheme } from '@material-ui/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';

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
        var gridColor = this.props.theme.palette.text.hint;
        var primaryColor = this.props.theme.palette.primary.main;
        var transparentPrimary = alpha(this.props.theme.palette.primary.main, 0.2);
        var secondaryColor = this.props.theme.palette.secondary.main;
        var transparentSecondary = alpha(this.props.theme.palette.secondary.main, 0.2);
        var tempColors = new Array(10).fill(transparentPrimary);
        if (this.props.draggable) {
            tempColors[this.props.activePoint] = secondaryColor;
        }

        return (
            <Scatter data={{
                datasets: [
                    {
                        label: 'Profile',
                        data: this.props.profile.datapoints,
                        pointBackgroundColor: tempColors,
                        showLine: true,
                        lineTension: 0.05,
                        backgroundColor: transparentPrimary,
                        borderColor: primaryColor,
                        borderWidth: 3,
                        pointRadius: this.state.pointRadius,
                        hoverRadius: this.state.pointRadius + 3,
                        dragData: this.props.draggable,
                    },
                    {
                        label: 'Historic Temerature',
                        data: this.props.historicTemps,
                        showLine: true,
                        lineTension: 0.05,
                        backgroundColor: transparentSecondary,
                        borderColor: secondaryColor,
                        borderWidth: 1,
                        pointRadius: 3,
                        hoverRadius: 4,
                        dragData: false,
                        borderDash: [10, 5],
                        fill: 0,
                    },
                ],
            }} options={{
                maintainAspectRatio: true,
                aspectRatio: 1.9,
                responsive: true,
                pointHitRadius: this.state.hitRadius,
                animation: {
                    duration: 0,
                },
                scales: {
                    y: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: gridColor
                        },
                        min: 0,
                        max: 300,
                        stepSize: 1,
                        title: {
                            text: 'Temperature (°C)',
                            display: true,
                            color: primaryColor,
                            font: {
                                size: "20%",
                            },
                        },
                    },
                    x: {
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            color: gridColor
                        },
                        min: 0,
                        max: this.props.maxTime,
                        stepSize: 1,
                        title: {
                            text: 'Time (Seconds)',
                            display: true,
                            color: primaryColor,
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
export default withTheme(Profile);