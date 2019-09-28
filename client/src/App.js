import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import Adv from "./Adv";
import Login from "./Login";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

function App() {
  // token in local storage for now...
  const token = localStorage.getItem("advToken");
  console.log(token);

  // protect routes from user w/o token
  let routes = (
    <Switch>
      <Route path="/" exact component={Login} />
    </Switch>
  );
  if (token) {
    routes = (
      <Switch>
        <Redirect to="/adv" />
        <Route path="/adv" component={Adv} />
      </Switch>
    );
  }

  return <AppContainer>{routes}</AppContainer>;
}

export default App;
