import axios from "../axios-instance";

const actionTypes = {
  AUTH_STARTING: "AUTH_STARTING",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  AUTH_FAIL: "AUTH_FAIL",
  ADV_INIT_STARTING: "ADV_INIT_STARTING",
  ADV_INIT_SUCCESS: "ADV_INIT_SUCCESS",
  ADV_INIT_FAIL: "ADV_INIT_FAIL",
  LOGOUT: "LOGOUT"
};

// *****************************
// -------actions-------
// *****************************
function authStarting() {
  return { type: actionTypes.AUTH_STARTING };
}

function authSuccess(token) {
  return {
    type: actionTypes.AUTH_SUCCESS,
    payload: token
  };
}

function authFail(err) {
  return {
    type: actionTypes.AUTH_FAIL,
    payload: err
  };
}

function logout() {
  localStorage.removeItem("advToken");
  return { type: actionTypes.LOGOUT };
}

// *****************************
// -------action creators-------
// *****************************
function handleLogin(userInput) {
  return async dispatch => {
    dispatch(authStarting());
    // console.log("auth starting, usr:", userInput);
    return axios
      .post("login/", userInput)
      .then(res => {
        localStorage.setItem("advToken", res.data.key);
        dispatch(authSuccess(res.data.key));
      })
      .catch(err => {
        console.log("caught onLoginRegister - actions", err.message);
        dispatch(authFail(err.message));
        // re-throw error so that useLoginForm will catch and handle
        throw err;
      });
  };
}

function handleRegister(userInput) {
  return async dispatch => {
    dispatch(authStarting());
    return axios.post("register/", userInput).then(res => {
      localStorage.setItem("advToken", res.data.key);
      dispatch(authSuccess(res.data.key));
    });
  };
}

function advInit(location, history) {
  // check for active session (token in local storage)
  // if found, get adv data & redirect to requested location
  return function(dispatch) {
    const token = localStorage.getItem("advToken");
    dispatch(authStarting());
    if (token) {
      // Protected routes automatically render a redirect to "/"
      // need to undo this if we find a token
      dispatch(authSuccess(token));
      // start request to init/ here
      console.log("advInit found, start init");
      history.push(location);
    } else {
      dispatch(authFail("No active session."));
    }
  };
}

const actionExports = {
  actionTypes,
  logout,
  advInit,
  handleLogin,
  handleRegister
};

export default actionExports;
