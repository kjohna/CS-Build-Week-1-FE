import reducer from "./reducers";
import actionExports from "./actions";

const { actionTypes } = actionExports;

const createUser = ({ username = "", uuid = "" } = {}) => ({ username, uuid });

const createAuth = ({
  token = "",
  user = createUser(),
  loading = false,
  error = null
} = {}) => ({ token, user, loading, error });

const createAdv = ({ loading = false, error = null } = {}) => ({
  loading,
  error
});

export const createState = ({
  auth = createAuth(),
  adv = createAdv()
} = {}) => ({
  auth,
  adv
});

describe("test combined reducer", () => {
  it("creates clean default state with no input", () => {
    const actual = reducer();
    const expected = createState();
    expect(actual).toEqual(expected);
  });
});

describe("test auth reducer", () => {
  it("sets loading: true on AUTH_STARTING", () => {
    const action = {
      type: actionTypes.AUTH_STARTING
    };
    const actual = reducer(createState(), action);
    const expected = {
      ...createState(),
      auth: {
        ...createAuth(),
        loading: true
      }
    };
    expect(actual).toEqual(expected);
  });
  it("sets token correctly and sets loading: false on AUTH_SUCCESS", () => {
    const action = { type: actionTypes.AUTH_SUCCESS, payload: "token" };
    const actual = reducer(
      {
        ...createState(),
        auth: {
          ...createAuth(),
          loading: true
        }
      },
      action
    );
    const expected = {
      ...createState(),
      auth: {
        ...createAuth(),
        loading: false,
        token: "token"
      }
    };
    expect(actual).toEqual(expected);
  });
  it("sets error and sets loading: false on AUTH_FAIL", () => {
    const action = { type: actionTypes.AUTH_FAIL, payload: "error message" };
    const actual = reducer(
      {
        ...createState(),
        auth: {
          ...createAuth(),
          loading: true
        }
      },
      action
    );
    const expected = {
      ...createState(),
      auth: {
        ...createAuth(),
        loading: false,
        error: "error message"
      }
    };
    expect(actual).toEqual(expected);
  });
  it("resets initial AUTH state on LOGOUT", () => {
    const action = { type: actionTypes.LOGOUT };
    const actual = reducer(
      {
        ...createState(),
        auth: {
          tmp: "some auth state that needs to be cleared"
        }
      },
      action
    );
    const expected = {
      ...createState()
    };
    expect(actual).toEqual(expected);
  });
});

describe("test adv reducer", () => {
  it("resets initial ADV state on LOGOUT", () => {
    const action = { type: actionTypes.LOGOUT };
    const actual = reducer(
      {
        ...createState(),
        adv: {
          tmp: "some adv state that needs to be cleared"
        }
      },
      action
    );
    const expected = {
      ...createState()
    };
    expect(actual).toEqual(expected);
  });
});
