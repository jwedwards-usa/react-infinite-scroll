import "./App.css";
import React from "react";
import { Link } from "react-router-dom";


class Home extends React.Component {
  render() {
    return (
      <div>
        <div>
          <nav class="right">
            <Link to="/about">About</Link>
          </nav>
        </div>
        
        <div className="App">
          <header className="App-header">
            
          </header>
        </div>
      </div>
    );
  }
}

export default Home;
