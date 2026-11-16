import {
  MdPeople,
  MdInventory,
  MdShoppingCart,
  MdAttachMoney,
} from "react-icons/md";

import StatCard from "../components/dashboard/StatCard";

const Dashboard = () => {
  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:mb-8 sm:text-3xl">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <StatCard
          title="Users"
          value="8,420"
          icon={<MdPeople />}
        />

        <StatCard
          title="Products"
          value="245"
          icon={<MdInventory />}
        />

        <StatCard
          title="Orders"
          value="120"
          icon={<MdShoppingCart />}
        />

        <StatCard
          title="Revenue"
          value="$24,500"
          icon={<MdAttachMoney />}
        />
      </div>
    </div>
  );
};

export default Dashboard;