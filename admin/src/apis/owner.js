import axios from "axios";
import { API_URL } from "../constant.js";

export const getTotalSales = async () => {
  try {
    const response = await axios.get(`${API_URL}/owner/totalSales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching total sales:", error);
    throw error;
  }
};

export const getTotalOrderSales = async () => {
  try {
    const response = await axios.get(`${API_URL}/owner/orderSales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching total order sales:", error);
    throw error;
  }
};

export const getTotalPreOrderSales = async () => {
  try {
    const response = await axios.get(`${API_URL}/owner/preOrderSales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching total pre-order sales:", error);
    throw error;
  }
};

export const ownerLogin = async (owner) => {
  try {
    const response = await axios.post(`${API_URL}/owner/login`, owner);
    return response.data;
  } catch (error) {
    console.error("Error fetching owner data:", error);
    throw error;
  }
};
