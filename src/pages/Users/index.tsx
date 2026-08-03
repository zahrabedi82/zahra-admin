import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Table from "../../components/table/Table";
import { users } from "../../data/users";

const Users = () => {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState(users);

const filteredUsers = userList.filter((user) =>
  user.name.toLowerCase().includes(search.toLowerCase())
);
const handleDelete = (id: number) => {
  setUserList(userList.filter((user) => user.id !== id));
};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {/* Search */}
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
                  <button className="text-blue-600 hover:text-blue-800 transition">
                    <MdEdit size={20} />
                  </button>

                 <button
  onClick={() => handleDelete(user.id)}
  className="text-red-600 hover:text-red-800 transition"
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
    </div>
  );
};

export default Users;
