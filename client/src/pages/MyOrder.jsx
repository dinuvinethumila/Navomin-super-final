import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderByUserId, getPreOrderByUserId } from "../apis/order";
import useGlobalVars from "../UserContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

const MyOrder = () => {
  const { user } = useGlobalVars();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [preOrders, setPreOrders] = useState([]);

  useEffect(() => {
    if (!user?.User_ID) return;

    const fetchOrders = async () => {
      try {
        const [normal, pre] = await Promise.all([
          getOrderByUserId(user.User_ID),
          getPreOrderByUserId(user.User_ID),
        ]);
        setOrders(normal);
        setPreOrders(pre);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const handleViewDetails = (type, id) => {
    navigate("/orderDetails", { state: { type, id } });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">My Orders</h2>

        <h4 className="mt-4">Normal Orders</h4>
        {orders.length === 0 ? (
          <p>No normal orders found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Pickup Time</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.Order_ID}>
                  <td>{order.Order_ID}</td>
                  <td>{order.Pickup_Time}</td>
                  <td>Rs. {order.Total_Amount}</td>
                  <td>{order.Status}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewDetails("normal", order.Order_ID)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h4 className="mt-5">Pre Orders</h4>
        {preOrders.length === 0 ? (
          <p>No pre-orders found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Pre-Order ID</th>
                <th>Pickup Date</th>
                <th>Pickup Time</th>
                <th>Estimated Total</th>
                <th>Status</th>
                <th>Paid</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {preOrders.map((pre) => (
                <tr key={pre.Pre_Order_ID}>
                  <td>{pre.Pre_Order_ID}</td>
                  <td>{pre.Pickup_Date}</td>
                  <td>{pre.Pickup_Time}</td>
                  <td>Rs. {pre.Estimated_Total}</td>
                  <td>{pre.Status}</td>
                  <td>{pre.Half_Paid ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewDetails("pre", pre.Pre_Order_ID)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
   
      <style>{`
        .table-container {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .table-container::-webkit-scrollbar {
          width: 5px;
        }
        .table-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .table-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
};

export default MyOrder;
