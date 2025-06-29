import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="d-flex">
      <div style={{ width: "300px" }}>
        <Sidebar />
      </div>
      <div className="flex-grow-1 d-flex flex-column">
        <Header />
        <main className="px-4 bg-white" style={{ maxHeight: "100vh" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
