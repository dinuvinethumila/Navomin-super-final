import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/Dashboardlayout";

import Dashboard from "./pages/Dashboard.jsx";
import PreOrder from "./pages/PreOrder.jsx";
import NormalOrder from "./pages/NormalOrder.jsx";
import Billing from "./pages/Billing.jsx";
import CreditProfile from "./pages/CreditProfile.jsx";
import PendingPayment from "./pages/PendingPayment.jsx";
import Inventory from "./pages/Inventory.jsx";
import Report from "./pages/Report.jsx";
import Login from "./pages/Login.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login route is NOT nested inside dashboard layout */}
        <Route path="/login" element={<Login />} />

        {/* All other routes wrapped in the admin layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="preOrders" element={<PreOrder />} />
          <Route path="normalOrders" element={<NormalOrder />} />
          <Route path="billing" element={<Billing />} />
          <Route path="creditProfile" element={<CreditProfile />} />
          <Route path="pendingPayments" element={<PendingPayment />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Report />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
