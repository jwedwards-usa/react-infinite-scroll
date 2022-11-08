import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "./about";
import Home from "./home";
import MemeJson from "./memeService";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About />} />
          <Route path="/getMemes" element={<MemeJson />} />
        </Routes>
      </div>
    );
  }
}

export default App;