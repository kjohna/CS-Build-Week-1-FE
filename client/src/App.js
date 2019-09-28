import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import { useAuthContext } from "./AuthProvider";
import Adv from "./Adv";
import Login from "./Login";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const PrivateRoute = ({ component, ...options }) => {
  const { user } = useAuthContext();
  console.log(user);
  const finalComponent = user ? component : Login;

  return <Route {...options} component={finalComponent} />;
};

function App() {
  // protect routes from user w/o token
  let routes = (
    <Switch>
      <Route path="/" exact component={Login} />
      <PrivateRoute path="/adv" component={Adv} />
    </Switch>
  );

  return <AppContainer>{routes}</AppContainer>;
}

export default App;
