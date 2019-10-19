import { useState, useEffect } from "react";

// custom hook handles login form actions, manages validation and state of form
const useLoginForm = (cb, defaults) => {
  const [inputs, setInputs] = useState({ ...defaults });
  const [errors, setErrors] = useState({ ...defaults });
  const [changed, setChanged] = useState({});
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = async e => {
    if (e) {
      e.preventDefault();
    }
    console.log("handleSubmit, e preventDefaulted");
    try {
      await cb(inputs);
    } catch (err) {
      // NOTE: error handling here is specific to how BE is sending error responses.
      console.log("submit form error: ", err);
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
    // console.log("validate inputs, username: ", inputs.username);
    // username required
    if (changed.username && !inputs.username) {
      // console.log("username empty");
      errors.username = "Username empty.";
      errors.error = true;
    }
    // login + register: password not empty
    if (changed.password && !inputs.password) {
      errors.password = "Password empty.";
      errors.error = true;
    }
    // register: password1 & password2 match
    if ((changed.password || changed.password2) && !inputs.isLogin) {
      if (inputs.password !== inputs.password2) {
        errors.password2 = "Passwords do not match.";
        errors.error = true;
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

export default useLoginForm;
