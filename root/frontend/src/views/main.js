import { React, Component } from 'react';
import Temperature from '../components/Temperature';
import Profile from '../components/Profile';

class Main extends Component {
    
    componentDidMount() {
        
    }
  
    render() {
      return (
          <>
            <Temperature />
            <Profile />
          </>
      );
    }
}

export default Main;