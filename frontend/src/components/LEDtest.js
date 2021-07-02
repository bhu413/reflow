import React, { Component } from "react";
import {socket} from '../context/socket';
import Switch from "react-switch";


class LEDtest extends Component {
    constructor() {
        super();
        this.state = { checked: false };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        socket.on("lighton", () => {
            console.log("light on from server");
            this.setState({checked: true});
        });
        
        socket.on("lightoff", () => {
            console.log("light off from server");
            this.setState({checked: false});
        });
        
        fetch('/lightstatus')
            .then(response => response.json())
            .then(result => {
                console.log(result.lightison);
                if (result.lightison) {
                    this.setState({checked: true});
                } else {
                    this.setState({checked: false});
                }
        });
    }
  
    handleChange(checked) {
        //use socket io to update instead
        //this.setState({ checked });
        if (checked) {
                fetch("/lighton");
        } else {
                fetch("/lightoff");
        }
    }
  
    render() {
      return (
        <label>
          <span>Toggle Raspberry Pi LED!</span>
          <div>
            <Switch onChange={this.handleChange} checked={this.state.checked} uncheckedIcon={false} checkedIcon={false} />
          </div>
        </label>
      );
    }
  }

export default LEDtest;