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

import {
  addAnOrder,
  addOrderItem,
  addAPreOrder,
  addPreOrderItem,
} from "../apis/order";

import { disableCart, getCartItemById } from "../apis/cart";
import useGlobalVars from "../UserContext";

const OrderConfirmation = () => {
  const location = useLocation();
  const { finalizedOrder } = location.state || {};
  const { user } = useGlobalVars();
  const navigate = useNavigate();

  const normalOrders = finalizedOrder?.normalOrders || {};
  const preOrders = finalizedOrder?.preOrders || {};
  const cartId = finalizedOrder?.cartId || null;

  const [paymentTrigger, setPaymentTrigger] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState(null);
  const [messageOnly, setMessageOnly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrder = async () => {
    try {
      setIsSubmitting(true);

      const cartItems = await getCartItemById(cartId);
      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty.");
        setIsSubmitting(false);
        return { success: false };
      }

      const totalAmount = cartItems.reduce((acc, item) => {
        const price = Number(item?.Price) || 0;
        const qty = Number(item?.Quantity) || 0;
        return acc + price * qty;
      }, 0);

      if (normalOrders.orders?.length > 0) {
        const orderResponse = await addAnOrder({
          userId: user.User_ID,
          Pickup_Time: normalOrders.pickupTime || "15:30",
          Total_Amount: totalAmount,
          Status: "Confirmed",
        });

        const orderId = orderResponse.Order_ID;
        setLatestOrderId(orderId);

        for (const item of cartItems) {
          await addOrderItem({
            Order_ID: orderId,
            Product_ID: item.Product_ID,
            Size_ID: item.Size_ID,
            Quantity: item.Quantity,
            Total_Amount: item.Quantity * item.Price,
          });
        }

        return { success: true };
      }

      if (preOrders.orders?.length > 0) {
        const preOrderPayload = {
          User_ID: user?.User_ID,
          Half_Paid: "Unpaid",
          Estimated_Total: totalAmount,
          Pickup_Date: preOrders?.pickupDate || new Date().toISOString().slice(0, 10),
          Pickup_Time: preOrders?.pickupTime || "15:30",
        };

        const preOrderResponse = await addAPreOrder(preOrderPayload);
        const preOrderId = preOrderResponse.Pre_Order_ID;
        setLatestOrderId(preOrderId);

        for (const item of cartItems) {
          await addPreOrderItem({
            Pre_Order_ID: preOrderId,
            Product_ID: item.Product_ID,
            Size_ID: item.Size_ID,
            Quantity: item.Quantity,
          });
        }

        setMessageOnly(true);
        setOrderPlaced(true);
        await disableCart(cartId);

        setTimeout(() => navigate("/myOrders", { replace: true }), 2000);

        return { success: true };
      }

      return { success: false };
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Order could not be placed. Try again.");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidationBeforeProceed = async () => {
    const hasNormal = normalOrders.orders?.length > 0;
    const hasPre = preOrders.orders?.length > 0;

    if (hasNormal && hasPre) {
      alert("❌ Cannot place Normal and Pre Orders at the same time.");
      return;
    }

    const result = await createOrder();
    if (result.success && hasNormal) {
      setPaymentTrigger(true);
    }
  };

  return (
    <>
      <Navbar />
      {!paymentTrigger && (
        <Container className="my-5">
          <h4 className="mb-3">Order Summary</h4>

          {normalOrders.orders?.length > 0 && (
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
            </div>
          )}

          {preOrders.orders?.length > 0 && (
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
            </div>
          )}

          <Row className="mb-3">
            <Col md={6}>
              <p>Normal Total: <strong>Rs. {normalOrders.totalAmount}</strong></p>
              <p>Payment Method: {normalOrders.paymentMethod?.toUpperCase()}</p>
            </Col>
            <Col md={6}>
              <p>Pre-Order Estimate: <strong>Rs. {preOrders.totalAmount}</strong></p>
              <p>(Pre-orders processed without payment)</p>
            </Col>
          </Row>

          {messageOnly && (
            <Alert variant="success" className="mt-3 text-center">
              ✅ Pre-order finalized!
            </Alert>
          )}

          {paymentSuccess && (
            <Alert variant="success" className="mt-3 text-center">
              ✅ Your payment was successful!
            </Alert>
          )}

          {!orderPlaced && (
            <Button variant="primary" className="submit-btn" onClick={handleValidationBeforeProceed} disabled={isSubmitting}>
              Finalize {normalOrders.orders?.length > 0 ? "Normal" : "Pre"} Order
            </Button>
          )}

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

      {paymentTrigger && (
        <CardPayment
          setPaymentTrigger={setPaymentTrigger}
          setPaymentSuccess={setPaymentSuccess}
          orderId={latestOrderId}
          isPreOrder={false}
        />
      )}

      <Footer />
    </>
  );
};

export default OrderConfirmation;
