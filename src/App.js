import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import WelcomeScreen from "./components/WelcomeScreen/index.jsx";
// import MainScreen from "./components/Main/index";
import Room from "./components/Room/index.jsx";
import { ThemeProvider } from "styled-components";
import Theme from "./theme";

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={Theme}>
        <Router className="App">
          <Route path={"/"} exact={true} component={WelcomeScreen} />
          <Route path={`/room/:roomId`} component={Room} />{" "}
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;
