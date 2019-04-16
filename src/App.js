import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import WelcomeScreen from "./components/WelcomeScreen/index.jsx";
// import MainScreen from "./components/Main/index";
import Room from "./components/Room/index.jsx";

class App extends Component {
  render() {
    return (
      <Router className="App">
        <Route path={"/"} exact={true} component={WelcomeScreen} />
        <Route path={`/room/:roomId`} component={Room} />
      </Router>
    );
  }
}

export default App;
