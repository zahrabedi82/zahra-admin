
import { useState } from "react";

import {
  MdDelete,
  MdEdit,
  MdSearch,
  MdPersonAdd,
  MdClose,
} from "react-icons/md";

import Table from "../../components/table/Table";
import { users } from "../../data/users";

type User = (typeof users)[0];

const Users = () => {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState<User[]>(users);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const filteredUsers = userList.filter((user) =>
    `${user.name} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const validateUser = (name: string, email: string, role: string) => {
    if (!name.trim()) return "Please enter the user's name.";
    if (!email.trim()) return "Please enter the user's email.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!role.trim()) return "Please enter the user's role.";

    return "";
  };

  // ADD USER
  const handleAddUser = () => {
    const validationError = validateUser(
      newUser.name,
      newUser.email,
      newUser.role
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    const emailExists = userList.some(
      (user) =>
        user.email.toLowerCase() === newUser.email.trim().toLowerCase()
    );

    if (emailExists) {
      setError("This email address already exists.");
      return;
    }

    const user = {
      id: Date.now(),
      name: newUser.name.trim(),
      email: newUser.email.trim(),
      role: newUser.role.trim(),
      status: newUser.status,
    } as User;

    setUserList((prev) => [...prev, user]);

    setNewUser({
      name: "",
      email: "",
      role: "",
      status: "Active",
    });

    setError("");
    setIsAdding(false);
    showSuccess("User added successfully!");
  };

  // EDIT USER
  const handleEdit = (user: User) => {
    setSelectedUser({ ...user });
    setIsEditing(true);
    setError("");
  };

  const handleSave = () => {
    if (!selectedUser) return;

    const validationError = validateUser(
      selectedUser.name,
      selectedUser.email,
      selectedUser.role
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    const emailExists = userList.some(
      (user) =>
        user.id !== selectedUser.id &&
        user.email.toLowerCase() === selectedUser.email.trim().toLowerCase()
    );

    if (emailExists) {
      setError("This email address already exists.");
      return;
    }

    setUserList((prev) =>
      prev.map((user) =>
        user.id === selectedUser.id
          ? {
              ...selectedUser,
              name: selectedUser.name.trim(),
              email: selectedUser.email.trim(),
              role: selectedUser.role.trim(),
            }
          : user
      )
    );

    setSelectedUser(null);
    setIsEditing(false);
    setError("");
    showSuccess("User updated successfully!");
  };

  // DELETE USER
  const confirmDelete = () => {
    if (!userToDelete) return;

    setUserList((prev) =>
      prev.filter((user) => user.id !== userToDelete.id)
    );

    setUserToDelete(null);
    showSuccess("User deleted successfully!");
  };

  // MODAL
  const closeModals = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedUser(null);
    setError("");
  };

  const inputClass =
    "w-full min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const modalClass =
    "max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6";

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div
          role="status"
          className="fixed right-3 top-3 z-[60] flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg sm:right-6 sm:top-6"
        >
          <span>✓</span>
          {successMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Users
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and organize your users.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAdding(true);
            setError("");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <MdPersonAdd size={20} />
          Add User
        </button>
      </div>

      {/* SEARCH AND USER COUNT */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <MdSearch size={21} />
          </span>

          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <p className="text-sm text-slate-500">
          Total users:{" "}
          <span className="font-semibold text-slate-800">
            {userList.length}
          </span>
        </p>
      </div>

      {/* USERS TABLE */}
      <Table headers={["Name", "Email", "Role", "Status", "Actions"]}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                {user.name}
              </td>

              <td className="px-6 py-4 text-sm text-slate-600">
                {user.email}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {user.role}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Edit ${user.name}`}
                    onClick={() => handleEdit(user)}
                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                  >
                    <MdEdit size={19} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${user.name}`}
                    onClick={() => setUserToDelete(user)}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                  >
                    <MdDelete size={19} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={5}
              className="px-4 py-12 text-center text-sm text-slate-500"
            >
              No users found.
            </td>
          </tr>
        )}
      </Table>

      {/* EDIT USER MODAL */}
      {isEditing && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">
          <div className={modalClass}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Edit User
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update user information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModals}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <MdClose size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                  className={inputClass}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModals}
                className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">
          <div className={modalClass}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Add User
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the new user's information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModals}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <MdClose size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className={inputClass}
              />

              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className={inputClass}
              />

              <input
                type="text"
                placeholder="Role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className={inputClass}
              />

              <select
                value={newUser.status}
                onChange={(e) =>
                  setNewUser({ ...newUser, status: e.target.value })
                }
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModals}
                className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddUser}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">
          <div className={modalClass}>
            <h2 className="text-xl font-bold text-slate-800">
              Delete User
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {userToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
