import React from "react";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import axios from "../axios-instance";

import useLoginForm from "../hooks/useLoginForm";

import { handleLogin } from "../store/actions";

const FormError = styled.div`
  color: red;
`;

const LoginRegister = props => {
  // grab dispatch, onLoginRegister will dispatch appropriate action
  const dispatch = useDispatch();
  // const authLoading = useSelector(state => state.auth.loading);
  // const authError = useSelector(state => state.auth.error);
  // const authErrorMsg = {
  //   "Request failed with status code 400":
  //     "Unknown Username/Password combination."
  // };
  // handle form submit:
  const onLoginRegister = async inputs => {
    // handle login/register form submit
    if (inputs.isLogin) {
      try {
        // console.log("onLoginRegister");
        await dispatch(handleLogin(inputs));
        // console.log("done, res: ", res);
        props.history.push("/adv");
      } catch (err) {
        console.log("caught onLoginRegister - component", err.message);
        // re-throw error so that useLoginForm will catch and handle
        throw err;
      }
    } else {
      // "/register" is expecting "password1" instead of "password"
      const fmtInputs = { ...inputs, password1: inputs.password };
      try {
        const res = await axios.post("registration/", fmtInputs);
        // console.log(res.data);
        handleLogin(res.data);
        props.history.push("/adv");
      } catch (err) {
        console.log("caught onLoginRegister", err.message);
        // re-throw error so that useLoginForm will catch and handle
        throw err;
      }
    }
  };

  const { inputs, errors, disabled, handleInput, handleSubmit } = useLoginForm(
    onLoginRegister,
    {
      username: "",
      password: "",
      password2: "",
      isLogin: true,
      error: false
    }
  );

  return (
    <div>
      <button
        name="isLogin"
        value={inputs.isLogin}
        onClick={e => {
          // e.preventDefault();  // need this if this button moves inside the form..
          handleInput({
            target: { name: "isLogin", value: !inputs.isLogin },
            persist: () => {}
          });
        }}
      >
        {inputs.isLogin ? "New? Register!" : "have acct? Login!"}
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            name="username"
            onChange={handleInput}
            value={inputs.username}
          />
          <FormError>{errors.username}</FormError>
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            onChange={handleInput}
            value={inputs.password}
          />
          <FormError>{errors.password}</FormError>
        </div>
        {!inputs.isLogin && (
          <div>
            <label>Confirm Password: </label>
            <input
              type="password"
              name="password2"
              onChange={handleInput}
              value={inputs.password2}
            />
            <FormError>{errors.password2}</FormError>
          </div>
        )}
        <button disabled={disabled} type="submit">
          {inputs.isLogin ? "Log in" : "Register"}
        </button>
        <FormError>{errors.submitError}</FormError>
        {/* <FormError>{authError && authErrorMsg[authError]}</FormError> */}
      </form>
    </div>
  );
};

export default withRouter(LoginRegister);
