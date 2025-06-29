export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
