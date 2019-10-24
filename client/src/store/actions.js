import axios from "../axios-instance";

const actionTypes = {
  AUTH_STARTING: "AUTH_STARTING",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  AUTH_FAIL: "AUTH_FAIL",
  ADV_INIT_STARTING: "ADV_INIT_STARTING",
  ADV_INIT_SUCCESS: "ADV_INIT_SUCCESS",
  ADV_INIT_FAIL: "ADV_INIT_FAIL",
  LOGOUT: "LOGOUT",
  ADV_MOVE_STARTING: "ADV_MOVE_STARTING",
  ADV_MOVE_SUCCESS: "ADV_MOVE_SUCCESS",
  ADV_MOVE_FAIL: "ADV_MOVE_FAIL"
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

function advInitStarting() {
  return { type: actionTypes.ADV_INIT_STARTING };
}

function advInitSuccess(advData) {
  return {
    type: actionTypes.ADV_INIT_SUCCESS,
    payload: advData
  };
}

function advInitFail(err) {
  return {
    type: actionTypes.ADV_INIT_FAIL,
    payload: err
  };
}

function logout() {
  localStorage.removeItem("advToken");
  return { type: actionTypes.LOGOUT };
}

function advMoveStarting() {
  return { type: actionTypes.ADV_MOVE_STARTING };
}

function advMoveSuccess(advData) {
  return {
    type: actionTypes.ADV_MOVE_SUCCESS,
    payload: advData
  };
}

function advMoveFail(err) {
  return {
    type: actionTypes.ADV_MOVE_FAIL,
    payload: err
  };
}

// *****************************
// -------action creators-------
// *****************************
function handleLogin(userInput) {
  return async dispatch => {
    dispatch(authStarting());
    console.log("auth starting, usr:", userInput);
    return axios
      .post("login/", userInput)
      .then(res => {
        localStorage.setItem("advToken", res.data.key);
        // MUST add token to all headers of subsequent axios calls
        // since advInit will be called immediately after any previous
        // user logged in since refresh will be init-ed with prev user's token
        axios.defaults.headers.common[
          "Authorization"
        ] = `Token ${res.data.key}`;
        dispatch(authSuccess(res.data.key));
      })
      .catch(err => {
        dispatch(authFail(err.message));
        // re-throw error so that useLoginForm will catch and handle
        throw err;
      });
  };
}

function handleRegister(userInput) {
  return async dispatch => {
    dispatch(authStarting());
    return axios
      .post("registration/", userInput)
      .then(res => {
        localStorage.setItem("advToken", res.data.key);
        // MUST add token to all headers of subsequent axios calls
        // since advInit will be called immediately after any previous
        // user logged in since refresh will be init-ed with prev user's token
        axios.defaults.headers.common[
          "Authorization"
        ] = `Token ${res.data.key}`;
        dispatch(authSuccess(res.data.key));
      })
      .catch(err => {
        dispatch(authFail(err.message));
        throw err;
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
      dispatch(advInitStarting());
      return axios
        .get("adv/init/")
        .then(res => {
          dispatch(advInitSuccess(res.data));
          history.push(location);
        })
        .catch(err => {
          dispatch(advInitFail(err.message));
        });
    } else {
      dispatch(authFail("No active session."));
    }
  };
}

function advMove(direction) {
  // direction should be valid, checked by moveControls rendering and reducer tests
  return function(dispatch) {
    dispatch(advMoveStarting);
    const data = { direction };
    console.log("posting: ", data);
    return axios
      .post("adv/move/", data)
      .then(res => {
        // Note: a successful response is sent even if an invalid direction is passed. Won't happen with the code the way it is now but handle here anyway:
        if (res.data.error_msg) {
          dispatch(advMoveFail(res.data.error_msg));
        } else {
          dispatch(advMoveSuccess(res.data));
        }
      })
      .catch(err => {
        console.log(err.message);
        dispatch(advMoveFail(err.message));
      });
  };
}

const actionExports = {
  actionTypes,
  logout,
  advInit,
  handleLogin,
  handleRegister,
  advMove
};

export default actionExports;
