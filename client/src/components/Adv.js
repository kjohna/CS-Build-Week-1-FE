import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect, useSelector } from "react-redux";

import actionExports from "../store/actions";

const { logout } = actionExports;

const Adv = props => {
  const { token } = props;
  const { name, title, description, players, exits } = useSelector(
    state => state.adv
  );
  if (!token) {
    return <Link to="/">Must Log in</Link>;
  }
  // produce movement controls
  const moveControls = exits => {
    const possibleExits = ["n", "s", "e", "w"];
    return (
      <div id="moveControls">
        {possibleExits.map(possibleExit => {
          return (
            <button
              id={`${possibleExit}MoveControl`}
              key={`${possibleExit}MoveControl`}
              disabled={!exits.includes(possibleExit)}
            >
              {possibleExit}
            </button>
          );
        })}
      </div>
    );
  };
  return (
    <div>
      <div>TOKEN: {token}</div>
      <div id="playerName">Player: {name}</div>
      <div id="roomInfo">
        Room: {title}
        <br /> Description: {description}
      </div>
      <div id="otherPlayers">Other Players {players}</div>
      {moveControls(exits)}
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
