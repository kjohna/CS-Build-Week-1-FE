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
    const [changed, setChanged] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const handleSubmit = e => {
      if (e) {
        e.preventDefault();
      }
      cb(inputs);
    };

    // whenever inputs change disable submit and update errors
    useEffect(() => {
      if (changed) {
        let errors = { error: false };
        // validate inputs
        // username required
        if (!inputs.username) {
          errors.username = "Username empty.";
          errors.error = true;
        }
        // login + register: password not empty
        if (!inputs.password) {
          errors.password = "Password empty.";
          errors.error = true;
        }
        // register: password1 & password2 match
        if (!inputs.isLogin) {
          if (inputs.password !== inputs.password2) {
            errors.password2 = "Passwords do not match.";
            errors.error = true;
          }
        }
        // disable form if errors
        setDisabled(errors.error);
        setErrors(errors);
      }
    }, [inputs]);

    const handleInput = e => {
      e.persist();
      setChanged(true);
      setInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    };
    return { handleSubmit, handleInput, inputs, disabled, errors };
  };

  const onLoginRegister = inputs => {
    // TODO disabling form should make this unnecessary:
    if (inputs.error) {
      console.log("form invalid: ", inputs.error);
      // decide to display errors at this point?
      return null;
    }
    if (inputs.isLogin) {
      axios
        .post("login/", inputs)
        .then(res => {
          console.log(res.data);
          // localStorage.setItem("advToken", res.data.key);
          login(res.data);
          props.history.push("/adv");
        })
        .catch(err => console.log(err.message));
    } else {
      // /register is expecting "password1" instead of "password"
      const fmtInputs = { ...inputs, password1: inputs.password };
      axios
        .post("registration/", fmtInputs)
        .then(res => {
          console.log(res.data);
          login(res.data);
          props.history.push("/adv");
        })
        .catch(err => console.log(err.message));
    }
    return null;
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
  console.log("form disabled: ", disabled);
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
      </form>
    </div>
  );
};

export default withRouter(LoginRegister);
