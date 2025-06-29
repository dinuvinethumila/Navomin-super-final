// [OrderConfirmation.jsx]
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CardPayment from "./CardPayment";

// Import API methods to handle orders and cart
import {
  addAnOrder,
  addOrderItem,
  addAPreOrder,
  addPreOrderItem,
} from "../apis/order";

import { disableCart, getCartItemById } from "../apis/cart";
import useGlobalVars from "../UserContext";

const OrderConfirmation = () => {

    // Get order data passed from ShoppingCart page
  const location = useLocation();
  const { finalizedOrder } = location.state || {};
  const { user } = useGlobalVars();
  const navigate = useNavigate();


// Extract normal/pre-order data and cart ID
  const normalOrders = finalizedOrder?.normalOrders || {};
  const preOrders = finalizedOrder?.preOrders || {};
  const cartId = finalizedOrder?.cartId || null;
  // UI state management
  const [paymentTrigger, setPaymentTrigger] = useState(false);// Show CardPayment
  const [paymentSuccess, setPaymentSuccess] = useState(false);// Show payment success
  const [orderPlaced, setOrderPlaced] = useState(false); // Track if order is completed
  const [latestOrderId, setLatestOrderId] = useState(null); // Save placed order/pre-order ID
  const [messageOnly, setMessageOnly] = useState(false);// Show pre-order confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);     // Prevent multiple clicks


    // Detect which type of order was passed
  const isNormalOrder = normalOrders.orders?.length > 0;
  const isPreOrder = preOrders.orders?.length > 0;

  const finalizeNormalOrder = async () => {
    try {
      setIsSubmitting(true);

      const cartItems = await getCartItemById(cartId);
      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      // Calculate total

      const totalAmount = cartItems.reduce((acc, item) => {
        return acc + (Number(item?.Price) || 0) * (Number(item?.Quantity) || 0);
      }, 0);
 // Create order entry in DB
      const orderResponse = await addAnOrder({
        userId: user.User_ID,
        Pickup_Time: normalOrders.pickupTime || "not selected",
        Total_Amount: totalAmount,
        Status: "Confirmed",
      });

      const orderId = orderResponse.Order_ID;
      setLatestOrderId(orderId);

      // Add each item to the order
      for (const item of cartItems) {
        await addOrderItem({
          Order_ID: orderId,
          Product_ID: item.Product_ID,
          Size_ID: item.Size_ID,
          Quantity: item.Quantity,
          Total_Amount: item.Quantity * item.Price,
        });
      }

      setPaymentTrigger(true); // Show payment form
    } catch (error) {
      console.error("Normal order placement failed:", error);
      alert("Order could not be placed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizePreOrder = async () => {
    try {
      setIsSubmitting(true);

      const cartItems = await getCartItemById(cartId);
      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      const totalAmount = cartItems.reduce((acc, item) => {
        return acc + (Number(item?.Price) || 0) * (Number(item?.Quantity) || 0);
      }, 0);

      
      // Create pre-order entry
      const preOrderResponse = await addAPreOrder({
        User_ID: user?.User_ID,
        Half_Paid: "Unpaid",
        Estimated_Total: totalAmount,
        Pickup_Date: preOrders?.pickupDate || new Date().toISOString().slice(0, 10),
        Pickup_Time: preOrders?.pickupTime || "not selected",
      });

      const preOrderId = preOrderResponse.Pre_Order_ID;
      setLatestOrderId(preOrderId);
  // Add items to pre-order
      for (const item of cartItems) {
        await addPreOrderItem({
          Pre_Order_ID: preOrderId,
          Product_ID: item.Product_ID,
          Size_ID: item.Size_ID,
          Quantity: item.Quantity,
        });
      }

      await disableCart(cartId);// Mark cart as used
      setMessageOnly(true);  // Show confirmation
      setOrderPlaced(true);


        // Redirect after 2 seconds
      setTimeout(() => navigate("/myOrders", { replace: true }), 2000);
    } catch (error) {
      console.error("Pre-order placement failed:", error);
      alert("Pre-order could not be placed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
  {/* If payment isn't triggered yet, show summary */}
      {!paymentTrigger && (
        <Container className="my-5">
          <h4 className="mb-3">Order Summary</h4>

          {/* Normal Orders */}
          {isNormalOrder && (
            <div className="border rounded p-4 shadow-sm mb-4">
              <h6>Normal Orders</h6>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Item Image</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {normalOrders.orders.map((item, idx) => (
                    <tr key={idx}>
                      <td><img src={item.Image_Link || "/placeholder.png"} alt={item.Product_Name} width="50" /></td>
                      <td>{item.Product_Name}</td>
                      <td>Rs. {item.Price}</td>
                      <td>{item.Size}</td>
                      <td>{item.Quantity}</td>
                      <td>Rs. {item.Price * item.Quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p className="text-muted">Pickup Time: {normalOrders.pickupTime}</p>

              {/* Normal order button */}
              {!orderPlaced && (
                <Button
                  variant="primary"
                  className="submit-btn"
                  onClick={finalizeNormalOrder}
                  disabled={isSubmitting}
                >
                  Finalize Normal Order
                </Button>
              )}
            </div>
          )}

          {/* Pre Orders */}
          {isPreOrder && (
            <div className="border rounded p-4 shadow-sm mb-4">
              <h6>Pre Orders</h6>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Item Image</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {preOrders.orders.map((item, idx) => (
                    <tr key={idx}>
                      <td><img src={item.Image_Link || "/placeholder.png"} alt={item.Product_Name} width="50" /></td>
                      <td>{item.Product_Name}</td>
                      <td>Rs. {item.Price}</td>
                      <td>{item.Size}</td>
                      <td>{item.Quantity}</td>
                      <td>Rs. {item.Price * item.Quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p className="text-muted">Pickup Date: {preOrders.pickupDate}</p>
              <p className="text-muted">Pickup Time: {preOrders.pickupTime}</p>
     {/* Pre-order button */}
              {!orderPlaced && (
                <Button
                  variant="success"
                  className="submit-btn"
                  onClick={finalizePreOrder}
                  disabled={isSubmitting}
                >
                  Finalize Pre-Order
                </Button>
              )}
            </div>
          )}

           {/* Status messages */}

          {messageOnly && (
            <Alert variant="success" className="mt-3 text-center">
              Pre-order finalized!
            </Alert>
          )}

          {paymentSuccess && (
            <Alert variant="success" className="mt-3 text-center">
             Your payment was successful!
            </Alert>
          )}

          {/* Styling for buttons */}
          <style>{`
            .submit-btn {
              display: block;
              width: 100%;
              padding: 10px;
              background-color: #6C63FF;
              color: white;
              font-size: 16px;
              border: none;
              border-radius: 5px;
              margin-top: 20px;
              cursor: pointer;
            }
            .submit-btn:hover {
              background-color: #5548d4;
            }
          `}</style>
        </Container>
      )}

  
      {/* Show payment UI for normal orders */}
      {paymentTrigger && (
        <CardPayment
          setPaymentTrigger={setPaymentTrigger}
          setPaymentSuccess={async (success) => {
            if (success) {
              setPaymentSuccess(true);
              setOrderPlaced(true);
              await disableCart(cartId);
              setTimeout(() => navigate("/myOrders", { replace: true }), 2000);
            }
          }}
          orderId={latestOrderId}
          isPreOrder={false}
        />
      )}

      <Footer />
    </>
  );
};

export default OrderConfirmation;
