const isLogin = () => {
  if (localStorage.getItem("Authorization")) {
    return true;
  } else {
    return false;
  }
};

export default isLogin;
