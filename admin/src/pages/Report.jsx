import { useEffect, useState } from "react";
import {
  getCategory,
  getProductCategory,
  getProducts,
  getProductSize,
} from "../apis/products";
import { generateStockPDF, generateSalesPDF } from "../generatePdf";
import { getOrder, getPreOrder } from "../apis/order";
import { getUser } from "../apis/user";
import { FaDownload } from "react-icons/fa";

const reportTypes = [
  { id: 1, name: "Stocks" },
  { id: 2, name: "Sales" },
];

const Report = () => {
  const [category, setCategory] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [productSize, setProductSize] = useState([]);

  const [report, setReport] = useState([]);
  const [reportReady, setReportReady] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("");

  const [ordersData, setOrdersData] = useState([]);
  const [preOrders, setPreOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getCategory().then(setCategory).catch(console.error);
    getProductCategory().then(setProductCategory).catch(console.error);
    getProducts().then(setProducts).catch(console.error);
    getProductSize().then(setProductSize).catch(console.error);
    getOrder().then(setOrdersData).catch(console.error);
    getPreOrder().then(setPreOrders).catch(console.error);
    getUser().then(setUsers).catch(console.error);
  }, []);

  const generateReport = () => {
    const type = parseInt(selectedReportType);

    if (type === 1) {
      // Stock Report
      const result = category.map((cat) => {
        const matchedProdCats = productCategory
          .filter((pCat) => pCat.Category_ID === cat.Category_ID)
          .map((prodCat) => {
            const matchingProducts = products
              .filter((p) => p.ProductCategory_ID === prodCat.ProductCategory_ID)
              .map((p) => {
                const sizes = productSize
                  .filter((s) => s.Product_ID === p.Product_ID)
                  .map((s) => ({
                    product: p.Product_Name,
                    size: s.Size,
                    quantity: s.Stock,
                  }));
                return sizes;
              })
              .flat();

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

      setReport(result);
    } else if (type === 2) {
      // Sales Report
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

      setReport([
        { type: "Normal Order", orders: normal },
        { type: "Pre Order", orders: pre },
      ]);
    }
  };

  const handleDownload = () => {
    const type = parseInt(selectedReportType);
    if (reportReady) {
      if (type === 1) {
        generateStockPDF(report);
      } else if (type === 2) {
        generateSalesPDF(report);
      }
    } else {
      alert("No report to download.");
    }
  };

  useEffect(() => {
    setReportReady(report.length > 0);
  }, [report]);

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Generate Report</h2>

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

      <button className="btn btn-primary" onClick={generateReport}>
        Generate Report
      </button>

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
