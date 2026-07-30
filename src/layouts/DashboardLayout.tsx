import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <Navbar />
        <Sidebar />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
       

        {/* Main */}
        <main className="flex-1 bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
