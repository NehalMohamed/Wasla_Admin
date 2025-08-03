// src/components/PrivateRoute.js
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const [user, seUser] = useState({});
  const [Auth, setAuth] = useState(true);
  const [Allow, setAllow] = useState(true);
  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      const user = JSON.parse(userLocal);
      if (user) {
        // seUser(user);
        setAuth(true);
        if (allowedRoles.includes(user.role)) {
          setAllow(true);
        } else {
          setAllow(false);
        }
      } else {
        setAuth(false);
        setAllow(false);
      }
    }

    return () => {};
  }, []);
  if (!Auth) return <Navigate to="/login" />;
  if (!Allow) return <Navigate to="/unauthorized" />;
  return <Outlet />;
};

export default PrivateRoute;
