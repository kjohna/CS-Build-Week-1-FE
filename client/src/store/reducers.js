import { combineReducers } from "redux";
import { actionTypes } from "./actions";

// initial auth state
const initialAuth = {
  token: "",
  user: { username: "", uuid: "" },
  loading: false,
  error: null
};

// auth reducer
const auth = (state = initialAuth, action = {}) => {
  switch (action.type) {
    case actionTypes.AUTH_STARTING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.payload,
        error: null
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

// initial adv state
const initialAdv = {
  loading: false,
  error: null
};

// adv reducer
const adv = (state = initialAdv, action = {}) => {
  switch (action.type) {
    default:
      return state;
  }
};

const initialState = {
  initialAuth,
  initialAdv
};

const combinedReducers = combineReducers({ auth, adv });
export default combinedReducers;
