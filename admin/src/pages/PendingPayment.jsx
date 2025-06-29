import { FiGrid, FiFileText, FiShoppingCart, FiMessageSquare, FiArchive, FiUsers, FiLogOut } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

const payments = [
  { id: "001", name: "Siripala", date: "2023-09-01", amount: 500.0, status: "pending|urgent" },
  { id: "002", name: "Amarasiri", date: "2023-09-05", amount: 750.0, status: "pending|urgent" },
  { id: "003", name: "Rahal", date: "2023-09-10", amount: 300.0, status: "pending" },
  { id: "004", name: "emith", date: "2023-09-15", amount: 1200.0, status: "pending" },
  { id: "005", name: "Innovate LLC", date: "2023-09-20", amount: 450.0, status: "pending" },
  { id: "006", name: "Future Solutions", date: "2023-09-25", amount: 600.0, status: "pending|urgent" },
];

const PendingPayment = () => {
  const handleLogout = () => {
    alert("Logging out...");
  };

  const handleMarkAsPaid = () => {
    alert("Marking payments as paid...");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">

        <h4 className="fw-bold mb-4">Pending Payments</h4>

        {/* Table */}
        <div className="table-responsive">
          <table className="table align-middle table-bordered">
            <thead className="table-light">
              <tr>
                <th>Payment ID</th>
                <th>Customer Name</th>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td>${item.amount.toFixed(2)}</td>
                  <td>
                    {item.status.split("|").map((status, index) => (
                      <span
                        key={index}
                        className="badge bg-light text-dark border me-1"
                        style={{ fontSize: "12px" }}
                      >
                        {status}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mark as Paid Button */}
        <div className="text-start mt-3">
          <button className="btn btn-success" onClick={handleMarkAsPaid}>
            Mark as Paid
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingPayment;
