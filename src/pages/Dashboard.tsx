import {
  MdPeople,
  MdInventory,
  MdShoppingCart,
  MdAttachMoney,
} from "react-icons/md";

import StatCard from "../components/dashboard/StatCard";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

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