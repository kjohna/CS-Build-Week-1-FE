import { combineReducers } from "redux";
import actionExports from "./actions";

const { actionTypes } = actionExports;
// initial auth state
const initialAuth = {
  token: "",
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
  uuid: "",
  name: "",
  title: "",
  description: "",
  players: [],
  exits: [],
  loading: false,
  error: null
};

// adv reducer
const adv = (state = initialAdv, action = {}) => {
  switch (action.type) {
    case actionTypes.ADV_INIT_STARTING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case actionTypes.ADV_INIT_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      };
    case actionTypes.ADV_INIT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case actionTypes.LOGOUT:
      // not much happening here for now, but maybe a good place for fancy stuff in the future? maybe caching some state?
      return { ...initialAdv };
    case actionTypes.ADV_MOVE_STARTING:
      return {
        ...state,
        loading: true,
        error: null
      };
    case actionTypes.ADV_MOVE_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      };
    case actionTypes.ADV_MOVE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

const combinedReducers = combineReducers({ auth, adv });
export default combinedReducers;
