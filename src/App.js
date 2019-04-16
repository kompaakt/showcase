import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen/index.jsx";
import { createGlobalStyle, ThemeProvider } from "styled-components/macro";
import Room from "./components/Room/index.jsx";
import Theme from "./theme";

const GlobalStyle = createGlobalStyle`
  html {
    background: ${props => props.theme.gradient};
    background-size: 100% auto;
    height: 100%;
    width: 100%;
  }
`;
const App = props => {
  const [theme, setTheme] = useState({ name: "light", theme: Theme.light });

  const switchTheme = () => {
    switch (theme.name) {
      case "light": {
        setTheme({ name: "dark", theme: Theme.dark });
        break;
      }
      case "dark": {
        setTheme({ name: "light", theme: Theme.light });
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <ThemeProvider theme={theme.theme}>
      <>
        <GlobalStyle />
        <Router className="App">
          <Route path={"/"} exact={true} component={WelcomeScreen} />
          <Route
            path={`/room/:roomId`}
            component={props => <Room {...props} switchTheme={switchTheme} />}
          />
        </Router>
      </>
    </ThemeProvider>
  );
};

export default App;
