import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getOrderItemByOrderId,
  getOrderById,
  getPreOrderByUserId,
  getPreOrderItemByPreOrderId,
  updatePreOrderStatus,
  updatePreOrderPaymentStatus,
} from "../apis/order";
import {
  getProductById,
  getProductSizeBySizeId,
} from "../apis/products";
import useGlobalVars from "../UserContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderDetails = () => {
  const { state } = useLocation();
  const { type, id } = state || {};
  const { user } = useGlobalVars();

  const [items, setItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let itemData = [];
        let metaData = {};

        if (type === "normal") {
          const order = await getOrderById(id);
          metaData = order;
          itemData = await getOrderItemByOrderId(id);
        } else {
          const preOrders = await getPreOrderByUserId(user.User_ID);
          const selectedPreOrder = preOrders.find((p) => p.Pre_Order_ID === id);
          metaData = selectedPreOrder || {};
          setPaid(selectedPreOrder?.Half_Paid === "Paid");
          itemData = await getPreOrderItemByPreOrderId(id);
        }

        const enriched = await Promise.all(
          itemData.map(async (item) => {
            const product = await getProductById(item.Product_ID);
            const size = await getProductSizeBySizeId(item.Size_ID);
            return {
              ...item,
              Product_Name: product?.Product_Name || "Unknown",
              Size: size?.Size || "Unknown",
              Price: size?.Price || 0,
              Total: (item.Quantity * (size?.Price || 0)).toFixed(2),
            };
          })
        );

        setItems(enriched);
        setOrderInfo(metaData);
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [type, id, user]);

  const handleMockPayment = async () => {
    if (orderInfo?.Status !== "Confirmed") {
      return alert("Your order is not yet confirmed by admin.");
    }

    try {
      setIsPaying(true);
      await updatePreOrderPaymentStatus(id, "Paid");
      setPaid(true);
      setSuccessMessage("✅ Payment completed for your pre-order!");
    } catch (err) {
      console.error("Payment update failed:", err);
      alert("Payment failed. Try again later.");
    } finally {
      setIsPaying(false);
    }
  };

  const total = items.reduce((sum, item) => sum + parseFloat(item.Total), 0).toFixed(2);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h3 className="mb-4">Order Details - {type === "normal" ? "Normal Order" : "Pre-Order"}</h3>

        {items.length === 0 ? (
          <p>No items found for this order.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Size</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.Product_Name}</td>
                  <td>{item.Size}</td>
                  <td>Rs. {item.Price}</td>
                  <td>{item.Quantity}</td>
                  <td>Rs. {item.Total}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="text-end fw-bold">Total</td>
                <td className="fw-bold">Rs. {total}</td>
              </tr>
            </tbody>
          </table>
        )}

        <div className="mt-4">
          {type === "normal" ? (
            <>
              <p><strong>Pickup Time:</strong> {orderInfo?.Pickup_Time || "-"}</p>
              <p><strong>Status:</strong> {orderInfo?.Status || "-"}</p>
              <p><strong>Payment Status:</strong> {orderInfo?.Payment_Status || "Unpaid"}</p>
            </>
          ) : (
            <>
              <p><strong>Pickup Date:</strong> {orderInfo?.Pickup_Date || "-"}</p>
              <p><strong>Pickup Time:</strong> {orderInfo?.Pickup_Time || "-"}</p>
              <p><strong>Status:</strong> {orderInfo?.Status || "-"}</p>
              <p><strong>Paid:</strong> {paid ? "Yes" : "No"}</p>
              {!paid && (
                <button
                  className="btn btn-success"
                  onClick={handleMockPayment}
                  disabled={isPaying}
                >
                  {isPaying ? "Processing..." : "Pay Now (Mock)"}
                </button>
              )}
              {successMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  {successMessage}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;
