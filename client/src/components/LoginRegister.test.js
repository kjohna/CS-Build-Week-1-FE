import React from "react";
import { createStore } from "redux";
import { Provider, useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import reducer from "../store/reducers";
import LoginRegister from "./LoginRegister";
import * as loginHelpers from "./LoginRegister";
import { MemoryRouter } from "react-router";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// jest.mock("react-redux");

configure({ adapter: new Adapter() });

describe("test LoginRegister", () => {
  const mountIt = () => {
    const emptyState = reducer();
    const reduxStore = createStore(() => emptyState);
    const mounted = mount(
      // MemoryRouter provides context for Provider
      // Invariant Violation: You should not use <Route> or withRouter() outside a <Router>
      // https://github.com/airbnb/enzyme/issues/1112
      <MemoryRouter initialEntries={["/"]}>
        <Provider store={reduxStore}>
          <Route path={"/"} render={() => <LoginRegister />} />
        </Provider>
      </MemoryRouter>
    );
    return mounted;
  };

  // *****************************
  // ----test proper rendering----
  // *****************************
  it("renders without crashing", () => {
    const mounted = mountIt();
    expect(mounted).toHaveLength(1);
  });

  it("displays proper fields for login", () => {
    const mounted = mountIt();
    const len = mounted.find("input").length;
    expect(len).toEqual(2);
  });

  it("displays proper fields for register", () => {
    const mounted = mountIt();
    // select register
    mounted.find({ name: "isLogin" }).simulate("click");
    const len = mounted.find("input").length;
    expect(len).toEqual(3);
  });

  it("displays proper buttons for login and register", () => {
    const mounted = mountIt();
    let len = mounted.find("button").length;
    expect(len).toEqual(2);
    // select register
    mounted.find({ name: "isLogin" }).simulate("click");
    len = mounted.find("button").length;
    expect(len).toEqual(2);
  });

  // ******************************
  // ----test proper validation----
  // ******************************
  it("validates username field for login and register", () => {
    const mounted = mountIt();
    // check no error after render
    let errText = mounted.find("div#usernameError").text();
    expect(errText).toBe("");

    // check no error with input
    const input = mounted.find("input#username");
    input.simulate("change", {
      persist: () => {},
      target: { name: "username", value: "anything" }
    });
    errText = mounted.find("div#usernameError").text();
    expect(errText).toBe("");

    // check error if user does not provide username
    input.simulate("change", {
      persist: () => {},
      target: { name: "username", value: "" }
    });
    errText = mounted.find("div#usernameError").text();
    expect(errText).toContain("Username empty.");
  });

  it("validates password field for login", () => {
    const mounted = mountIt();

    // check no error after render
    let errTextPWD = mounted.find("div#passwordError").text();
    expect(errTextPWD).toBe("");

    // check no error with input
    const input = mounted.find("input#password");
    input.simulate("change", {
      persist: () => {},
      target: { name: "password", value: "any pass" }
    });
    errTextPWD = mounted.find("div#passwordError").text();
    expect(errTextPWD).toBe("");

    // check error for empty input
    input.simulate("change", {
      persist: () => {},
      target: { name: "password", value: "" }
    });
    errTextPWD = mounted.find("div#passwordError").text();
    expect(errTextPWD).toBe("Password empty.");
  });

  it("validates password fields for register", () => {
    const mounted = mountIt();

    // select register
    mounted.find({ name: "isLogin" }).simulate("click");

    // check no error after render
    let errTextPWD = mounted.find("div#passwordError").text();
    let errTextPWD2 = mounted.find("div#password2Error").text();
    expect(errTextPWD).toBe("");
    expect(errTextPWD2).toBe("");

    // check error for mismatched passwords
    const inputPassword = mounted.find("input#password");
    const inputPassword2 = mounted.find("input#password2");
    inputPassword.simulate("change", {
      persist: () => {},
      target: { name: "password", value: "any pass" }
    });
    inputPassword2.simulate("change", {
      persist: () => {},
      target: { name: "password2", value: "mismatched" }
    });
    errTextPWD2 = mounted.find("div#password2Error").text();
    expect(errTextPWD2).toBe("Passwords do not match.");

    // check no error when passwords match
    inputPassword2.simulate("change", {
      persist: () => {},
      target: { name: "password2", value: "any pass" }
    });
    errTextPWD2 = mounted.find("div#password2Error").text();
    expect(errTextPWD2).toBe("");
  });

  // ******************************
  // ----test proper submitting----
  // ******************************

  it("dispatches login on login", () => {
    const spy = jest.spyOn(loginHelpers, "onLoginRegister");
    spy.mockImplementation(() => {});
    const mounted = mountIt();
    const defaultInputs = {
      username: "",
      password: "",
      password2: "",
      isLogin: true, // looking for this
      error: false
    };
    // "click" submit
    mounted.find("form").simulate("submit", { preventDefault: () => {} });

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(
      { ...defaultInputs },
      expect.any(Function),
      expect.any(Object)
    );
    spy.mockRestore();
  });

  it("dispatches register on register", () => {
    const spy = jest.spyOn(loginHelpers, "onLoginRegister");
    spy.mockImplementation(() => {});
    const mounted = mountIt();
    const defaultInputs = {
      username: "",
      password: "",
      password2: "",
      isLogin: false, // looking for this
      error: false
    };
    // select register
    mounted.find({ name: "isLogin" }).simulate("click");
    // "click" submit
    mounted.find("form").simulate("submit", { preventDefault: () => {} });

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(
      { ...defaultInputs },
      expect.any(Function),
      expect.any(Object)
    );
    spy.mockRestore();
  });
});
