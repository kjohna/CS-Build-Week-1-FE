import React from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";

import { useAuthContext } from "./AuthProvider";
import Adv from "./Adv";
import LoginRegister from "./LoginRegister";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// privateRoute middleware, protects a route using auth context via AuthProvider
const PrivateRoute = ({ component, ...options }) => {
  const { user } = useAuthContext();
  console.log(user);
  const finalComponent = user ? component : LoginRegister;

  return <Route {...options} component={finalComponent} />;
};

function App() {
  // protect routes from user w/o token
  let routes = (
    <Switch>
      <Route path="/" exact component={LoginRegister} />
      <PrivateRoute path="/adv" component={Adv} />
    </Switch>
  );

  return <AppContainer>{routes}</AppContainer>;
}

export default App;
