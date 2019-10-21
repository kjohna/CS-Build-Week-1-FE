import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import actionExports from "../store/actions";

const { logout } = actionExports;

const Adv = props => {
  const { user, token } = props;
  console.log(user);
  if (!token) {
    return <Link to="/">Must Log in</Link>;
  }
  return (
    <div>
      <div>{token} ADV!!</div>
      <button onClick={() => props.logout()}>Log Out</button>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token
});

const mapDispatchToProps = { logout };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Adv);
