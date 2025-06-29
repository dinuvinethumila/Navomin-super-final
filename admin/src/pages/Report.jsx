import { useEffect, useState } from "react";
import {
  getCategory,
  getProductCategory,
  getProducts,
  getProductSize,
} from "../apis/products"; // Import API functions for fetching product-related data
import { generateStockPDF, generateSalesPDF } from "../generatePdf"; // Import PDF generation functions
import { getOrder, getPreOrder } from "../apis/order"; // Import functions to get orders
import { getUser } from "../apis/user"; // Import function to fetch user details
import { FaDownload } from "react-icons/fa"; // Icon for download button

// Available report types
const reportTypes = [
  { id: 1, name: "Stocks" },
  { id: 2, name: "Sales" },
];

const Report = () => {
  // State variables to hold data
  const [category, setCategory] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSize, setProductSize] = useState([]);

  const [report, setReport] = useState([]); // Holds the generated report content
  const [reportReady, setReportReady] = useState(false); // Boolean to control download availability
  const [selectedReportType, setSelectedReportType] = useState(""); // Tracks selected report type

  const [ordersData, setOrdersData] = useState([]); // Normal orders
  const [preOrders, setPreOrders] = useState([]); // Pre-orders
  const [users, setUsers] = useState([]); // Customer info

  // Load all necessary data once on mount
  useEffect(() => {
    getCategory().then(setCategory).catch(console.error);
    getProductCategory().then(setProductCategory).catch(console.error);
    getProducts().then(setProducts).catch(console.error);
    getProductSize().then(setProductSize).catch(console.error);
    getOrder().then(setOrdersData).catch(console.error);
    getPreOrder().then(setPreOrders).catch(console.error);
    getUser().then(setUsers).catch(console.error);
  }, []);

  // Generate report based on selected type
  const generateReport = () => {
    const type = parseInt(selectedReportType);

    if (type === 1) {
      // Generate Stock Report
      const result = category.map((cat) => {
        // For each main category, find associated product categories
        const matchedProdCats = productCategory
          .filter((pCat) => pCat.Category_ID === cat.Category_ID)
          .map((prodCat) => {
            // For each product category, find matching products
            const matchingProducts = products
              .filter((p) => p.ProductCategory_ID === prodCat.ProductCategory_ID)
              .map((p) => {
                // For each product, get size and stock
                const sizes = productSize
                  .filter((s) => s.Product_ID === p.Product_ID)
                  .map((s) => ({
                    product: p.Product_Name,
                    size: s.Size,
                    quantity: s.Stock,
                  }));
                return sizes;
              })
              .flat(); // Flatten nested arrays

            return {
              productCategory: prodCat.ProductCategory_Name,
              products: matchingProducts,
            };
          });

        return {
          category: cat.Category_Name,
          productCategory: matchedProdCats,
        };
      });

      setReport(result); // Set the final stock report structure
    } else if (type === 2) {
      // Generate Sales Report

      // Map normal orders with related customer info
      const normal = ordersData.map((o) => {
        const user = users.find((u) => u.User_ID === o.User_ID);
        return {
          orderNumber: o.Order_ID,
          customerName: user ? `${user.First_Name} ${user.Last_Name}` : "Unknown",
          time:
            o?.Pickup_Time &&
            o?.Pickup_Time.split(":").slice(0, 2).join(":") +
              " " +
              (parseInt(o.Pickup_Time.split(":")[0]) >= 12 ? "PM" : "AM"),
          status: o.Status,
          totalAmount: o.Total_Amount,
        };
      });

      // Map pre-orders with customer info
      const pre = preOrders.map((o) => {
        const user = users.find((u) => u.User_ID === o.User_ID);
        return {
          orderNumber: o.Pre_Order_ID,
          customerName: user ? `${user.First_Name} ${user.Last_Name}` : "Unknown",
          date: new Date(o.Pickup_Date).toLocaleDateString("en-CA"),
          time:
            o?.Pickup_Time &&
            o?.Pickup_Time.split(":").slice(0, 2).join(":") +
              " " +
              (parseInt(o.Pickup_Time.split(":")[0]) >= 12 ? "PM" : "AM"),
          status: o.Status,
          totalAmount: o.Estimated_Total,
        };
      });

      // Set the final sales report structure
      setReport([
        { type: "Normal Order", orders: normal },
        { type: "Pre Order", orders: pre },
      ]);
    }
  };

  // Trigger PDF download based on selected type
  const handleDownload = () => {
    const type = parseInt(selectedReportType);
    if (reportReady) {
      if (type === 1) {
        generateStockPDF(report); // Call stock report generator
      } else if (type === 2) {
        generateSalesPDF(report); // Call sales report generator
      }
    } else {
      alert("No report to download.");
    }
  };

  // Enable download only when report is ready
  useEffect(() => {
    setReportReady(report.length > 0);
  }, [report]);

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Generate Report</h2>

      {/* Report Type Selector */}
      <div className="mb-3" style={{ maxWidth: "300px" }}>
        <label>Select Report Type</label>
        <select
          className="form-select"
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)}
        >
          <option value="" disabled>
            Choose a report type
          </option>
          {reportTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Button to generate the report */}
      <button className="btn btn-primary" onClick={generateReport}>
        Generate Report
      </button>

      {/* Show download icon if report is generated */}
      {reportReady && (
        <div className="mt-5">
          <h4>Download Report</h4>
          <FaDownload
            className="text-primary fs-3 cursor-pointer"
            onClick={handleDownload}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
    </div>
  );
};

export default Report;
