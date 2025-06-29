import React, { useEffect, useState } from "react";

// API calls for sales and orders
import {
  getTotalOrderSales,
  getTotalPreOrderSales,
  getTotalSales,
} from "../apis/owner";

// API calls for products
import { getProducts, getProductSize } from "../apis/products";

// API calls for pre-orders
import { getPreOrder, updatePreOrderStatus } from "../apis/order";

const Dashboard = () => {
  // State to store sales figures
  const [totalSales, setTotalSales] = useState(0);
  const [orderSales, setOrderSales] = useState(0);
  const [preOrderSales, setPreOrderSales] = useState(0);

  // State to store product and size data
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);

  // State to store pre-orders that require confirmation
  const [pendingPreOrders, setPendingPreOrders] = useState([]);

  // Fetch total sales data on initial load
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const total = await getTotalSales();
        const normal = await getTotalOrderSales();
        const pre = await getTotalPreOrderSales();
        setTotalSales(total.TOTAL_SALES);
        setOrderSales(normal.TOTAL_SALES);
        setPreOrderSales(pre.TOTAL_SALES);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, []);

  // Fetch product and size data on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const prods = await getProducts();
        const sizes = await getProductSize();
        setProducts(prods);
        setSizes(sizes);
      } catch (error) {
        console.error("Error fetching products or sizes:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch all pending pre-orders on load
  useEffect(() => {
    const fetchPendingPreOrders = async () => {
      try {
        const allPreOrders = await getPreOrder();
        const pending = allPreOrders.filter(
          (po) =>
            po.Status !== "Confirmed" &&
            po.Status !== "Paid" &&
            po.Status !== "Rejected"
        );
        setPendingPreOrders(pending);
      } catch (error) {
        console.error("Error fetching pre-orders:", error);
      }
    };
    fetchPendingPreOrders();
  }, []);

  // Handle status update (Confirm/Reject) for a pre-order
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updatePreOrderStatus(id, newStatus);
      // Remove the updated order from the pending list
      setPendingPreOrders((prev) =>
        prev.filter((po) => po.Pre_Order_ID !== id)
      );
    } catch (error) {
      alert("Failed to update order status");
      console.error(error);
    }
  };

  return (
    <div className="d-flex min-vh-100">
      <div className="flex-grow-1 p-4">
        <h1 className="mb-4">Admin Dashboard</h1>

        {/* Sales Summary Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="bg-white shadow-sm rounded p-4 h-100">
              <h5>Total Sales</h5>
              <h3>Rs. {totalSales || 0}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white shadow-sm rounded p-4 h-100">
              <h5>Normal Order Sales</h5>
              <h3>Rs. {orderSales || 0}</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white shadow-sm rounded p-4 h-100">
              <h5>Pre-Order Sales</h5>
              <h3>Rs. {preOrderSales || 0}</h3>
            </div>
          </div>
        </div>

        {/* Low Stock Section */}
        <div className="bg-white shadow-sm rounded p-4 mb-5">
          <h4 className="mb-3">Low Stock Alerts (≤ 10)</h4>
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {sizes
              .filter((size) => size.Stock <= 10)
              .map((size) => {
                const product = products.find(
                  (p) => p.Product_ID === size.Product_ID
                );
                return (
                  <div key={size.Size_ID} className="col">
                    <div className="bg-light rounded p-3 h-100">
                      <strong>{product?.Product_Name}</strong>
                      <div className="text-muted">Size: {size.Size}</div>
                      <div className="text-danger fw-bold">
                        Stock: {size.Stock}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Pre-Orders Awaiting Confirmation */}
        <div className="bg-white shadow-sm rounded p-4">
          <h4 className="mb-3">Pending Pre-Order Confirmations</h4>
          {pendingPreOrders.length === 0 ? (
            <p className="text-muted">No pending pre-orders found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>User ID</th>
                    <th>Pickup Date</th>
                    <th>Pickup Time</th>
                    <th>Est. Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPreOrders.map((order) => (
                    <tr key={order.Pre_Order_ID}>
                      <td>{order.Pre_Order_ID}</td>
                      <td>{order.User_ID}</td>
                      <td>{order.Pickup_Date}</td>
                      <td>{order.Pickup_Time}</td>
                      <td>Rs. {order.Estimated_Total}</td>
                      <td>{order.Status}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            handleStatusUpdate(order.Pre_Order_ID, "Confirmed")
                          }
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleStatusUpdate(order.Pre_Order_ID, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
