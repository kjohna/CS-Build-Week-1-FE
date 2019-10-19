import axios from "../axios-instance";

export const actionTypes = {
  AUTH_STARTING: "AUTH_STARTING",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  AUTH_FAIL: "AUTH_FAIL",
  ADV_INIT_STARTING: "ADV_INIT_STARTING",
  ADV_INIT_SUCCESS: "ADV_INIT_SUCCESS",
  ADV_INIT_FAIL: "ADV_INIT_FAIL",
  LOGOUT: "LOGOUT"
};

// actions
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

export function logout() {
  localStorage.removeItem("advToken");
  return { type: actionTypes.LOGOUT };
}

// action creators
export function checkLogin(location, history) {
  return function(dispatch) {
    const token = localStorage.getItem("advToken");
    dispatch(authStarting());
    if (token) {
      // Protected routes automatically render a redirect to "/"
      // need to undo this if we find a token
      console.log("checkLogin success, dispatch authSuccess");
      dispatch(authSuccess(token));
      history.push(location);
    } else {
      dispatch(authFail("No active session."));
    }
  };
}

export function handleLogin(userInput) {
  return dispatch => {
    dispatch(authStarting());
    console.log("auth starting, usr:", userInput);
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

// export const advInit = dispatch => {
//   dispatch({ type: actionTypes.ADV_INIT_STARTING });
//   axios
//     .get("adv/init/")
//     .then(res => {
//       console.log(res.data);
//     })
//     .catch(err => console.log(err.message));
//   setUser(user => ({ ...user, token }));
// };
