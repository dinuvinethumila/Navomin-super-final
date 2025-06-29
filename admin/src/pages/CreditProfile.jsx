import { FiGrid, FiFileText, FiShoppingCart, FiMessageSquare, FiArchive, FiUsers, FiLogOut } from "react-icons/fi";
// import Image1 from "./assets/user1.jpg"; // Replace with actual image paths
// import Image2 from "./assets/user2.jpg";
// import Image3 from "./assets/user3.jpg";

const customers = [
  {
    id: 1,
    name: "Dayal",
    phone: "070-67059-3",
    date: "2023-11-05 08:45:00",
    // image: Image1,
  },
  {
    id: 2,
    name: "Selawathi",
    phone: "078-5698734",
    date: "2023-11-05 09:15:00",
    // image: Image2,
  },
  {
    id: 3,
    name: "Hemal",
    phone: "071-45769223",
    date: "2023-11-05 09:45:00",
    // image: Image3,
  },
];

const CreditProfile = () => {
  const handleLogout = () => {
    alert("Logging out...");
  };

  const handleAddProfile = () => {
    alert("Profile added!");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">

        {/* Outstanding Balances */}
        <h4 className="fw-bold mb-4">Customers with Outstanding Balances</h4>

        <div className="mb-5">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="d-flex align-items-center justify-content-between border p-3 mb-2 rounded"
            >
              <div className="d-flex align-items-center">
                <img
                  src={customer.image}
                  alt={customer.name}
                  style={{ width: 40, height: 40, borderRadius: "50%", marginRight: "12px" }}
                />
                <div>
                  <div className="fw-bold">{customer.name}</div>
                  <small className="text-muted">{customer.phone}</small>
                </div>
              </div>
              <div className="text-muted">{customer.date}</div>
            </div>
          ))}
        </div>

        {/* Add New Credit Profile */}
        <div>
          <h5 className="fw-bold mb-3">Add New Credit Profile</h5>
          <div className="mb-2">
            <input type="text" className="form-control mb-2" placeholder="Customer Name" />
            <input type="text" className="form-control mb-2" placeholder="Phone Number" />
            <button className="btn btn-primary" onClick={handleAddProfile}>
              + Add Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditProfile;
