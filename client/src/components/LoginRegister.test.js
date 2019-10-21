import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { Route } from "react-router-dom";
import reducer from "../store/reducers";
import LoginRegister from "./LoginRegister";
import { MemoryRouter } from "react-router";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { mount, shallow } from "enzyme";

configure({ adapter: new Adapter() });

describe("test LoginRegister", () => {
  const mountIt = () => {
    const emptyState = reducer();
    const reduxStore = createStore(() => emptyState);
    const mounted = mount(
      <MemoryRouter initialEntries={["/"]}>
        <Provider store={reduxStore}>
          <Route path={"/"} render={() => <LoginRegister />} />
        </Provider>
      </MemoryRouter>
    );
    return mounted;
  };

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

  // it('check entire form validation when the form is valid', () => {
  //   let formSpy = spy();
  //   const form = mount(<Form isFormValid={formSpy} />);
  //   form.find('.name').simulate('change', { target: { value: 'sasrank' } });
  //   form.find('.email').simulate('change', { target: { value: 'aasdbc@xyz.com' } });
  //   form.find('.phone').simulate('change', { target: { value: '9856756756' } });
  //   form.find('.url').simulate('change', { target: { value: 'http://google.com' } });
  //   form.find('.button').simulate('click');
  //   expect(formSpy.calledWith(true)).toEqual(true);
  // });

  // it('check entire form validation when the phone number is invalid', () => {
  //   let formSpy = spy();
  //   const form = mount(<Form isFormValid={formSpy} />);
  //   form.find('.name').simulate('change', { target: { value: 'ui' } });
  //   form.find('.email').simulate('change', { target: { value: 'abc@xyz.com' } });
  //   form.find('.phone').simulate('change', { target: { value: '56756756' } });
  //   form.find('.url').simulate('change', { target: { value: 'http://google.com' } });
  //   form.find('.button').simulate('click');
  //   expect(formSpy.calledWith(true)).toEqual(false);
  // });

  // it('check entire form validation when the email is invalid', () => {
  //   let formSpy = spy();
  //   const form = mount(<Form isFormValid={formSpy} />);
  //   form.find('.name').simulate('change', { target: { value: 'ui' } });
  //   form.find('.email').simulate('change', { target: { value: 'abc@xyz.' } });
  //   form.find('.phone').simulate('change', { target: { value: '56756756' } });
  //   form.find('.url').simulate('change', { target: { value: 'http://google.com' } });
  //   form.find('.button').simulate('click');
  //   expect(formSpy.calledWith(true)).toEqual(false);
  // });

  // it('check entire form validation when the url is invalid', () => {
  //   let formSpy = spy();
  //   const form = mount(<Form isFormValid={formSpy} />);
  //   form.find('.name').simulate('change', { target: { value: 'ui' } });
  //   form.find('.email').simulate('change', { target: { value: 'abc@xyz.com' } });
  //   form.find('.phone').simulate('change', { target: { value: '56756756' } });
  //   form.find('.url').simulate('change', { target: { value: 'ht' } });
  //   form.find('.button').simulate('click');
  //   expect(formSpy.calledWith(true)).toEqual(false);
  // });

  // it('check form validation when the entire form is invalid', () => {
  //   let formSpy = spy();
  //   const form = mount(<Form isFormValid={formSpy} />);
  //   form.find('.name').simulate('change', { target: { value: '' } });
  //   form.find('.email').simulate('change', { target: { value: '33' } });
  //   form.find('.phone').simulate('change', { target: { value: '567567560' } });
  //   form.find('.url').simulate('change', { target: { value: 'h9' } });
  //   form.find('.button').simulate('click');
  //   expect(formSpy.calledWith(true)).toEqual(false);
  // });
});
