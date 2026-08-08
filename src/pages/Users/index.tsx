import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Table from "../../components/table/Table";
import { users } from "../../data/users";

const Users = () => {
  const [search, setSearch] = useState("");

  const [userList, setUserList] = useState(users);

  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null,
  );

  const [isEditing, setIsEditing] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });
  const [error, setError] = useState("");
  const filteredUsers = userList.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    setUserList(userList.filter((user) => user.id !== id));
  };

  const handleEdit = (user: (typeof users)[0]) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedUser) return;

    setUserList(
      userList.map((user) =>
        user.id === selectedUser.id ? selectedUser : user,
      ),
    );

    setSelectedUser(null);
    setIsEditing(false);
  };
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
    status: "Active",
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
};
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>

        <button
          onClick={() => setIsAdding(true)}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
        >
          + Add User
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-lg border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Table headers={["Name", "Email", "Role", "Status", "Actions"]}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <tr key={user.id} className="border-b hover:bg-slate-50 transition">
              <td className="px-6 py-4">{user.name}</td>

              <td className="px-6 py-4">{user.email}</td>

              <td className="px-6 py-4">{user.role}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : user.status === "Inactive"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <MdEdit size={20} />
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="py-8 text-center text-gray-500">
              No users found.
            </td>
          </tr>
        )}
      </Table>
      {/* Edit Modal */}
      {isEditing && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold">Edit User</h2>

            <div className="space-y-4">
              {error && (
  <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600">
    {error}
  </p>
)}
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>

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

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>

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
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedUser(null);
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

      {/* Add User Modal */}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold">Add User</h2>

            <div className="space-y-4">
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
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAdding(false)}
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
