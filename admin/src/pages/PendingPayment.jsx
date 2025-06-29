import { FiGrid, FiFileText, FiShoppingCart, FiMessageSquare, FiArchive, FiUsers, FiLogOut } from "react-icons/fi";
import Sidebar from "../components/Sidebar";


const PendingPayment = () => {
  // Triggered when the logout function is called (currently only shows alert)
  const handleLogout = () => {
    alert("Logging out...");
  };

  // Triggered when clicking the "Mark as Paid" button (currently only shows alert)
  const handleMarkAsPaid = () => {
    alert("Marking payments as paid...");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Main Content Area */}
      <div className="flex-grow-1 p-4">
        <h4 className="fw-bold mb-4">Pending Payments</h4>

        {/* Payments Table */}
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
                    {/* Split status by "|" to display multiple badges */}
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

        {/* Action Button */}
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
