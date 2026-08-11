import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Table from "../../components/table/Table";
import { users } from "../../data/users";

const Users = () => {
  // Search
  const [search, setSearch] = useState("");

  // Users list
  const [userList, setUserList] = useState(users);

  // Edit user
  const [selectedUser, setSelectedUser] = useState<
    (typeof users)[0] | null
  >(null);

  const [isEditing, setIsEditing] = useState(false);

  // Add user
  const [isAdding, setIsAdding] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });

  // Error message
  const [error, setError] = useState("");

  // Success message
  const [successMessage, setSuccessMessage] = useState("");

  // Delete confirmation
  const [userToDelete, setUserToDelete] = useState<
    (typeof users)[0] | null
  >(null);

  // Search users
  const filteredUsers = userList.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- DELETE ----------------

  const handleDelete = (user: (typeof users)[0]) => {
    setUserToDelete(user);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;

    setUserList(
      userList.filter((user) => user.id !== userToDelete.id)
    );

    setUserToDelete(null);

    setSuccessMessage("User deleted successfully!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // ---------------- EDIT ----------------

  const handleEdit = (user: (typeof users)[0]) => {
    setSelectedUser(user);
    setIsEditing(true);
    setError("");
  };

  const handleSave = () => {
    if (!selectedUser) return;

    if (!selectedUser.name.trim()) {
      setError("Please enter the user's name.");
      return;
    }

    if (!selectedUser.email.trim()) {
      setError("Please enter the user's email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(selectedUser.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!selectedUser.role.trim()) {
      setError("Please enter the user's role.");
      return;
    }

    setUserList(
      userList.map((user) =>
        user.id === selectedUser.id ? selectedUser : user
      )
    );

    setSelectedUser(null);
    setIsEditing(false);
    setError("");

    setSuccessMessage("User updated successfully!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // ---------------- ADD USER ----------------

  const handleAddUser = () => {
    if (!newUser.name.trim()) {
      setError("Please enter the user's name.");
      return;
    }

    if (!newUser.email.trim()) {
      setError("Please enter the user's email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newUser.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!newUser.role.trim()) {
      setError("Please enter the user's role.");
      return;
    }

    const user = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    };

    setUserList([...userList, user]);

    setNewUser({
      name: "",
      email: "",
      role: "",
      status: "Active",
    });

    setError("");
    setIsAdding(false);

    setSuccessMessage("User added successfully!");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // ---------------- UI ----------------

  return (
    <div>
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed right-6 top-6 z-50 rounded-lg bg-green-600 px-5 py-3 text-white shadow-lg">
          ✓ {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>

        <button
          onClick={() => {
            setIsAdding(true);
            setError("");
          }}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
        />
      </div>

      {/* Users Table */}
      <Table
        headers={[
          "Name",
          "Email",
          "Role",
          "Status",
          "Actions",
        ]}
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="border-b transition hover:bg-slate-50"
            >
              {/* Name */}
              <td className="px-6 py-4">{user.name}</td>

              {/* Email */}
              <td className="px-6 py-4">{user.email}</td>

              {/* Role */}
              <td className="px-6 py-4">{user.role}</td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 transition hover:text-blue-800"
                  >
                    <MdEdit size={20} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-red-600 transition hover:text-red-800"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={5}
              className="py-8 text-center text-gray-500"
            >
              No users found.
            </td>
          </tr>
        )}
      </Table>

      {/* ================= EDIT MODAL ================= */}

      {isEditing && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold">
              Edit User
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Name
                </label>

                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Role
                </label>

                <input
                  type="text"
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Error */}
              {error && (
                <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedUser(null);
                  setError("");
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-3 text-2xl font-bold">
              Delete User
            </h2>

            <p className="mb-6 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {userToDelete.name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD USER MODAL ================= */}

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold">
              Add User
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
              />

              {/* Role */}
              <input
                type="text"
                placeholder="Role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
              />

              {/* Status */}
              <select
                value={newUser.status}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    status: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Error */}
              {error && (
                <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setError("");
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;