import axios from "axios";
import { API_URL } from "../constant.js";

export const getCart = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

// For customers - gets only active cart
export const getCartById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/cart/${id}`);
    const cart = response.data.find((item) => item.IS_ACTIVE === 1);
    if (!cart) {
      console.error("No active cart found for the given ID:", id);
      return null;
    }
    return cart;
  } catch (error) {
    console.error("Error fetching cart by ID:", error);
    throw error;
  }
};

// For admin - gets all carts for a user
export const getAllCartsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart/${userId}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error fetching all carts for user:", error);
    throw error;
  }
};

export const addACart = async (cart) => {
  try {
    const response = await axios.post(`${API_URL}/cart`, cart);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const disableCart = async (cartId) => {
  try {
    const response = await axios.put(`${API_URL}/cart/cartDisable/${cartId}`, {
      IS_ACTIVE: 0,
    });
    return response.data;
  } catch (error) {
    console.error("Error disabling cart:", error);
    throw error;
  }
};

export const getCartItemById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/cartItem/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const addToCartItem = async (cartItem) => {
  try {
    const response = await axios.post(`${API_URL}/cartItem`, cartItem);
    return response.data;
  } catch (error) {
    console.error("Error adding to cart item:", error);
    throw error;
  }
};
