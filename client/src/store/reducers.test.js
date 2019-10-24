import reducer from "./reducers";
import actionExports from "./actions";

const { actionTypes } = actionExports;

const createAuth = ({ token = "", loading = false, error = null } = {}) => ({
  token,
  loading,
  error
});

const createAdv = ({
  uuid = "",
  name = "",
  title = "",
  description = "",
  players = [],
  exits = [],
  loading = false,
  error = null
} = {}) => ({
  uuid,
  name,
  title,
  description,
  players,
  exits,
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
// ***************************
// -------auth reducer -------
// ***************************

describe("test auth reducer", () => {
  it("sets loading: true on AUTH_STARTING, reset error", () => {
    const action = {
      type: actionTypes.AUTH_STARTING
    };
    const actual = reducer(
      {
        ...createState(),
        auth: { ...createAuth(), loading: false, error: "prev error" }
      },
      action
    );
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
// ***************************
// -------adv reducer -------
// ***************************
describe("test adv reducer", () => {
  it("sets loading: true on ADV_INIT_STARTING, resets error", () => {
    const action = {
      type: actionTypes.ADV_INIT_STARTING
    };
    const actual = reducer(
      {
        ...createState(),
        adv: { ...createAdv(), loading: false, error: "prev error" }
      },
      action
    );
    const expected = {
      ...createState(),
      adv: {
        ...createAdv(),
        loading: true
      }
    };
    expect(actual).toEqual(expected);
  });
  it("sets adv data correctly and sets loading: false on ADV_INIT_SUCCESS", () => {
    const action = {
      type: actionTypes.ADV_INIT_SUCCESS,
      payload: {
        uuid: "uuid",
        name: "user's name",
        title: "room title",
        description: "description",
        players: [],
        exits: ["n", "s"],
        loading: true
      }
    };
    const actual = reducer(createState(), action);
    const expected = {
      ...createState(),
      adv: {
        uuid: "uuid",
        name: "user's name",
        title: "room title",
        description: "description",
        players: [],
        exits: ["n", "s"],
        loading: false,
        error: null
      }
    };
    expect(actual).toEqual(expected);
  });
  it("sets error and sets loading: false on ADV_INIT_FAIL", () => {
    const action = {
      type: actionTypes.ADV_INIT_FAIL,
      payload: "error message"
    };
    const actual = reducer(
      { ...createState(), adv: { ...createAdv(), loading: true } },
      action
    );
    const expected = {
      ...createState(),
      adv: {
        ...createAdv(),
        loading: false,
        error: "error message"
      }
    };
    expect(actual).toEqual(expected);
  });
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
  // {"name": "testuser", "title": "Foyer", "description": "Dim light filters in from the south. Dusty\npassages run north and east.", "players": [], "error_msg": ""}
  it("sets loading, clears error on ADV_MOVE_STARTING", () => {
    const action = {
      type: actionTypes.ADV_MOVE_STARTING
    };
    const actual = reducer(
      {
        ...createState(),
        adv: { ...createAdv(), loading: false, error: "prev error" }
      },
      action
    );
    const expected = {
      ...createState(),
      adv: {
        ...createAdv(),
        loading: true
      }
    };
    expect(actual).toEqual(expected);
  });
  it("sets loading false, updates adv state on ADV_MOVE_SUCCESS", () => {
    const action = {
      type: actionTypes.ADV_MOVE_SUCCESS,
      payload: {
        uuid: "1234",
        name: "user name",
        title: "room title",
        players: ["other player"],
        description: "new room description",
        exits: ["s"]
      }
    };
    const actual = reducer(createState(), action);
    const expected = {
      ...createState(),
      adv: {
        uuid: "1234",
        name: "user name",
        title: "room title",
        players: ["other player"],
        exits: ["s"],
        description: "new room description",
        loading: false,
        error: null
      }
    };
    expect(actual).toEqual(expected);
  });
  it("sets error and sets loading: false for unsuccessful move", () => {
    const action = {
      type: actionTypes.ADV_MOVE_FAIL,
      payload: "error message"
    };
    const actual = reducer(
      { ...createState(), adv: { ...createAdv(), loading: true } },
      action
    );
    const expected = {
      ...createState(),
      adv: {
        ...createAdv(),
        loading: false,
        error: "error message"
      }
    };
    expect(actual).toEqual(expected);
  });
});
