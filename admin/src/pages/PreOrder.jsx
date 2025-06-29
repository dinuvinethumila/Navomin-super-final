import React, { useEffect, useState } from "react";
// Import API functions to get/update pre-orders and users
import {
  getPreOrder,
  updateEstiPrice,
  updatePreOrderStatus,
} from "../apis/order";
import { getUser } from "../apis/user";

const PreOrder = () => {
  // State to store all pre-orders
  const [preOrders, setPreOrders] = useState([]);

  // State to store user data for resolving names
  const [users, setUsers] = useState([]);

  // Search input state (for filtering by name or order ID)
  const [searchTerm, setSearchTerm] = useState("");

  // State to track editable estimated prices by order ID
  const [priceEdits, setPriceEdits] = useState({}); // { [Pre_Order_ID]: Estimated_Total }

  // Fetch pre-orders and user data on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await getPreOrder(); // fetch pre-orders
        const userList = await getUser();   // fetch users
        setPreOrders(orders);
        setUsers(userList);
      } catch (err) {
        console.error("Error loading pre-order data:", err);
      }
    };
    fetchData();
  }, []);

  // Helper function to get full user name by user ID
  const resolveUserName = (userId) => {
    const user = users.find((u) => u.User_ID === userId);
    return user ? `${user.First_Name} ${user.Last_Name}` : "Unknown";
  };

  // Handle pre-order status change (e.g., Pending → Confirmed)
  const handleStatusChange = async (preOrderId, newStatus) => {
    try {
      await updatePreOrderStatus(preOrderId, newStatus); // update backend
      const updated = await getPreOrder();                // refresh local state
      setPreOrders(updated);
    } catch (err) {
      console.error("Failed to update pre-order status:", err);
    }
  };

  // Handle estimated price change and send update to backend
  const handlePriceUpdate = async (preOrderId, newPrice) => {
    setPriceEdits((prev) => ({ ...prev, [preOrderId]: newPrice }));
    try {
      await updateEstiPrice(preOrderId, newPrice); // update backend
    } catch (err) {
      console.error("Failed to update estimated price:", err);
    }
  };

  // Filter orders based on search input (by name or ID)
  const filteredOrders = preOrders.filter((order) => {
    const customer = resolveUserName(order.User_ID).toLowerCase();
    const idMatch = String(order.Pre_Order_ID).includes(searchTerm);
    const nameMatch = customer.includes(searchTerm.toLowerCase());
    return idMatch || nameMatch;
  });

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="flex-grow-1 p-4">
        {/* Page Title */}
        <h1 className="mb-3">Pre-Orders</h1>

        {/* Search Field */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search by customer name or pre-order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Table Container */}
        <div className="table-responsive">
          <table className="table align-middle table-bordered">
            <thead className="table-light">
              <tr>
                <th>Pre-Order ID</th>
                <th>Customer Name</th>
                <th>Status</th>
                <th>Est. Price (Rs)</th>
                <th>Pickup Date</th>
                <th>Pickup Time</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.Pre_Order_ID}>
                  {/* Pre-order details */}
                  <td>{order.Pre_Order_ID}</td>
                  <td>{resolveUserName(order.User_ID)}</td>
                  <td>{order.Status}</td>

                  {/* Editable Estimated Price */}
                  <td>
                    <div className="input-group">
                      <span className="input-group-text">Rs</span>
                      <input
                        type="number"
                        className="form-control"
                        value={
                          priceEdits[order.Pre_Order_ID] ??
                          order.Estimated_Total
                        }
                        onChange={(e) =>
                          handlePriceUpdate(
                            order.Pre_Order_ID,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                  </td>

                  {/* Pickup Date formatted as YYYY-MM-DD */}
                  <td>
                    {new Date(order.Pickup_Date).toLocaleDateString("en-CA")}
                  </td>

                  {/* Pickup Time formatted as HH:MM AM/PM */}
                  <td>
                    {order?.Pickup_Time &&
                      order.Pickup_Time.split(":").slice(0, 2).join(":") +
                        " " +
                        (parseInt(order.Pickup_Time.split(":")[0]) >= 12
                          ? "PM"
                          : "AM")}
                  </td>

                  {/* Status dropdown to update */}
                  <td>
                    <select
                      className="form-select"
                      value={order.Status}
                      onChange={(e) =>
                        handleStatusChange(order.Pre_Order_ID, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}

              {/* Fallback if no orders match the search */}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No pre-orders found.
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

export default PreOrder;
