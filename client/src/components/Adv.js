import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

function logout() {
  console.log("TODO create logout action!");
}

const Adv = props => {
  const { user, token } = props;
  console.log(user);
  if (!token) {
    return <Link to="/">Must Log in</Link>;
  }
  return (
    <div>
      <div>{token} ADV!!</div>
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token
});

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Adv);
