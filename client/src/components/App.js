import React from "react";
import { Switch, Redirect, Route, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import Adv from "./Adv";
import LoginRegister from "./LoginRegister";

import actionExports from "../store/actions";

const { advInit } = actionExports;

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// privateRoute middleware, protects a route based on login state (token present in redux store)
const PrivateRoute = ({ component, token, ...options }) => {
  const finalComponent = token ? (
    <Route {...options} component={component} />
  ) : (
    <Redirect to="/" />
  );

  return finalComponent;
};

function App(props) {
  // protect routes from user w/o token
  const { auth, advInit } = props;
  const token = auth.token;
  const history = useHistory();
  // if no token, check local storage for existing token
  // auth.error is set after unsuccessful lcl storage check
  if (!token && !auth.error && !auth.loading) {
    // will redirect to /adv if token is found
    // need to pass in history and location to achieve this since token is not set, a redirect to "/" will render this time
    // NOTE: could employ useLocation to do this dynamically
    advInit("/adv", history);
  }
  // advInit(props.dispatch);
  let routes = (
    <Switch>
      <Route exact path="/" component={LoginRegister} />
      <PrivateRoute path="/adv" component={Adv} token={token} />
    </Switch>
  );

  return <AppContainer>{routes}</AppContainer>;
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  advInit
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
