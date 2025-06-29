import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const [activeTab, setActiveTab] = useState("normal");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: "images/apple.jpg",
      name: "Apple",
      pricePer100g: 20,
      quantity: 5,
      total: 100,
    },
    {
      id: 2,
      image: "images/bananas.jpg",
      name: "Banana",
      pricePer100g: 400,
      quantity: 1,
      total: 400,
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  const totalAmount = cartItems.reduce((acc, item) => acc + item.total, 0);

  const removeItem = (id) => {
    if (window.confirm("Remove this item?")) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    }
  };

  const toggleEdit = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
              total: item.pricePer100g * newQuantity,
              isEditing: false,
            }
          : item
      )
    );
  };

  const handleFinalizePreOrder = () => {
    // You will replace this with actual cart/pre-order submission logic
    navigate("/orderConfirmation", {
      state: {
        finalizedOrder: {
          cartId: 123, // mocked
          normalOrders: {
            orders: [],
            totalAmount: 0,
            paymentMethod: null,
            pickupTime: null,
          },
          preOrders: {
            orders: cartItems,
            totalAmount,
            pickupDate,
            pickupTime,
          },
        },
      },
    });
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="d-flex justify-content-center mb-3">
          <button
            className={`btn mx-2 ${
              activeTab === "normal" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab("normal")}
          >
            Normal Orders
          </button>
          <button
            className={`btn mx-2 ${
              activeTab === "pre" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab("pre")}
          >
            Pre Orders
          </button>
        </div>

        <div className="container" style={{ maxWidth: "900px" }}>
          {activeTab === "pre" && (
            <div>
              <h2 className="title">Pre-Orders Shopping Cart</h2>

              <div className="table-container">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Item Image</th>
                      <th>Item Name</th>
                      <th>Price/1</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="cart-image"
                          />
                        </td>
                        <td>{item.name}</td>
                        <td>Rs.{item.pricePer100g}</td>
                        <td>
                          {item.isEditing ? (
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>
                        <td>Rs.{item.total}</td>
                        <td>
                          {item.isEditing ? (
                            <button
                              className="btn btn-success"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity)
                              }
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="btn btn-warning"
                              onClick={() => toggleEdit(item.id)}
                            >
                              Update
                            </button>
                          )}
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pickup-section">
                <label className="fw-bold">Pickup Date:</label>
                <input
                  type="date"
                  className="time-input"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>

              <div className="pickup-section">
                <label className="fw-bold">Pickup Time:</label>
                <input
                  type="time"
                  className="time-input"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                />
              </div>

              <div className="total-amount">
                Total Pre Order Amount: Rs.{totalAmount.toFixed(2)}
              </div>

              <button className="submit-btn" onClick={handleFinalizePreOrder}>
                Finalize Pre Order
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ShoppingCart;
