import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import axios from "./axios-instance";

import { useAuthContext } from "./AuthProvider";

const FormError = styled.div`
  color: red;
`;

const LoginRegister = props => {
  // grab login handler from Auth Provider
  const { login } = useAuthContext();

  // custom hook handles login form actions
  const useLoginForm = (cb, defaults) => {
    const [inputs, setInputs] = useState({ ...defaults });
    const [errors, setErrors] = useState({ ...defaults });
    const [changed, setChanged] = useState({});
    const [disabled, setDisabled] = useState(true);

    const handleSubmit = async e => {
      if (e) {
        e.preventDefault();
      }
      try {
        const res = await cb(inputs);
        // careful what you do with res... cb might not return anything?
      } catch (err) {
        // NOTE: error handling here is specific to how BE is sending error responses.
        // console.log("submit form error: ", err);
        // if the error was due to a bad password choice
        if (err.response.data.password1) {
          setErrors({ error: true, submitError: err.response.data.password1 });
        } else if (err.response.data.username) {
          setErrors({ error: true, submitError: err.response.data.username });
        } else if (err.response.data.non_field_errors) {
          // else other error will be in:
          // console.log("submit form error: ", err.response.data);
          setErrors({
            error: true,
            submitError: err.response.data.non_field_errors
          });
        } else {
          // should be a pretty general case
          setErrors({
            error: true,
            submitError: err.message
          });
        }
        setDisabled(true);
      }
    };

    // whenever inputs change disable submit and update errors
    useEffect(() => {
      let errors = { error: false };
      // validate inputs
      // username required
      if (changed.username && !inputs.username) {
        errors.username = "Username empty.";
        errors.error = true;
        setChanged(changed => ({ ...changed, [changed.username]: false }));
      }
      // login + register: password not empty
      if (changed.password && !inputs.password) {
        errors.password = "Password empty.";
        errors.error = true;
        setChanged(changed => ({ ...changed, [changed.password]: false }));
      }
      // register: password1 & password2 match
      if (changed.password2 && !inputs.isLogin) {
        if (inputs.password !== inputs.password2) {
          errors.password2 = "Passwords do not match.";
          errors.error = true;
          setChanged(changed => ({
            ...changed,
            [changed.password]: false,
            [changed.password2]: false
          }));
        }
      }
      // first time disable form
      if (!inputs.username || !inputs.password) {
        setDisabled(true);
      } else {
        setDisabled(errors.error);
      }
      // disable form if errors
      setErrors(errors);
    }, [inputs, changed]);

    const handleInput = e => {
      e.persist();
      setChanged(changed => ({ ...changed, [e.target.name]: true }));
      setInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    };
    return { handleSubmit, handleInput, inputs, disabled, errors };
  };

  const onLoginRegister = async inputs => {
    // handle login/register form submit
    if (inputs.isLogin) {
      try {
        const res = await axios.post("login/", inputs);
        // console.log(res.data);
        // localStorage.setItem("advToken", res.data.key);
        login(res.data);
        props.history.push("/adv");
      } catch (err) {
        console.log("caught onLoginRegister", err.message);
        // re-throw error so that useLoginForm will catch and handle
        throw err;
      }
    } else {
      // "/register" is expecting "password1" instead of "password"
      const fmtInputs = { ...inputs, password1: inputs.password };
      try {
        const res = await axios.post("registration/", fmtInputs);
        // console.log(res.data);
        login(res.data);
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
      </form>
    </div>
  );
};

export default withRouter(LoginRegister);
