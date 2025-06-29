// Importing reusable components
import Sidebar from "./Sidebar";
import Header from "./Header";

// `Outlet` is used to render child routes inside this layout
import { Outlet } from "react-router-dom";

// Layout component for dashboard pages
const DashboardLayout = () => {
  return (
    <div className="d-flex"> {/* Flex container to place Sidebar and main content side by side */}
      
      {/* Sidebar section with fixed width */}
      <div style={{ width: "300px" }}>
        <Sidebar />
      </div>

      {/* Main content section that expands to fill remaining space */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top header/navigation bar */}
        <Header />

        {/* Main page content area for nested routes */}
        <main className="px-4 bg-white" style={{ maxHeight: "100vh" }}>
          <Outlet /> {/* This renders the component of the current child route */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
