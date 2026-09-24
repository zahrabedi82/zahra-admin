import { useState } from "react";
import Table from "../../components/table/Table";

type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

type Order = {
  id: number;
  orderNumber: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  date: string;
  status: OrderStatus;
};

const orders: Order[] = [
  {
    id: 1,
    orderNumber: "#ORD-1001",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    product: "Wireless Mouse",
    amount: 35,
    date: "2026-09-10",
    status: "Completed",
  },
  {
    id: 2,
    orderNumber: "#ORD-1002",
    customer: "Michael Brown",
    email: "michael@example.com",
    product: "Keyboard",
    amount: 75,
    date: "2026-09-11",
    status: "Processing",
  },
  {
    id: 3,
    orderNumber: "#ORD-1003",
    customer: "Emma Wilson",
    email: "emma@example.com",
    product: "Headphones",
    amount: 120,
    date: "2026-09-11",
    status: "Pending",
  },
  {
    id: 4,
    orderNumber: "#ORD-1004",
    customer: "James Davis",
    email: "james@example.com",
    product: "Laptop",
    amount: 1200,
    date: "2026-09-12",
    status: "Completed",
  },
  {
    id: 5,
    orderNumber: "#ORD-1005",
    customer: "Olivia Miller",
    email: "olivia@example.com",
    product: "Monitor",
    amount: 350,
    date: "2026-09-12",
    status: "Cancelled",
  },
  {
    id: 6,
    orderNumber: "#ORD-1006",
    customer: "Daniel Wilson",
    email: "daniel@example.com",
    product: "USB-C Hub",
    amount: 45,
    date: "2026-09-13",
    status: "Completed",
  },
  {
    id: 7,
    orderNumber: "#ORD-1007",
    customer: "Sophia Moore",
    email: "sophia@example.com",
    product: "Webcam",
    amount: 90,
    date: "2026-09-13",
    status: "Processing",
  },
  {
    id: 8,
    orderNumber: "#ORD-1008",
    customer: "William Taylor",
    email: "william@example.com",
    product: "Mechanical Keyboard",
    amount: 110,
    date: "2026-09-14",
    status: "Pending",
  },
  {
    id: 9,
    orderNumber: "#ORD-1009",
    customer: "Ava Anderson",
    email: "ava@example.com",
    product: "Gaming Mouse",
    amount: 60,
    date: "2026-09-14",
    status: "Completed",
  },
  {
    id: 10,
    orderNumber: "#ORD-1010",
    customer: "Noah Thomas",
    email: "noah@example.com",
    product: "Laptop Stand",
    amount: 55,
    date: "2026-09-15",
    status: "Processing",
  },
];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const ordersPerPage = 5;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const startIndex = (currentPage - 1) * ordersPerPage;

  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage,
  );

  const getStatusStyle = (status: OrderStatus) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Processing") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and track customer orders
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-16 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Order Count */}
      <div className="mb-4 text-sm text-slate-500">
        Showing {currentOrders.length} of {filteredOrders.length} orders
      </div>

      {/* Orders Table */}
      <Table
        headers={[
          "Order",
          "Customer",
          "Product",
          "Amount",
          "Date",
          "Status",
        ]}
      >
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <tr
              key={order.id}
              className="border-b transition hover:bg-slate-50"
            >
              {/* Order */}
              <td className="px-6 py-4">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                >
                  {order.orderNumber}
                </button>
              </td>

              {/* Customer */}
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-800">
                    {order.customer}
                  </p>
                  <p className="text-sm text-slate-500">{order.email}</p>
                </div>
              </td>

              {/* Product */}
              <td className="px-6 py-4">{order.product}</td>

              {/* Amount */}
              <td className="px-6 py-4 font-medium">${order.amount}</td>

              {/* Date */}
              <td className="px-6 py-4 text-slate-600">{order.date}</td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    order.status,
                  )}`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="py-8 text-center text-slate-500">
              No orders found.
            </td>
          </tr>
        )}
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-300 px-4 py-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-lg px-4 py-2 transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ),
          )}

          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-300 px-4 py-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg px-3 py-2 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-slate-500">Customer</span>
                <span className="font-medium text-slate-800">
                  {selectedOrder.customer}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-slate-500">Email</span>
                <span className="text-sm text-slate-800">
                  {selectedOrder.email}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-slate-500">Product</span>
                <span className="font-medium text-slate-800">
                  {selectedOrder.product}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-slate-500">Amount</span>
                <span className="font-semibold text-slate-800">
                  ${selectedOrder.amount}
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-slate-500">Date</span>
                <span className="text-slate-800">{selectedOrder.date}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Status</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    selectedOrder.status,
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;