import axios from "axios";
import { API_URL } from "../constant.js";

// Fetch all carts (optional usage)
export const getCart = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart`);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching all carts:", error?.response?.data || error.message);
    throw error;
  }
};

// Fetch carts by user ID
export const getCartById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart/${userId}`);

    // Normalize response
    if (!response.data) return [];

    const carts = Array.isArray(response.data) ? response.data : [response.data];
    return carts;
  } catch (error) {
    console.error(`Error fetching cart for user ID ${userId}:`, error?.response?.data || error.message);
    throw error;
  }
};

// Create a new cart
export const addACart = async (cart) => {
  try {
    if (!cart || !cart.User_ID) {
      throw new Error("Invalid cart payload: Missing User_ID.");
    }

    const response = await axios.post(`${API_URL}/cart`, cart);
    return response.data;
  } catch (error) {
    console.error("Error creating new cart:", error?.response?.data || error.message);
    throw error;
  }
};

// Disable a cart by ID
export const disableCart = async (cartId) => {
  try {
    if (!cartId) {
      throw new Error("Cart ID is required to disable a cart.");
    }

    const response = await axios.put(`${API_URL}/cart/cartDisable/${cartId}`, {
      IS_ACTIVE: 0,
    });

    return response.data;
  } catch (error) {
    console.error(`Error disabling cart with ID ${cartId}:`, error?.response?.data || error.message);
    throw error;
  }
};

// Get items in a cart
export const getCartItemById = async (cartId) => {
  try {
    if (!cartId) {
      throw new Error("Cart ID is required to fetch cart items.");
    }

    const response = await axios.get(`${API_URL}/cartItem/${cartId}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching cart items for cart ID ${cartId}:`, error?.response?.data || error.message);
    throw error;
  }
};

// Add an item to the cart
export const addToCartItem = async (cartItem) => {
  try {
    if (!cartItem || !cartItem.Cart_ID || !cartItem.Product_ID) {
      throw new Error("Invalid cart item payload.");
    }

    const response = await axios.post(`${API_URL}/cartItem`, cartItem);
    return response.data;
  } catch (error) {
    console.error("Error adding item to cart:", error?.response?.data || error.message);
    throw error;
  }
};

export const deleteCartItem = async (cartItemId) => {
  try {
    const response = await axios.delete(`${API_URL}/cartItem/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting cart item ${cartItemId}:`, error);
    throw error;
  }
};
