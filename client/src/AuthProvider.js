import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect
} from "react";

// trying https://medium.com/trabe/how-we-handle-react-context-e43d303a27a2
// and https://medium.com/trabe/implementing-private-routes-with-react-router-and-hooks-ed38d0cf93d5

export const AuthContext = createContext(null);

const initialAuth = {};

const AuthProvider = props => {
  const [user, setUser] = useState(initialAuth);
  // auth data stored as token in localStorage
  // check if it's there first render
  useEffect(() => {
    const token = localStorage.getItem("advToken");
    if (token) {
      setUser(user => ({ ...user, token }));
      // TODO: api call to init, set other user info
    }
  }, []);

  const login = user => {
    localStorage.setItem("advToken", user.key);
    setUser({ token: user.key });
  };

  const logout = () => {
    localStorage.removeItem("advToken");
    setUser(initialAuth);
  };

  const auth = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={auth} {...props} />;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthProvider;

// const initialAuthData = {};

// const AuthProvider = props => {
//   const [authData, setAuthData] = useState(initialAuthData);
//   console.log(authData);

//   // storing auth data as token in localStorage
//   useEffect(() => {
//     const token = "123"; //localStorage.getItem("advToken");
//     console.log(authData);
//     if (token) {
//       setAuthData(token);
//       // TODO: call init, set other user info
//     }
//   });

//   const onLogin = newAuthData => setAuthData(newAuthData);
//   const onLogout = () => setAuthData(initialAuthData);
//   const authDataValue = useMemo({ ...authData, onLogin, onLogout }, [authData]);

//   return <AuthContext.Provider value={authDataValue} {...props} />;
// };

// export const useAuthContext = () => useContext(AuthContext);

// export default AuthProvider;
