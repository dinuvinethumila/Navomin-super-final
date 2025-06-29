import axios from "axios";
import { API_URL } from "../constant.js";

// ✅ Get all products
export const getProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/product`);
    return res.data;
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
};

// ✅ Get single product by ID
export const getProductById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/product/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    throw err;
  }
};

// ✅ Get all product sizes
export const getProductSize = async () => {
  try {
    const res = await axios.get(`${API_URL}/productSize`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product sizes:", err);
    throw err;
  }
};

// ✅ Get sizes by product ID
export const getProductSizeById = async (productId) => {
  try {
    const res = await axios.get(`${API_URL}/productSize/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product size by Product ID:", err);
    throw err;
  }
};

// ✅ Get size by Size_ID
export const getProductSizeBySizeId = async (sizeId) => {
  try {
    const res = await axios.get(`${API_URL}/productSize/size/${sizeId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching size by Size_ID:", err);
    throw err;
  }
};

// ✅ Get all product images
export const getProductImage = async () => {
  try {
    const res = await axios.get(`${API_URL}/productImage`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product images:", err);
    throw err;
  }
};

// ✅ Get product images by Product_ID
export const getProductImageById = async (productId) => {
  try {
    const res = await axios.get(`${API_URL}/productImage/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching image by Product_ID:", err);
    throw err;
  }
};

// ✅ Get all product categories
export const getProductCategory = async () => {
  try {
    const res = await axios.get(`${API_URL}/productCategory`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product categories:", err);
    throw err;
  }
};

// ✅ Get product category by ID
export const getProductCategoryById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/productCategory/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching product category by ID:", err);
    throw err;
  }
};

// ✅ Get all categories
export const getCategory = async () => {
  try {
    const res = await axios.get(`${API_URL}/category`);
    return res.data;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw err;
  }
};

// ✅ Get category by ID
export const getCategoryById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/category/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    throw err;
  }
};
