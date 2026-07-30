
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdInventory,
  MdShoppingCart,
  MdSettings,
  MdLogout,
} from "react-icons/md";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          Zahra
          <span className="text-blue-400">Admin</span>
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-700 transition"
            >
              <MdDashboard size={22} />
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/users"
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-700 transition"
            >
              <MdPeople size={22} />
              Users
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/products"
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-700 transition"
            >
              <MdInventory size={22} />
              Products
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/orders"
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-700 transition"
            >
              <MdShoppingCart size={22} />
              Orders
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/settings"
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-700 transition"
            >
              <MdSettings size={22} />
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg p-3 transition hover:bg-red-600">
          <MdLogout size={22} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;