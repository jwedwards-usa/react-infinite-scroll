import "./App.css";
import React from "react";
import { Link } from "react-router-dom";

class About extends React.Component {
  render() {
    return (
      <div>
        <div>
          <nav class="right">
            <Link to="/">Home</Link>
          </nav>
        </div>
        <div>
          <h2>About Page</h2>
          <main>
            <p>Thank you for visiting.</p>
          </main>
        </div>
      </div>
    );
  }
}

export default About;
