
import { useEffect, useState } from "react";
import { MdDelete, MdEdit, MdClose } from "react-icons/md";

import Table from "../../components/table/Table";
import { products } from "../../data/products";

type Product = (typeof products)[number];

type ProductForm = {
  name: string;
  category: string;
  price: string;
  stock: string;
  status: Product["status"];
};

const emptyProduct: ProductForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  status: "Active" as Product["status"],
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const modalClass =
  "max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6";

const Products = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("All");

  const [productList, setProductList] = useState<Product[]>(() => {
    try {
      const savedProducts = localStorage.getItem("products");

      if (savedProducts) {
        const parsedProducts: unknown = JSON.parse(savedProducts);

        if (Array.isArray(parsedProducts)) {
          return parsedProducts as Product[];
        }
      }
    } catch {
      console.error("Could not load saved products.");
    }

    return products;
  });

  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(productList));
    } catch {
      console.error("Could not save products.");
    }
  }, [productList]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [newProduct, setNewProduct] =
    useState<ProductForm>(emptyProduct);

  // SEARCH, FILTER AND SORT
  const filteredProducts = [...productList]
    .filter((product) =>
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    )
    .filter((product) =>
      statusFilter === "All"
        ? true
        : product.status === statusFilter
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

  // PAGINATION
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const safeCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex = (safeCurrentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // SUCCESS MESSAGE
  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // VALIDATION
  const validateProduct = (
    name: string,
    category: string,
    price: number,
    stock: number
  ) => {
    if (!name.trim()) return "Product name is required.";
    if (!category.trim()) return "Category is required.";

    if (!Number.isFinite(price) || price < 0) {
      return "Please enter a valid price.";
    }

    if (!Number.isInteger(price)) {
      return "Price must be a whole number.";
    }

    if (!Number.isFinite(stock) || stock < 0) {
      return "Please enter a valid stock quantity.";
    }

    if (!Number.isInteger(stock)) {
      return "Stock must be a whole number.";
    }

    return "";
  };

  // ADD PRODUCT
  const handleAddProduct = () => {
    if (newProduct.price.trim() === "") {
      setError("Price is required.");
      return;
    }

    if (newProduct.stock.trim() === "") {
      setError("Stock is required.");
      return;
    }

    const price = Number(newProduct.price);
    const stock = Number(newProduct.stock);

    const validationError = validateProduct(
      newProduct.name,
      newProduct.category,
      price,
      stock
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    const duplicateProduct = productList.some(
      (product) =>
        product.name.toLowerCase().trim() ===
        newProduct.name.toLowerCase().trim()
    );

    if (duplicateProduct) {
      setError("A product with this name already exists.");
      return;
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name.trim(),
      category: newProduct.category.trim(),
      price,
      stock,
      status: (
        stock === 0 ? "Out of Stock" : newProduct.status
      ) as Product["status"],
    };

    setProductList((prev) => [...prev, product]);

    setNewProduct(emptyProduct);
    setError("");
    setIsAdding(false);
    setCurrentPage(1);

    showSuccess("Product added successfully!");
  };

  // EDIT PRODUCT
  const handleEditProduct = (product: Product) => {
    setSelectedProduct({ ...product });
    setIsEditing(true);
    setError("");
  };

  const handleSaveProduct = () => {
    if (!selectedProduct) return;

    const validationError = validateProduct(
      selectedProduct.name,
      selectedProduct.category,
      selectedProduct.price,
      selectedProduct.stock
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    const duplicateProduct = productList.some(
      (product) =>
        product.id !== selectedProduct.id &&
        product.name.toLowerCase().trim() ===
          selectedProduct.name.toLowerCase().trim()
    );

    if (duplicateProduct) {
      setError("A product with this name already exists.");
      return;
    }

    const updatedProduct: Product = {
      ...selectedProduct,
      name: selectedProduct.name.trim(),
      category: selectedProduct.category.trim(),
      status: (
        selectedProduct.stock === 0
          ? "Out of Stock"
          : selectedProduct.status
      ) as Product["status"],
    };

    setProductList((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      )
    );

    setIsEditing(false);
    setSelectedProduct(null);
    setError("");

    showSuccess("Product updated successfully!");
  };

  // DELETE PRODUCT
  const handleDeleteProduct = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setProductList((prev) =>
      prev.filter((product) => product.id !== id)
    );

    showSuccess("Product deleted successfully!");
  };

  // CLOSE MODALS
  const closeAddModal = () => {
    setIsAdding(false);
    setNewProduct(emptyProduct);
    setError("");
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setError("");
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div
          role="status"
          className="fixed right-4 top-4 z-[60] max-w-[calc(100vw-2rem)] rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg"
        >
          {successMessage}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and organize your products.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setIsAdding(true);
          }}
          className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          + Add Product
        </button>
      </div>

      {/* SEARCH, SORT AND FILTER */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className={inputClass}
        />

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
          className={inputClass}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="stock">Sort by Stock</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className={inputClass}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* PRODUCT COUNT */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
        <p>
          Showing {currentProducts.length} of {filteredProducts.length}{" "}
          products
        </p>

        <p>
          Total products:{" "}
          <span className="font-semibold text-slate-800">
            {productList.length}
          </span>
        </p>
      </div>

      {/* PRODUCTS TABLE */}
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
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <tr
              key={product.id}
              className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                {product.name}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                {product.category}
              </td>

              <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                ${product.price.toLocaleString()}
              </td>

              <td className="px-6 py-4 text-sm">
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

              <td className="px-6 py-4">
                <span
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
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

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditProduct(product)}
                    aria-label={`Edit ${product.name}`}
                    className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                  >
                    <MdEdit size={19} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.id)}
                    aria-label={`Delete ${product.name}`}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-800"
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
              colSpan={6}
              className="px-4 py-12 text-center text-sm text-slate-500"
            >
              No products found.
            </td>
          </tr>
        )}
      </Table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.max(page - 1, 1))
            }
            disabled={safeCurrentPage === 1}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            Previous
          </button>

          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`rounded-lg px-3 py-2 text-sm transition sm:px-4 ${
                safeCurrentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-slate-300 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(page + 1, totalPages)
              )
            }
            disabled={safeCurrentPage === totalPages}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          >
            Next
          </button>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {isEditing && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">
          <div className={modalClass}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Edit Product
              </h2>

              <button
                type="button"
                onClick={closeEditModal}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <MdClose size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={selectedProduct.name}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      name: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  value={selectedProduct.category}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      category: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    Number.isNaN(selectedProduct.price)
                      ? ""
                      : selectedProduct.price
                  }
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      price:
                        e.target.value === ""
                          ? NaN
                          : Number(e.target.value),
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    Number.isNaN(selectedProduct.stock)
                      ? ""
                      : selectedProduct.stock
                  }
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      stock:
                        e.target.value === ""
                          ? NaN
                          : Number(e.target.value),
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
                  value={selectedProduct.status}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      status: e.target.value as Product["status"],
                    })
                  }
                  className={inputClass}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of Stock">Out of Stock</option>
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
                onClick={closeEditModal}
                className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProduct}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">
          <div className={modalClass}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Add Product
              </h2>

              <button
                type="button"
                onClick={closeAddModal}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <MdClose size={22} />
              </button>
            </div>

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
                className={inputClass}
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
                className={inputClass}
              />

              <input
                type="number"
                min="0"
                step="1"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: e.target.value,
                  })
                }
                className={inputClass}
              />

              <input
                type="number"
                min="0"
                step="1"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: e.target.value,
                  })
                }
                className={inputClass}
              />

              <select
                value={newProduct.status}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    status: e.target.value as Product["status"],
                  })
                }
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
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
                onClick={closeAddModal}
                className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddProduct}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
