import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { MdDelete, MdEdit } from "react-icons/md";

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

type OrderForm = {
  customer: string;
  email: string;
  product: string;
  amount: string;
  date: string;
};

const initialOrders: Order[] = [
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

const emptyForm: OrderForm = {
  customer: "",
  email: "",
  product: "",
  amount: "",
  date: "",
};

const Orders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<OrderForm>(emptyForm);

  const [orderList, setOrderList] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem("orders");

    if (savedOrders) {
      try {
        const parsedOrders: unknown = JSON.parse(savedOrders);

        if (Array.isArray(parsedOrders)) {
          return parsedOrders as Order[];
        }
      } catch {
        return initialOrders;
      }
    }

    return initialOrders;
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orderList));
  }, [orderList]);

  const ordersPerPage = 5;

  const filteredOrders = orderList.filter((order) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm) ||
      order.email.toLowerCase().includes(searchTerm) ||
      order.product.toLowerCase().includes(searchTerm);

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
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "Processing") return "bg-blue-100 text-blue-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsEditing(false);
  };

  const handleStatusChange = (id: number, status: OrderStatus) => {
    setOrderList((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    );

    setSelectedOrder((prevOrder) =>
      prevOrder?.id === id ? { ...prevOrder, status } : prevOrder,
    );
  };

  const handleDeleteOrder = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?",
    );

    if (!confirmed) return;

    setOrderList((prevOrders) =>
      prevOrders.filter((order) => order.id !== id),
    );

    setSelectedOrder((prevOrder) =>
      prevOrder?.id === id ? null : prevOrder,
    );
    setIsEditing(false);
    setCurrentPage(1);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditForm({
      customer: order.customer,
      email: order.email,
      product: order.product,
      amount: String(order.amount),
      date: order.date,
    });
    setIsEditing(true);
  };

  const handleSaveOrder = () => {
    if (!selectedOrder) return;

    if (
      !editForm.customer.trim() ||
      !editForm.email.trim() ||
      !editForm.product.trim() ||
      !editForm.amount.trim() ||
      !editForm.date
    ) {
      window.alert("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      window.alert("Please enter a valid email address.");
      return;
    }

    const amount = Number(editForm.amount);

    if (!Number.isFinite(amount) || amount < 0) {
      window.alert("Amount must be a valid non-negative number.");
      return;
    }

    const updatedOrder: Order = {
      ...selectedOrder,
      customer: editForm.customer.trim(),
      email: editForm.email.trim(),
      product: editForm.product.trim(),
      amount,
      date: editForm.date,
    };

    setOrderList((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrder.id ? updatedOrder : order,
      ),
    );

    setSelectedOrder(updatedOrder);
    setIsEditing(false);
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

      {/* Search and Filter */}
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
          "Actions",
        ]}
      >
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <tr
              key={order.id}
              className="border-b transition hover:bg-slate-50"
            >
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsEditing(false);
                  }}
                  className="font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                >
                  {order.orderNumber}
                </button>
              </td>

              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-slate-800">{order.customer}</p>
                  <p className="text-sm text-slate-500">{order.email}</p>
                </div>
              </td>

              <td className="px-6 py-4">{order.product}</td>
              <td className="px-6 py-4 font-medium">${order.amount}</td>
              <td className="px-6 py-4 text-slate-600">{order.date}</td>

              <td className="px-6 py-4">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value as OrderStatus)
                  }
                  className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${getStatusStyle(
                    order.status,
                  )}`}
                  aria-label={`Change status for ${order.orderNumber}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditOrder(order)}
                    className="rounded-lg p-2 text-amber-500 transition hover:bg-amber-50 hover:text-amber-700"
                    title="Edit order"
                    aria-label={`Edit ${order.orderNumber}`}
                  >
                    <MdEdit size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(order.id)}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                    title="Delete order"
                    aria-label={`Delete ${order.orderNumber}`}
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="py-8 text-center text-slate-500">
              No orders found.
            </td>
          </tr>
        )}
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-300 px-4 py-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                type="button"
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
            type="button"
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

      {/* Order Details / Edit Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditing ? "Edit Order" : "Order Details"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedOrder.orderNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-3 py-2 text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                title="Close"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveOrder();
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="edit-customer"
                    className="mb-1 block text-sm font-medium text-slate-600"
                  >
                    Customer
                  </label>
                  <input
                    id="edit-customer"
                    type="text"
                    required
                    value={editForm.customer}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        customer: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-email"
                    className="mb-1 block text-sm font-medium text-slate-600"
                  >
                    Email
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-product"
                    className="mb-1 block text-sm font-medium text-slate-600"
                  >
                    Product
                  </label>
                  <input
                    id="edit-product"
                    type="text"
                    required
                    value={editForm.product}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        product: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-amount"
                    className="mb-1 block text-sm font-medium text-slate-600"
                  >
                    Amount ($)
                  </label>
                  <input
                    id="edit-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={editForm.amount}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-date"
                    className="mb-1 block text-sm font-medium text-slate-600"
                  >
                    Date
                  </label>
                  <input
                    id="edit-date"
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b pb-3">
                    <span className="text-sm text-slate-500">Customer</span>
                    <span className="text-right font-medium text-slate-800">
                      {selectedOrder.customer}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b pb-3">
                    <span className="text-sm text-slate-500">Email</span>
                    <span className="break-all text-right text-sm text-slate-800">
                      {selectedOrder.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b pb-3">
                    <span className="text-sm text-slate-500">Product</span>
                    <span className="text-right font-medium text-slate-800">
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

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">Status</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedOrder.id,
                          e.target.value as OrderStatus,
                        )
                      }
                      className={`cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ${getStatusStyle(
                        selectedOrder.status,
                      )}`}
                      aria-label="Change order status"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEditOrder(selectedOrder)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-white transition hover:bg-amber-600"
                  >
                    <MdEdit size={18} />
                    Edit Order
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
