import React from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import Adv from "./Adv";
import LoginRegister from "./LoginRegister";

import { checkLogin } from "../store/actions";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// privateRoute middleware, protects a route based on login state (token present in redux store)
const PrivateRoute = ({ component, token, checkLogin, ...options }) => {
  // const dispatch = useDispatch();
  // // hook into Redux store
  // const token = useSelector(state => state.auth.token);
  // // run check token action to kick things off
  console.log("here", token);
  if (!token) {
    // dispatch({ type: actionTypes.AUTH_STARTING });
    // dispatch(checkLogin());
    checkLogin();
  }
  const finalComponent = token ? component : LoginRegister;

  return <Route {...options} component={finalComponent} />;
};

function App(props) {
  // protect routes from user w/o token
  console.log(props);
  const { token, checkLogin } = props;
  checkLogin(props.dispatch);
  console.log("token: ", token);
  let routes = (
    <Switch>
      <Route exact path="/" component={LoginRegister} />
      <PrivateRoute
        path="/adv"
        component={Adv}
        token={token}
        checkLogin={checkLogin}
      />
    </Switch>
  );

  return <AppContainer>{routes}</AppContainer>;
}

const mapStateToProps = state => ({
  token: state.auth.token
});

const mapDispatchToProps = {
  checkLogin
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
