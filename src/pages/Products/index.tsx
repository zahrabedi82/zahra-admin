import { useState } from "react";
import Table from "../../components/table/Table";
import { products } from "../../data/products";


const Products = () => {
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
     <div className="mb-6 flex items-center justify-between">
  <h1 className="text-3xl font-bold">
    Products
  </h1>

  <button
    onClick={() => setIsAdding(true)}
    className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
  >
    + Add Product
  </button>
</div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
        />
      </div>

      {/* Products Table */}
      <Table
        headers={[
          "Name",
          "Category",
          "Price",
          "Stock",
          "Status",
        ]}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <tr
              key={product.id}
              className="border-b transition hover:bg-slate-50"
            >
              <td className="px-6 py-4">
                {product.name}
              </td>

              <td className="px-6 py-4">
                {product.category}
              </td>

              <td className="px-6 py-4">
                ${product.price}
              </td>

              <td className="px-6 py-4">
                {product.stock}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={5}
              className="py-8 text-center text-gray-500"
            >
              No products found.
            </td>
          </tr>
        )}
      </Table>
      {isAdding && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-6 text-2xl font-bold">
        Add Product
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
        />

        <input
          type="number"
          placeholder="Stock"
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

export default Products;