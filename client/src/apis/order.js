import axios from "axios";
import { API_URL } from "../constant.js";

// Get all orders (admin/debug)
export const getAllOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/order`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};

// Get orders for a specific user
export const getOrderByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/order/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    throw error;
  }
};


// Create a new order
export const createOrder = async ({ User_ID, Pickup_Time, Status = "Pending" }) => {
  try {
    const response = await axios.post(`${API_URL}/order`, {
      User_ID,
      Pickup_Time,
      Status,
    });
    return response.data; // includes { Order_ID }
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Update an order completely
export const updateOrder = async (orderId, orderData) => {
  /*
    orderData must include:
    {
      User_ID,
      Pickup_Time,
      Status,
      Total_Amount
    }
  */
  try {
    const response = await axios.put(`${API_URL}/order/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Update only the status of an order
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API_URL}/order/status/${orderId}`, { Status: status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const updateOrderPaymentStatus = async (orderId, status = "Paid") => {
  try {
    const response = await axios.put(`${API_URL}/order/payment/${orderId}`, {
      Payment_Status: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order payment status:", error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const getPreOrderItemByPreOrderId = async (preOrderId) => {
  try {
    const response = await axios.get(`${API_URL}/preOrderItem/${preOrderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pre-order items:", error);
    throw error;
  }
};

// Get pre-orders for a specific user
export const getPreOrderByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/preOrder/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pre-orders by user ID:", error);
    throw error;
  }
};

// Update the status of a pre-order
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


// Create a new pre-order
export const addAPreOrder = async (preOrder) => {
  /*
    preOrder must include:
    {
      userId,
      Half_Paid,
      Estimated_Total,
      Pickup_Date,
      Pickup_Time
    }
  */
  try {
    const response = await axios.post(`${API_URL}/preOrder`, {
      User_ID: preOrder.userId,
      Half_Paid: preOrder.Half_Paid,
      Estimated_Total: preOrder.Estimated_Total,
      Pickup_Date: preOrder.Pickup_Date,
      Pickup_Time: preOrder.Pickup_Time,
    });
    return response.data; // includes { Pre_Order_ID }
  } catch (error) {
    console.error("Error creating pre-order:", error);
    throw error;
  }
};


// Create a new normal order
export const addAnOrder = async (order) => {
  try {
    const response = await axios.post(`${API_URL}/order`, {
      User_ID: order.userId,
      Pickup_Time: order.Pickup_Time,
      Status: "Pending", // ✅ or null, or remove it completely
      Total_Amount: order.Total_Amount || 0,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Add item to normal order
export const addOrderItem = async (item) => {
  /*
    item must include:
    {
      Order_ID,
      Product_ID,
      Size_ID,
      Quantity
    }
  */
  try {
    const response = await axios.post(`${API_URL}/orderItem`, item);
    return response.data;
  } catch (error) {
    console.error("Error adding order item:", error);
    throw error;
  }
};

// Add item to a pre-order
export const addPreOrderItem = async (item) => {
  /*
    item must include:
    {
      Pre_Order_ID,
      Product_ID,
      Size_ID,
      Quantity
    }
  */
  try {
    const response = await axios.post(`${API_URL}/preOrderItem`, item);
    return response.data;
  } catch (error) {
    console.error("Error adding pre-order item:", error);
    throw error;
  }
};

// ✅ Fetch items in a normal order
export const getOrderItemByOrderId = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orderItem/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order items by Order_ID:", error);
    throw error;
  }
};

export const updatePreOrderPaymentStatus = async (preOrderId, status = "Paid") => {
  try {
    const response = await axios.put(`${API_URL}/preOrder/payment/${preOrderId}`, {
      Half_Paid: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating pre-order payment status:", error);
    throw error;
  }
};


