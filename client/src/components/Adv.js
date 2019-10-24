import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import styled from "styled-components";

import actionExports from "../store/actions";

const { logout, advMove } = actionExports;

const AdvError = styled.div`
  color: red;
`;

export const Adv = props => {
  const { token } = props;
  const { name, title, description, players, exits, error } = useSelector(
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
          const active = exits.includes(possibleExit);
          return (
            <button
              id={`${possibleExit}MoveControl`}
              key={`${possibleExit}MoveControl`}
              onClick={active ? () => props.advMove(possibleExit) : undefined}
              disabled={!active}
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
      <AdvError id="advError">{error}</AdvError>
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

const mapDispatchToProps = { logout, advMove };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Adv)
);
