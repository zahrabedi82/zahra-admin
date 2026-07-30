

import { MdNotificationsNone, MdMenu } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: NavbarProps) => {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MdMenu size={28} />
        </button>

        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-80">
          <FiSearch size={20} />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <button className="relative">
          <MdNotificationsNone size={28} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            Z
          </div>

          <div>
            <p className="font-semibold">Zahra</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
