
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { getCartById, getCartItemById, addACart, deleteCartItem } from "../apis/cart.js";
import {
  getCategory,
  getProducts,
  getProductSize,
  getProductImage,
} from "../apis/products.js";
import { useNavigate } from "react-router-dom";
import useGlobalVars from "../UserContext.jsx";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { user } = useGlobalVars();

  const [activeTab, setActiveTab] = useState("normal");
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [normalOrders, setNormalOrders] = useState([]);
  const [preOrders, setPreOrders] = useState([]);
  const [normalOrderPickupTime, setNormalOrderPickupTime] = useState("");
  const [preOrderPickupDate, setPreOrderPickupDate] = useState(new Date().toISOString().split("T")[0]);
  const [preOrderPickupTime, setPreOrderPickupTime] = useState("");
  const [normalOrderPaymentMethod, setNormalOrderPaymentMethod] = useState("online");

  const getDateString = (offsetDays = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().slice(0, 10);
  };
  const minDate = getDateString(1);
  const maxDate = getDateString(30);

  const isValidPickupTime = (time) => {
    if (!time) return false;
    const [hours, minutes] = time.split(":" ).map(Number);
    if (hours < 8 || hours > 22 || (hours === 22 && minutes > 0)) return false;
    return true;
  };

  const handleNormalPickupTimeChange = (e) => {
    const val = e.target.value;
    if (val === "" || isValidPickupTime(val)) {
      setNormalOrderPickupTime(val);
    }
  };

  const handlePreOrderPickupTimeChange = (e) => {
    const val = e.target.value;
    if (val === "" || isValidPickupTime(val)) {
      setPreOrderPickupTime(val);
    }
  };

  const normalOrdersTotalAmount = normalOrders.reduce((acc, item) => acc + item.Price * item.Quantity, 0);
  const preOrdersTotalAmount = preOrders.reduce((acc, item) => acc + item.Price * item.Quantity, 0);

  const normalOrdersRemoveItem = async (id) => {
    try {
      await deleteCartItem(id);
      setNormalOrders((prev) => prev.filter((item) => item.Cart_Item_ID !== id));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const preOrdersRemoveItem = async (id) => {
    try {
      await deleteCartItem(id);
      setPreOrders((prev) => prev.filter((item) => item.Cart_Item_ID !== id));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.User_ID) return;
      try {
        let carts = await getCartById(user.User_ID);
        let activeCart = carts.find((c) => c.IS_ACTIVE === 1);
        if (!activeCart) {
          await addACart({ User_ID: user.User_ID });
          carts = await getCartById(user.User_ID);
          activeCart = carts.find((c) => c.IS_ACTIVE === 1);
        }
        setCart(activeCart);
      } catch (err) {
        console.error("Cart error:", err);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchAll = async () => {
      if (!cart?.Cart_ID) return;
      try {
        const [items, prods, sizes, imgs, cats] = await Promise.all([
          getCartItemById(cart.Cart_ID),
          getProducts(),
          getProductSize(),
          getProductImage(),
          getCategory(),
        ]);
        setCartItems(items);
        setProducts(prods);
        setProductSizes(sizes);
        setProductImages(imgs);
        setCategories(cats);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
    };
    fetchAll();
  }, [cart]);

  useEffect(() => {
    if (!cartItems.length || !products.length || !productSizes.length || !productImages.length || !categories.length) return;
    const enrichItems = (items, categoryName) => {
      return items
        .filter(item => {
          const cat = categories.find(c => c.Category_ID === item.Category_ID);
          return cat?.Category_Name === categoryName;
        })
        .map(item => {
          const product = products.find(p => p.Product_ID === item.Product_ID);
          const size = productSizes.find(s => s.Size_ID === item.Size_ID);
          const image = productImages.find(i => i.Product_ID === item.Product_ID);
  
          return {
            ...item,
            Product_Name: product?.Product_Name || "Unknown",
            Size: size?.Size || "Unknown",
            Price: size?.Price || 0,
            Image_Link: image?.Image_Link || "",
          };
        });
    };
    setNormalOrders(enrichItems(cartItems, "Normal"));
    setPreOrders(enrichItems(cartItems, "Pre Order"));
  }, [cartItems, products, productSizes, productImages, categories]);

  const handleFinalizeOrder = () => {
    navigate("/orderConfirmation", {
      state: {
        finalizedOrder: {
          cartId: cart.Cart_ID,
          normalOrders: {
            orders: normalOrders,
            totalAmount: normalOrdersTotalAmount,
            paymentMethod: normalOrderPaymentMethod,
            pickupTime: normalOrderPickupTime,
          },
        },
      },
    });
  };

  const handleFinalizePreOrder = () => {
    navigate("/orderConfirmation", {
      state: {
        finalizedOrder: {
          cartId: cart.Cart_ID,
          normalOrders: {
            orders: [],
            totalAmount: 0,
            paymentMethod: null,
            pickupTime: null,
          },
          preOrders: {
            orders: preOrders,
            totalAmount: preOrdersTotalAmount,
            pickupDate: preOrderPickupDate,
            pickupTime: preOrderPickupTime,
          },
        },
      },
    });
  };
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center">Shopping Cart</h2>
        <div className="d-flex justify-content-center mb-4">
          <button onClick={() => setActiveTab("normal")} className={`btn me-2 ${activeTab === "normal" ? "btn-primary" : "btn-outline-primary"}`}>Normal Orders</button>
          <button onClick={() => setActiveTab("pre")} className={`btn ${activeTab === "pre" ? "btn-primary" : "btn-outline-primary"}`}>Pre Orders</button>
        </div>

        {activeTab === "normal" && normalOrders.length > 0 && (
          <div>
            <h4>Normal Orders</h4>
            <ul className="list-group mb-3">
              {normalOrders.map(item => (
                <li key={item.Cart_Item_ID} className="list-group-item d-flex justify-content-between align-items-center">
                  <img src={item.Image_Link} alt={item.Product_Name} style={{ width: 80 }} />
                  <span>{item.Product_Name} ({item.Size})</span>
                  <span>x{item.Quantity}</span>
                  <span>Rs.{item.Price * item.Quantity}</span>
                  <button className="btn btn-sm btn-danger" onClick={() => normalOrdersRemoveItem(item.Cart_Item_ID)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="mb-3">
              <label>Pickup Time (8AM-10PM): </label>
              <input type="time" className="form-control" value={normalOrderPickupTime} onChange={handleNormalPickupTimeChange} min="08:00" max="22:00" />
            </div>
            <div className="mb-3">
              <strong>Total: Rs.{normalOrdersTotalAmount.toFixed(2)}</strong>
            </div>
            <button className="btn btn-success" onClick={handleFinalizeOrder}>Finalize Normal Order</button>
          </div>
        )}

        {activeTab === "pre" && preOrders.length > 0 && (
          <div>
            <h4>Pre Orders</h4>
            <ul className="list-group mb-3">
              {preOrders.map(item => (
                <li key={item.Cart_Item_ID} className="list-group-item d-flex justify-content-between align-items-center">
                  <img src={item.Image_Link} alt={item.Product_Name} style={{ width: 80 }} />
                  <span>{item.Product_Name}</span>
                  <span>x{item.Quantity}</span>
                  <span>Rs.{item.Price * item.Quantity}</span>
                  <button className="btn btn-sm btn-danger" onClick={() => preOrdersRemoveItem(item.Cart_Item_ID)}>Remove</button>
                </li>
              ))}
            </ul>
            <div className="mb-3">
              <label>Pickup Date (within 30 days): </label>
              <input type="date" className="form-control" value={preOrderPickupDate} onChange={e => setPreOrderPickupDate(e.target.value)} min={minDate} max={maxDate} />
            </div>
            <div className="mb-3">
              <label>Pickup Time (8AM-10PM): </label>
              <input type="time" className="form-control" value={preOrderPickupTime} onChange={handlePreOrderPickupTimeChange} min="08:00" max="22:00" />
            </div>
            <div className="mb-3">
              <strong>Estimated Total: Rs.{preOrdersTotalAmount.toFixed(2)}</strong>
            </div>
            <button className="btn btn-success" onClick={handleFinalizePreOrder}>Finalize Pre Order</button>
          </div>
        )}
      </div>
      
       

      <Footer />

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

        .table-container {
          max-height: 300px;
          overflow-y: auto;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .cart-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .cart-table th,
        .cart-table td {
          padding: 12px;
          border-bottom: 1px solid #ddd;
        }

        .cart-table th {
          background-color: #f5f5f5;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .cart-image {
          width: 90px;
          height: 60px;
          object-fit: cover;
          border-radius: 5px;
        }

        .remove-btn {
          background-color: #6C63FF;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
        }

        .remove-btn:hover {
          background-color: #5548d4;
        }

        .pickup-section {
          margin-top: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .time-input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .payment-section {
          margin-top: 20px;
        }

        .payment-section label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .info-text {
          font-size: 12px;
          color: gray;
        }

        .total-amount {
          margin-top: 20px;
          font-size: 18px;
          font-weight: bold;
          text-align: right;
        }
      `}</style>
    </>
  );
};

export default ShoppingCart;
