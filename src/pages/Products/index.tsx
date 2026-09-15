import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { products } from "../../data/products";
import { MdDelete, MdEdit } from "react-icons/md";

const Products = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("All");

  const [productList, setProductList] = useState<(typeof products)[0][]>(() => {
    const savedProducts = localStorage.getItem("products");

    return savedProducts ? JSON.parse(savedProducts) : products;
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(productList));
  }, [productList]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");

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

  // Search, Filter & Sort
  const filteredProducts = [...productList]
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((product) =>
      statusFilter === "All" ? true : product.status === statusFilter,
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "price") {
        return a.price - b.price;
      }

      if (sortBy === "stock") {
        return a.stock - b.stock;
      }

      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  // Add Product
  const handleAddProduct = () => {
    if (!newProduct.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!newProduct.category.trim()) {
      setError("Category is required.");
      return;
    }

    const duplicateProduct = productList.some(
      (product) =>
        product.name.toLowerCase().trim() ===
        newProduct.name.toLowerCase().trim(),
    );

    if (duplicateProduct) {
      setError("A product with this name already exists.");
      return;
    }

    if (!newProduct.price) {
      setError("Price is required.");
      return;
    }

    if (Number(newProduct.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (!newProduct.stock) {
      setError("Stock is required.");
      return;
    }

    if (Number(newProduct.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    if (!Number.isInteger(Number(newProduct.price))) {
      setError("Price must be a whole number.");
      return;
    }

    if (!Number.isInteger(Number(newProduct.stock))) {
      setError("Stock must be a whole number.");
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name.trim(),
      category: newProduct.category.trim(),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      status:
        Number(newProduct.stock) === 0 ? "Out of Stock" : newProduct.status,
    };

    setProductList([...productList, product]);

    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "Active" as (typeof products)[0]["status"],
    });

    setError("");
    setIsAdding(false);
  };

  // Edit Product
  const handleSaveProduct = () => {
    if (!selectedProduct) return;

    if (!selectedProduct.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!selectedProduct.category.trim()) {
      alert("Category is required.");
      return;
    }

    const duplicateProduct = productList.some(
      (product) =>
        product.id !== selectedProduct.id &&
        product.name.toLowerCase().trim() ===
          selectedProduct.name.toLowerCase().trim(),
    );

    if (duplicateProduct) {
      alert("A product with this name already exists.");
      return;
    }

    if (selectedProduct.price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    if (selectedProduct.stock < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    if (!Number.isInteger(selectedProduct.price)) {
      alert("Price must be a whole number.");
      return;
    }

    if (!Number.isInteger(selectedProduct.stock)) {
      alert("Stock must be a whole number.");
      return;
    }

    const updatedProduct = {
      ...selectedProduct,
      name: selectedProduct.name.trim(),
      category: selectedProduct.category.trim(),
      status:
        selectedProduct.stock === 0 ? "Out of Stock" : selectedProduct.status,
    };

    setProductList(
      productList.map((product) =>
        product.id === selectedProduct.id ? updatedProduct : product,
      ),
    );

    setIsEditing(false);
    setSelectedProduct(null);
  };

  // Delete Product
  const handleDeleteProduct = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    setProductList(productList.filter((product) => product.id !== id));
  };

  // Open Edit Modal
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
          onClick={() => {
            setError("");
            setIsAdding(true);
          }}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {/* Search, Sort & Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search products..."
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

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="stock">Sort by Stock</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Product Count */}
      <div className="mb-4 text-sm text-slate-500">
        Showing {currentProducts.length} of {filteredProducts.length} products
      </div>

      {/* Products Table */}
      <Table
        headers={["Name", "Category", "Price", "Stock", "Status", "Actions"]}
      >
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <tr
              key={product.id}
              className="border-b transition hover:bg-slate-50"
            >
              {/* Name */}
              <td className="px-6 py-4">{product.name}</td>

              {/* Category */}
              <td className="px-6 py-4">{product.category}</td>

              {/* Price */}
              <td className="px-6 py-4">${product.price}</td>

              {/* Stock */}
              <td className="px-6 py-4">
                <span
                  className={
                    product.stock === 0
                      ? "font-semibold text-red-600"
                      : product.stock < 10
                        ? "font-semibold text-yellow-600"
                        : "text-slate-700"
                  }
                >
                  {product.stock}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : product.status === "Inactive"
                        ? "bg-yellow-100 text-yellow-700"
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
                    className="text-blue-600 transition hover:text-blue-800"
                    title="Edit product"
                  >
                    <MdEdit size={20} />
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 transition hover:text-red-800"
                    title="Delete product"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="py-8 text-center text-gray-500">
              No products found.
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

      {/* Edit Product Modal */}
      {isEditing && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold">Edit Product</h2>

            <div className="space-y-4">
              <input
                type="text"
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                type="text"
                value={selectedProduct.category}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    category: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                type="number"
                value={selectedProduct.price}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <input
                type="number"
                value={selectedProduct.stock}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    stock: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={selectedProduct.status}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    status: e.target.value as (typeof products)[0]["status"],
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 transition hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveProduct}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold">Add Product</h2>

            {error && (
              <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="space-y-4">
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
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

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
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

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
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

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
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <select
                value={newProduct.status}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    status: e.target.value as (typeof products)[0]["status"],
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setError("");
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 transition hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleAddProduct}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
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
