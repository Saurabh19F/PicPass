export const isAuthenticated = () => {
  return !!localStorage.getItem("auth");
};

export const logout = () => {
  localStorage.removeItem("auth");
};
