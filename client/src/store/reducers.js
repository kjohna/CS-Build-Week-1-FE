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
    case actionTypes.LOGOUT:
      // not much happening here for now, but maybe a good place for fancy stuff in the future? maybe caching some state?
      return { ...initialAuth };
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
    case actionTypes.LOGOUT:
      // not much happening here for now, but maybe a good place for fancy stuff in the future? maybe caching some state?
      return { ...initialAdv };
    default:
      return state;
  }
};

const combinedReducers = combineReducers({ auth, adv });
export default combinedReducers;
