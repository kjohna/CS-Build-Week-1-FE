import axios from "../axios-instance";

export const actionTypes = {
  AUTH_STARTING: "AUTH_STARTING",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  AUTH_FAIL: "AUTH_FAIL",
  ADV_INIT_STARTING: "ADV_INIT_STARTING",
  ADV_INIT_SUCCESS: "ADV_INIT_SUCCESS",
  ADV_INIT_FAIL: "ADV_INIT_FAIL"
};

function authStarting() {
  return { type: actionTypes.AUTH_STARTING };
}

export function checkLogin() {
  return function(dispatch) {
    console.log("checkLogin!");
    dispatch(authStarting());
    const token = localStorage.getItem("advToken");
    if (token) {
      console.log(token);
      dispatch({ type: actionTypes.AUTH_SUCCESS, payload: token });
    }
  };
}

// export const login = dispatch => {
//   dispatch({ type: actionTypes.AUTH_STARTING });
// };

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
