import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getOrder,
  getPreOrder,
  getOrderItemByOrderId,
  getPreOrderItemByPreOrderId,
  getOrderById,
  getPreOrderByUserId,
} from "../apis/order";
import {
  getProductById,
  getProductSizeBySizeId,
} from "../apis/products";

const Billing = () => {
  const { billNumberFromOrder } = useParams();
  const billFromOrderList = billNumberFromOrder !== undefined;

  const [billNumber, setBillNumber] = useState(billNumberFromOrder || "");
  const [orderType, setOrderType] = useState("Normal Order");
  const [items, setItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});
  const [received, setReceived] = useState(0);

  const totalQty = items.reduce((sum, item) => sum + (item.Quantity || 0), 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.Total || 0), 0);
  const balance = received - totalPrice;

  const fetchBillDetails = async () => {
    if (!billNumber) return;

    try {
      let itemData = [];
      let metaData = {};

      if (orderType === "Normal Order") {
        const order = await getOrderById(billNumber);
        metaData = order;
        itemData = await getOrderItemByOrderId(billNumber);
      } else {
        const allPreOrders = await getPreOrder(); // admin view
        const selected = allPreOrders.find(p => p.Pre_Order_ID === parseInt(billNumber));
        if (!selected) return alert("Invalid Pre-Order ID");
        metaData = selected;
        itemData = await getPreOrderItemByPreOrderId(billNumber);
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
      console.error("Error fetching billing info:", err);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const [hr, min] = timeStr.split(":");
    const hour = parseInt(hr, 10);
    return `${hour % 12 || 12}:${min} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Billing Page</h2>

      {/* Input Form */}
      <div className="mb-4 d-flex gap-4 align-items-end">
        <div>
          <label>Order Type</label>
          <select className="form-select" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="Normal Order">Normal Order</option>
            <option value="Pre Order">Pre Order</option>
          </select>
        </div>

        <div>
          <label>Bill Number</label>
          <input
            className="form-control"
            type="text"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            disabled={billFromOrderList}
          />
        </div>

        <button className="btn btn-primary" onClick={fetchBillDetails}>
          Search
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.Product_Name}</td>
                <td>{item.Size}</td>
                <td>{item.Quantity}</td>
                <td>Rs. {item.Price}</td>
                <td>Rs. {item.Total}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="5" className="text-end fw-bold">Total</td>
              <td className="fw-bold">Rs. {totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="row mt-4">
        <div className="col-md-6">
          <label>Received</label>
          <input
            type="number"
            className="form-control mb-2"
            value={received}
            onChange={(e) => setReceived(parseFloat(e.target.value || ''))}
          />
          <p><strong>Balance:</strong> Rs. {balance.toFixed(2)}</p>
        </div>
        
         

        <div className="col-md-6">
          <p><strong>Pickup Time:</strong> {formatTime(orderInfo?.Pickup_Time)}</p>
          {orderType === "Pre Order" && (
            <p><strong>Pickup Date:</strong> {orderInfo?.Pickup_Date || "-"}</p>
          )}
          <p><strong>Status:</strong> {orderInfo?.Status || "-"}</p>
          <p><strong>Payment:</strong> {orderInfo?.Payment_Status || orderInfo?.Half_Paid || "-"}</p>
        </div>

         <button
    className="btn btn-primary"
    >
    Print Bill
  </button>
      </div>
    </div>
    
  );
};



export default Billing;
