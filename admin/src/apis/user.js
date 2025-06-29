import axios from "axios";
import { API_URL } from "../constant.js";

export const userLogin = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, user);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
