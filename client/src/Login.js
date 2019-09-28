import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "./axios-instance";

import { useAuthContext } from "./AuthProvider";

const Login = props => {
  // grab login
  const { login } = useAuthContext();

  const useLoginForm = cb => {
    // custom hook handles login form actions
    const [inputs, setInputs] = useState({ username: "", password: "" });

    const handleSubmit = e => {
      if (e) {
        e.preventDefault();
      }
      cb(inputs);
    };

    const handleInput = e => {
      e.persist();
      setInputs(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
    };
    return { handleSubmit, handleInput, inputs };
  };

  const onLogin = inputs => {
    axios
      .post("login/", inputs)
      .then(res => {
        console.log(res.data);
        // localStorage.setItem("advToken", res.data.key);
        login(res.data);
        props.history.push("/adv");
      })
      .catch(err => console.log(err.message));
    return null;
  };

  const { inputs, handleInput, handleSubmit } = useLoginForm(onLogin);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username: </label>
        <input
          type="text"
          name="username"
          onChange={handleInput}
          value={inputs.username}
        />
      </div>
      <div>
        <label>Password: </label>
        <input
          type="password"
          name="password"
          onChange={handleInput}
          value={inputs.password}
        />
      </div>
      <button type="submit">Log in</button>
    </form>
  );
};

export default withRouter(Login);
