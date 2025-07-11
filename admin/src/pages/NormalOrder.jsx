import React, { useEffect, useState } from "react";
import { getOrder, updateOrderStatus } from "../apis/order"; // Order-related API calls
import { getUser } from "../apis/user"; // User data API call

const NormalOrder = () => {
  // State to manage search input
  const [searchTerm, setSearchTerm] = useState("");
  // Full list of orders from API
  const [ordersData, setOrdersData] = useState([]);
  // Orders that match the current search term
  const [filteredOrders, setFilteredOrders] = useState([]);
  // Full list of users (to map user IDs to names)
  const [users, setUsers] = useState([]);

  // Fetch all normal orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrder();
        setOrdersData(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Fetch user data on mount (needed to display user names)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userList = await getUser();
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  // Filter orders by customer name or order ID when search term, orders, or users change
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    const filtered = ordersData.filter(({ Order_ID, User_ID }) => {
      const user = users.find((u) => u.User_ID === User_ID);
      const fullName = user
        ? `${user.First_Name} ${user.Last_Name}`.toLowerCase()
        : "";
      return (
        String(Order_ID).includes(searchTerm) || fullName.includes(lowerSearch)
      );
    });

    setFilteredOrders(filtered);
  }, [searchTerm, ordersData, users]);

  // Handle status dropdown change and update order status via API
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      const updatedOrders = await getOrder(); // Refresh orders after update
      setOrdersData(updatedOrders);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Utility to format pickup time (24h to 12h AM/PM)
  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [hour, min] = timeStr.split(":");
    const hr = parseInt(hour, 10);
    return `${hr % 12 || 12}:${min} ${hr >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div className="d-flex min-vh-100">
      <div className="flex-grow-1 p-4">
        <h2 className="mb-3">Normal Orders</h2>

        {/* Search Input */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search by customer name or order number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Orders Table */}
        <div className="table-responsive shadow-sm bg-white rounded">
          <table className="table table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Pickup Time</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const user = users.find((u) => u.User_ID === order.User_ID);
                return (
                  <tr key={order.Order_ID}>
                    <td>{order.Order_ID}</td>
                    <td>
                      {user
                        ? `${user.First_Name} ${user.Last_Name}`
                        : "Unknown"}
                    </td>
                    <td>{order.Status}</td>
                    <td>Rs. {order.Total_Amount}</td>
                    <td>{formatTime(order.Pickup_Time)}</td>
                    <td>
                      <select
                        className="form-select"
                        value={order.Status}
                        onChange={(e) =>
                          handleStatusChange(order.Order_ID, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready for Pickup">
                          Ready for Pickup
                        </option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {/* No data case */}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No matching orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NormalOrder;
