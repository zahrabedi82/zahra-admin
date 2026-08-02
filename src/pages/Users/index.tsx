import Table from "../../components/table/Table";

const Users = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Users
      </h1>

      <Table
        headers={[
          "Name",
          "Email",
          "Role",
          "Status",
        ]}
      >
        <tr>
          <td className="px-6 py-4">Zahra Abedi</td>
          <td className="px-6 py-4">zahra@email.com</td>
          <td className="px-6 py-4">Admin</td>
          <td className="px-6 py-4">Active</td>
        </tr>

        <tr>
          <td className="px-6 py-4">John Smith</td>
          <td className="px-6 py-4">john@email.com</td>
          <td className="px-6 py-4">User</td>
          <td className="px-6 py-4">Inactive</td>
        </tr>
      </Table>
    </div>
  );
};

export default Users;