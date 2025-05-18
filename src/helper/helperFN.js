
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (err) {
    return true;
  }
};

export const checkAUTH = () => {
  const authToken = localStorage.getItem("token");
  if (authToken && !isTokenExpired(authToken)) {
    return true;
  } else {
    console.log("token is null Or expired");
    return false;
  }
};

