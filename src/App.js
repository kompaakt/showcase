import React, { Component } from "react";
import "./App.css";
import WelcomeScreen from "./Components/WelcomeScreen/index.jsx";
import Main from "./Components/Main/index";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router className="App">
        <Route path="/" exact component={WelcomeScreen} />
        <Route path="/main" exact component={Main} />
      </Router>
    );
  }
}

export default App;
