import { MdNotificationsNone } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-white px-3 sm:px-6">
      {/* Search */}
      <div className="flex min-w-0 w-full max-w-xs items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
       <span className="shrink-0 text-slate-500">
  <FiSearch size={20} />
</span>

        <input
          type="text"
          placeholder="Search..."
          className="w-full min-w-0 bg-transparent text-sm outline-none"
        />
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-slate-600 transition hover:text-blue-600"
        >
          <MdNotificationsNone size={26} />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white sm:h-10 sm:w-10">
            Z
          </div>

          <div className="hidden sm:block">
            <p className="font-semibold text-gray-800">Zahra</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;