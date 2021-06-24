import React, { Component } from "react";
import {socket} from '../context/socket';
import Switch from "react-switch";

/*
function LedON() {
    fetch("/lighton");
    console.log("light on");
}

function LedOFF() {
    fetch("/lightoff");
    console.log("light off");
}

function handleChange() {
    if (checked == true) {
        LedON();
    } else {
        LedOFF();
    }
}

function Profile() {
    

    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch("/lightstatus")
          .then((res) => res.json())
          .then((data) => setData(data.message));
    }, []);

    const [checked, setChecked] = useState(false);

    return (
        <div>
            <label>
                <span>Toggle LED on Raspberry Pi</span>
            </label>
            <div> 
                <Switch onChange={handleChange} checked={checked}/>
            </div>
        </div>
    )
}
*/
class Profile extends Component {
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

export default Profile;