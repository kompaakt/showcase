import React, { Component } from "react";
import "./App.css";
import WelcomeScreen from "./Components/WelcomeScreen/index.jsx";
import MainScreen from "./Components/Main/index";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router className="App">
        <Route path="/" exact component={MainScreen} />
        <Route path="/main" exact component={MainScreen} />
      </Router>
    );
  }
}

export default App;
