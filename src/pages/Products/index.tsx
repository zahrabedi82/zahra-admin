
import { useState } from "react";
import Table from "../../components/table/Table";
import { products } from "../../data/products";
import { MdDelete, MdEdit } from "react-icons/md";

const Products = () => {
  const [search, setSearch] = useState("");

  const [productList, setProductList] = useState(products);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

const [selectedProduct, setSelectedProduct] = useState<
  (typeof products)[0] | null
>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active" as (typeof products)[0]["status"],
  });

  // Search products
  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Add product
  const handleAddProduct = () => {
    if (
      !newProduct.name.trim() ||
      !newProduct.category.trim() ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      status: newProduct.status,
    };

    setProductList([...productList, product]);

    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "Active" as (typeof products)[0]["status"],
    });

    setIsAdding(false);
  };
const handleSaveProduct = () => {
  if (!selectedProduct) return;

  setProductList(
    productList.map((product) =>
      product.id === selectedProduct.id
        ? selectedProduct
        : product,
    ),
  );

  setIsEditing(false);
  setSelectedProduct(null);
};
  // Delete product
const handleDeleteProduct = (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmed) return;

  setProductList(
    productList.filter((product) => product.id !== id),
  );
};
const handleEditProduct = (product: (typeof products)[0]) => {
  setSelectedProduct(product);
  setIsEditing(true);
};
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>

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
          "Actions",
        ]}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <tr
              key={product.id}
              className="border-b transition hover:bg-slate-50"
            >
              {/* Name */}
              <td className="px-6 py-4">
                {product.name}
              </td>

              {/* Category */}
              <td className="px-6 py-4">
                {product.category}
              </td>

              {/* Price */}
              <td className="px-6 py-4">
                ${product.price}
              </td>

              {/* Stock */}
              <td className="px-6 py-4">
                {product.stock}
              </td>

              {/* Status */}
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

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
              <button
  onClick={() => handleEditProduct(product)}
  className="text-blue-600 hover:text-blue-800"
>
  <MdEdit size={20} />
</button>

                  <button
                    onClick={() =>
                      handleDeleteProduct(product.id)
                    }
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
            <td
              colSpan={6}
              className="py-8 text-center text-gray-500"
            >
              No products found.
            </td>
          </tr>
        )}
      </Table>
      {/* Edit Product Modal */}
{isEditing && selectedProduct && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
      <h2 className="mb-6 text-2xl font-bold">
        Edit Product
      </h2>

      <div className="space-y-4">
        {/* Name */}
        <input
          type="text"
          value={selectedProduct.name}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              name: e.target.value,
            })
          }
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
        />

        {/* Category */}
        <input
          type="text"
          value={selectedProduct.category}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              category: e.target.value,
            })
          }
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
        />

        {/* Price */}
        <input
          type="number"
          value={selectedProduct.price}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              price: Number(e.target.value),
            })
          }
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
        />

        {/* Stock */}
        <input
          type="number"
          value={selectedProduct.stock}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              stock: Number(e.target.value),
            })
          }
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
        />

        {/* Status */}
        <select
          value={selectedProduct.status}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              status:
                e.target.value as (typeof products)[0]["status"],
            })
          }
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => {
            setIsEditing(false);
            setSelectedProduct(null);
          }}
          className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Cancel
        </button>

   <button
  onClick={handleSaveProduct}
  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
>
  Save
</button>
      </div>
    </div>
  </div>
)}

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold">
              Add Product
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
              />

              {/* Category */}
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
              />

              {/* Price */}
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
              />

              {/* Stock */}
              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
              />

              {/* Status */}
              <select
                value={newProduct.status}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    status:
                      e.target.value as (typeof products)[0]["status"],
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsAdding(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleAddProduct}
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
