import axios from "axios";
import { API_URL } from "../constant.js";

export const getOrder = async () => {
  try {
    const response = await axios.get(`${API_URL}/order`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrderByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/order/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    throw error;
  }
};

export const addAnOrder = async (order) => {
  try {
    const response = await axios.post(`${API_URL}/order`, order);
    return response.data;
  } catch (error) {
    console.error("Error adding an order:", error);
    throw error;
  }
};

export const addOrderItem = async (orderItem) => {
  try {
    const response = await axios.post(`${API_URL}/orderItem`, orderItem);
    return response.data;
  } catch (error) {
    console.error("Error adding an order item:", error);
    throw error;
  }
};

export const getOrderItemByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orderItem/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order items by order ID:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/order/status/${orderId}`, {
      Status: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};




export const getPreOrder = async () => {
  try {
    const response = await axios.get(`${API_URL}/preOrder`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pre-orders:", error);
    throw error;
  }
};

export const getPreOrderByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/preOrder/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pre-orders by user ID:", error);
    throw error;
  }
};

export const addAPreOrder = async (preOrder) => {
  try {
    const response = await axios.post(`${API_URL}/preOrder`, preOrder);
    return response.data;
  } catch (error) {
    console.error("Error adding a pre-order:", error);
    throw error;
  }
};

export const addPreOrderItem = async (preOrderItem) => {
  try {
    const response = await axios.post(`${API_URL}/preOrderItem`, preOrderItem);
    return response.data;
  } catch (error) {
    console.error("Error adding a pre-order item:", error);
    throw error;
  }
};

export const getPreOrderItemByPreOrderId = async (preOrderId) => {
  try {
    const response = await axios.get(`${API_URL}/preOrderItem/${preOrderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pre-order items by pre-order ID:", error);
    throw error;
  }
};

export const updatePreOrderStatus = async (preOrderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/preOrder/status/${preOrderId}`, {
      Status: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating pre-order status:", error);
    throw error;
  }
};

export const updateEstiPrice = async (preOrderId, price) => {
  try {
    const response = await axios.put(`${API_URL}/preOrder/estiPrice/${preOrderId}`, {
      Estimated_Total: price,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating estimated price:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};