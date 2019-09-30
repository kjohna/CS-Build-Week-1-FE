import React from "react";
import { useAuthContext } from "./AuthProvider";
import { Link } from "react-router-dom";

const Adv = () => {
  const { user, logout } = useAuthContext();
  // console.log(user);
  if (!user.token) {
    return <Link to="/">Must Log in</Link>;
  }
  return (
    <div>
      <div>{user.token} ADV!!</div>
      <button onClick={() => logout()}>Log Out</button>
    </div>
  );
};

export default Adv;
