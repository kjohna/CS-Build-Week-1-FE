import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reducer from "../store/reducers";
// need enzyme since we're using redux
// https://circleci.com/blog/continuously-testing-react-applications-with-jest-and-enzyme/
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
// this could go in a setup file
// https://airbnb.io/enzyme/docs/installation/index.html
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
// end setup

it("renders without crashing", () => {
  const emptyState = reducer();
  const props = {
    dispatch: jest.fn(),
    store: {
      getState: () => emptyState
    }
  };
  const wrapper = shallow(<App {...props} />);
  expect(toJson(wrapper)).toMatchSnapshot();
});
