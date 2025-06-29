import axios from "axios";
import { API_URL } from "../constant.js";
import { getAuthHeaders } from "./utils";

// User Login
export const userLogin = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, user); // expects { Email, Password }
    return response.data; // contains { user, token }
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// User Registration
export const userRegister = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, user); // expects { First_Name, Last_Name, Email, Password, Phone_Number }
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Get current logged-in user's profile
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/me`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

// Admin - get all users (optional)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const updateUser = async (updatedUserData) => {
  try {
    const response = await axios.put(`${API_URL}/user/me`, updatedUserData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
