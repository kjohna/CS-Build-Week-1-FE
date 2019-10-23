import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect, useSelector } from "react-redux";

import actionExports from "../store/actions";

const { logout } = actionExports;

const Adv = props => {
  const { user, token } = props;
  // uuid: "1234",
  // name: "testuser",
  // title: "room title",
  // description: "room description",
  // players: ["player1", "player2"],
  // loading: false,
  // error: null
  const { name, title, description, players } = useSelector(state => state.adv);
  console.log(user);
  if (!token) {
    return <Link to="/">Must Log in</Link>;
  }
  return (
    <div>
      <div>TOKEN: {token}</div>
      <div id="playerName">Player: {name}</div>
      <div id="roomInfo">
        Room: {title}
        <br /> Description: {description}
      </div>
      <div id="otherPlayers">Other Players {players}</div>
      <button onClick={() => props.logout()}>Log Out</button>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.auth.token
});

const mapDispatchToProps = { logout };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Adv)
);
