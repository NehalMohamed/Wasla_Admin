// s

export const checkAUTH = () => {
  const authToken = localStorage.getItem("token");
  if (authToken) {
    return true;
  } else {
    console.log("token is null Or expired");
    return false;
  }
};
