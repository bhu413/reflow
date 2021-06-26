import React, { Component } from "react";
import { DraggableGraph } from './DraggableGraph';

class Profile extends Component {

    componentDidMount() {
        
    }
  
    render() {
      return (
        <label>
          <span>chart</span>
          <div>
            <DraggableGraph />
          </div>
        </label>
      );
    }
  }

export default Profile;