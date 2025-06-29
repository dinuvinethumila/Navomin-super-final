import React, { useEffect, useState } from "react";
import {
  getPreOrder,
  updateEstiPrice,
  updatePreOrderStatus,
} from "../apis/order";
import { getUser } from "../apis/user";

const PreOrder = () => {
  const [preOrders, setPreOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceEdits, setPriceEdits] = useState({}); // { [Pre_Order_ID]: Estimated_Total }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await getPreOrder();
        const userList = await getUser();
        setPreOrders(orders);
        setUsers(userList);
      } catch (err) {
        console.error("Error loading pre-order data:", err);
      }
    };
    fetchData();
  }, []);

  const resolveUserName = (userId) => {
    const user = users.find((u) => u.User_ID === userId);
    return user ? `${user.First_Name} ${user.Last_Name}` : "Unknown";
  };

  const handleStatusChange = async (preOrderId, newStatus) => {
    try {
      await updatePreOrderStatus(preOrderId, newStatus);
      const updated = await getPreOrder();
      setPreOrders(updated);
    } catch (err) {
      console.error("Failed to update pre-order status:", err);
    }
  };

  const handlePriceUpdate = async (preOrderId, newPrice) => {
    setPriceEdits((prev) => ({ ...prev, [preOrderId]: newPrice }));
    try {
      await updateEstiPrice(preOrderId, newPrice);
    } catch (err) {
      console.error("Failed to update estimated price:", err);
    }
  };

  const filteredOrders = preOrders.filter((order) => {
    const customer = resolveUserName(order.User_ID).toLowerCase();
    const idMatch = String(order.Pre_Order_ID).includes(searchTerm);
    const nameMatch = customer.includes(searchTerm.toLowerCase());
    return idMatch || nameMatch;
  });

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="flex-grow-1 p-4">
        <h1 className="mb-3">Pre-Orders</h1>

        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search by customer name or pre-order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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
                  <td>{order.Pre_Order_ID}</td>
                  <td>{resolveUserName(order.User_ID)}</td>
                  <td>{order.Status}</td>
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
                  <td>
                    {new Date(order.Pickup_Date).toLocaleDateString("en-CA")}
                  </td>
                  <td>
                    {order?.Pickup_Time &&
                      order.Pickup_Time.split(":").slice(0, 2).join(":") +
                        " " +
                        (parseInt(order.Pickup_Time.split(":")[0]) >= 12
                          ? "PM"
                          : "AM")}
                  </td>
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
