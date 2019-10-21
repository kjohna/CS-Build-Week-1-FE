import React from "react";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import useLoginForm from "../hooks/useLoginForm";

import actionExports from "../store/actions";

const { handleLogin, handleRegister } = actionExports;

const FormError = styled.div`
  color: red;
`;

const LoginRegister = props => {
  // grab dispatch, onLoginRegister will dispatch appropriate action
  const dispatch = useDispatch();
  const authLoading = useSelector(state => state.auth.loading);
  authLoading && console.log("authLoading: ", authLoading);

  // handle form submit:
  const onLoginRegister = async inputs => {
    // handle login/register form submit
    if (inputs.isLogin) {
      try {
        // console.log("onLoginRegister");
        await dispatch(handleLogin(inputs));
        console.log("handleLogin done");
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
        await dispatch(handleRegister(fmtInputs));
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
    <form onSubmit={handleSubmit}>
      <button
        name="isLogin"
        value={inputs.isLogin}
        onClick={e => {
          e.preventDefault(); // need this if this button moves inside the form..
          handleInput({
            target: { name: "isLogin", value: !inputs.isLogin },
            persist: () => {}
          });
        }}
      >
        {inputs.isLogin ? "New? Register!" : "have acct? Login!"}
      </button>
      <div>
        <label>Username: </label>
        <input
          id="username"
          type="text"
          name="username"
          onChange={handleInput}
          value={inputs.username}
        />
        <FormError id="usernameError">{errors.username}</FormError>
      </div>
      <div>
        <label>Password: </label>
        <input
          id="password"
          type="password"
          name="password"
          onChange={handleInput}
          value={inputs.password}
        />
        <FormError id="passwordError">{errors.password}</FormError>
      </div>
      {!inputs.isLogin && (
        <div>
          <label>Confirm Password: </label>
          <input
            id="password2"
            type="password"
            name="password2"
            onChange={handleInput}
            value={inputs.password2}
          />
          <FormError id="password2Error">{errors.password2}</FormError>
        </div>
      )}
      <button disabled={disabled || authLoading} type="submit">
        {inputs.isLogin ? "Log in" : "Register"}
      </button>
      <FormError>{errors.submitError}</FormError>
      {/* <FormError>{authError && authErrorMsg[authError]}</FormError> */}
    </form>
  );
};

export default withRouter(LoginRegister);
