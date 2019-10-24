import React from "react";
import { createStore } from "redux";
import { Provider, useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import reducer from "../store/reducers";
import Adv from "./Adv";
import { MemoryRouter } from "react-router";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// jest.mock("react-redux");

configure({ adapter: new Adapter() });

describe("test Adv", () => {
  const wrapIt = (customStateAdv = {}) => {
    const initialAuth = {
      token: "token",
      loading: false,
      error: null
    };
    const initialAdv = {
      uuid: "1234",
      name: "testuser",
      title: "room title",
      description: "room description",
      players: ["player1", "player2"],
      exits: ["n"],
      loading: false,
      error: null,
      ...customStateAdv
    };
    const initialState = {
      auth: { ...initialAuth },
      adv: { ...initialAdv }
    };
    // console.log(initialState);
    // console.log(reducer());
    const reduxStore = createStore(() => initialState);
    const wrapped = mount(
      // MemoryRouter provides context for Provider
      // Invariant Violation: You should not use <Route> or withRouter() outside a <Router>
      // https://github.com/airbnb/enzyme/issues/1112
      <MemoryRouter initialEntries={["/adv"]}>
        <Provider store={reduxStore}>
          <Route path={"/adv"} render={() => <Adv />} />
        </Provider>
      </MemoryRouter>
    );
    return wrapped;
  };

  // *****************************
  // ----test proper rendering----
  // *****************************
  it("renders without crashing", () => {
    const wrapped = wrapIt();
    expect(wrapped).toHaveLength(1);
  });

  it("displays user's name", () => {
    const wrapped = wrapIt();
    expect(wrapped.html()).toContain("testuser");
  });

  it("displays current room name and description", () => {
    const wrapped = wrapIt();
    expect(wrapped.html()).toContain("room title");
    expect(wrapped.html()).toContain("room description");
  });

  it("displays other players in the room", () => {
    const wrapped = wrapIt();
    expect(wrapped.html()).toContain("player1");
    expect(wrapped.html()).toContain("player2");
  });

  it("displays movement controls, disabled if direction not available", () => {
    const wrapped = wrapIt({ exits: ["n", "e"] });
    console.log(wrapped.html());
    const moveControls = wrapped.find("div#moveControls");
    expect(moveControls.find("button#nMoveControl").prop("disabled")).toBe(
      false
    );
    expect(moveControls.find("button#sMoveControl").prop("disabled")).toBe(
      true
    );
    expect(moveControls.find("button#eMoveControl").prop("disabled")).toBe(
      false
    );
    expect(moveControls.find("button#wMoveControl").prop("disabled")).toBe(
      true
    );
  });
  // dispatches movement action correctly when valid move is selected
});
