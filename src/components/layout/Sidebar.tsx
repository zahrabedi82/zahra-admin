import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdInventory,
  MdShoppingCart,
  MdSettings,
  MdLogout,
} from "react-icons/md";

const menuItems = [
  { to: "/", label: "Dashboard", icon: MdDashboard, end: true },
  { to: "/users", label: "Users", icon: MdPeople },
  { to: "/products", label: "Products", icon: MdInventory },
  { to: "/orders", label: "Orders", icon: MdShoppingCart },
  { to: "/settings", label: "Settings", icon: MdSettings },
];

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-16 shrink-0 flex-col bg-slate-900 text-white sm:w-64">
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-700">
        <h1 className="text-xl font-bold sm:text-2xl">
          <span className="sm:hidden">Z</span>
          <span className="hidden sm:inline">
            Zahra<span className="text-blue-400">Admin</span>
          </span>
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 sm:p-4">
        <ul className="space-y-2">
          {menuItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                title={label}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-3 rounded-lg p-3 transition sm:justify-start ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`
                }
              >
                <Icon size={22} />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-slate-700 p-2 sm:p-4">
        <button
          type="button"
          title="Logout"
          className="flex w-full items-center justify-center gap-3 rounded-lg p-3 transition hover:bg-red-600 sm:justify-start"
        >
          <MdLogout size={22} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;