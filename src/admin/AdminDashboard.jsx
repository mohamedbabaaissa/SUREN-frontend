import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, normalizeProduct } from "../lib/api";

function AdminDashboard() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      revenue: [""],
      orders: "",
      appointments: 0,
      customers: 0,
    },
    recentOrders: [],
    upcomingAppointments: [],
  });

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // PRODUCT FORM

  const [product, setProduct] = useState({
    name: "",
    price: "",
    gender: "",
    category: "clothing",
    stock: "",
    images: [],
    description: "",
  });

  // LOAD DASHBOARD

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setDashboardLoading(true);
        setDashboardError("");

        const data = await apiFetch("/dashboard");

        setDashboardData({
          stats: data.stats || {
            revenue: 0,
            orders: 0,
            appointments: 0,
            customers: 0,
          },

          recentOrders: data.recentOrders || [],

          upcomingAppointments: data.upcomingAppointments || [],
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // LOAD PRODUCTS

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await apiFetch("/products?page=1&limit=100");
      setProducts((data.products || []).map(normalizeProduct));
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // DELETE PRODUCT

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/products/${productId}`, {
        method: "DELETE",
      });

      setProducts((prev) =>
        prev.filter((item) => (item._id || item.id) !== productId),
      );

      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Delete product error:", error);
      alert(error.message || "Could not delete product.");
    }
  };

  // HANDLE NORMAL INPUT

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // HANDLE IMAGE INPUT

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Maximum 4 images
    if (files.length > 4) {
      alert("You can upload a maximum of 4 images.");
      e.target.value = "";
      return;
    }

    // Make sure only images are selected
    const invalidFile = files.find((file) => !file.type.startsWith("image/"));

    if (invalidFile) {
      alert("Please select image files only.");
      e.target.value = "";
      return;
    }

    setProduct((prev) => ({
      ...prev,
      images: files,
    }));
  };

  // REMOVE SELECTED IMAGE

  const handleRemoveImage = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // CREATE PRODUCT

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!product.gender) {
        alert("Please select Women, Men, or Unisex.");
        return;
      }

      // price is valid
      const price = Number(product.price);

      if (Number.isNaN(price) || price < 0) {
        alert("Please enter a valid price.");
        return;
      }

      const stock = Number(product.stock);

      if (!Number.isInteger(stock) || stock < 0) {
        alert("Please enter a valid stock quantity.");
        return;
      }

      // Make sure at least one image exists
      if (product.images.length === 0) {
        alert("Please select at least one product image.");
        return;
      }

      // Max 4 images
      if (product.images.length > 4) {
        alert("You can upload a maximum of 4 images.");
        return;
      }

      // CREATE FORMDATA

      const formData = new FormData();

      formData.append("name", product.name.trim());

      formData.append("price", price);

      formData.append("gender", product.gender);

      formData.append("category", product.category);

      formData.append("description", product.description.trim());

      formData.append("stock", stock);

      formData.append("featured", false);

      // Add all images
      product.images.forEach((file) => {
        formData.append("images", file);
      });

      // Debug
      console.log("PRODUCT BEING SENT:", {
        name: product.name,
        price,
        gender: product.gender,
        category: product.category,
        images: product.images,
        description: product.description,
        stock,
      });

      // SEND TO BACKEND

      await apiFetch("/products", {
        method: "POST",
        body: formData,
      });

      // Success
      alert("Product added successfully!");
      await loadProducts();

      // RESET FORM

      setProduct({
        name: "",
        price: "",
        gender: "",
        category: "clothing",
        stock: "",
        images: [],
        description: "",
      });

      // Close modal
      setIsAddProductOpen(false);
    } catch (error) {
      console.error("Failed to create product:", error);

      alert(error.message || "Could not create product.");
    }
  };

  return (
    <>
      {/* PAGE HEADER */}

      <div className="admin-page-header admin-page-header-row">
        <div>
          <h1>Dashboard</h1>

          <p>Overview of revenue, orders, and client activity across SUREN.</p>
        </div>

        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => setIsAddProductOpen(true)}
        >
          <i className="fa-solid fa-plus"></i>
          Add Product
        </button>
      </div>

      {/* ==============================
          DASHBOARD ERROR
      ============================== */}

      {dashboardError && (
        <div className="admin-empty-state">{dashboardError}</div>
      )}

      {/* ==============================
          STATS
      ============================== */}

      <div className="admin-stats">
        {/* REVENUE

        <div className="admin-stat-card dark">

          <div className="admin-stat-label">
            Revenue
          </div>

          <div className="admin-stat-value">
            $
            {Number(
              dashboardData.stats.revenue || 0
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div> 

        </div>*/}

        {/* ORDERS 

        <div className="admin-stat-card">

          <div className="admin-stat-label">
            Orders
          </div>

          <div className="admin-stat-value">
            {dashboardData.stats.orders || 0}
          </div>
          

        </div> */}

        {/* APPOINTMENTS

        <div className="admin-stat-card">

          <div className="admin-stat-label">
            Appointments
          </div>

          <div className="admin-stat-value">
            {dashboardData.stats.appointments || 0}
          </div>

        </div> */}

        {/* CUSTOMERS 

        <div className="admin-stat-card">

          <div className="admin-stat-label">
            Customers
          </div>

          <div className="admin-stat-value">
            {dashboardData.stats.customers || 0}
          </div>

        </div>*/}
      </div>

      {/* PRODUCT MANAGEMENT */}

      <div className="admin-panel admin-products-panel">
        <div className="admin-panel-heading-row">
          <div>
            <h2>Product List</h2>
            <p>Manage your catalogue and stock quantities.</p>
          </div>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={loadProducts}
          >
            <i className="fa-solid fa-rotate" />
            Refresh
          </button>
        </div>

        {productsLoading ? (
          <p className="admin-empty-state">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="admin-empty-state">No products found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table admin-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Gender</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => {
                  const id = item._id || item.id;
                  const image = item.images?.[0] || item.image || "";

                  return (
                    <tr key={id}>
                      <td>
                        <div className="admin-product-cell">
                          {image ? (
                            <img
                              src={image}
                              alt={item.name}
                              className="admin-product-thumb"
                              loading="lazy"
                            />
                          ) : (
                            <div className="admin-product-thumb admin-product-thumb-empty">
                              <i className="fa-regular fa-image" />
                            </div>
                          )}
                          <span>
                            {item.name || item.title || "Untitled Product"}
                          </span>
                        </div>
                      </td>
                      <td>{item.category || "—"}</td>
                      <td>{item.gender || "—"}</td>
                      <td>${Number(item.price || 0).toFixed(2)}</td>
                      <td>
                        <span
                          className={
                            Number(item.stock) === 0
                              ? "stock-badge out"
                              : "stock-badge"
                          }
                        >
                          {Number(item.stock) === 0
                            ? "Unavailable"
                            : item.stock}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => handleDeleteProduct(id)}
                        >
                          <i className="fa-regular fa-trash-can" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TWO COLUMN SECTION */}

      <div className="admin-two-col">
        {/* ==============================
            RECENT ORDERS
        ============================== */}

        <div className="admin-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Recent Orders</h2>

            <Link to="/admin/orders" className="admin-row-link">
              View all
            </Link>
          </div>

         
        </div>

        {/* ==============================
            APPOINTMENTS
        ============================== */}

        {/* <div className="admin-panel">
           <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>Appointments</h2>

            <Link to="/admin/bespoke" className="admin-row-link">
              View all
            </Link>
          </div>

          {dashboardData.upcomingAppointments.length === 0 ? (
            <p className="admin-empty-state">
              No appointments yet. Connect your scheduling API to display data
              here.
            </p>
          ) : (
            <div className="appointment-list">
              {dashboardData.upcomingAppointments.map((ap) => (
                <div className="appointment-item" key={ap._id}>
                  <img
                    src={
                      ap.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        ap.user?.name || "Client",
                      )}`
                    }
                    alt={ap.user?.name || "Client"}
                    loading="lazy"
                    decoding="async"
                    className="appointment-avatar"
                  />

                  <div className="appointment-info">
                    <div className="appointment-name">
                      {ap.user?.name || ap.user?.email || "Unknown"}
                    </div>

                    <div className="appointment-meta">
                      {ap.type} ·{" "}
                      {ap.date ? new Date(ap.date).toLocaleDateString() : "—"}
                    </div>
                  </div>

                  <span className={`status-badge status-${ap.status}`}>
                    {ap.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div> 

      {/* ==============================
          ADD PRODUCT MODAL
      ============================== */}

      {isAddProductOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            {/* MODAL HEADER */}

            <div className="admin-modal-header">
              <h2>Add New Product</h2>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsAddProductOpen(false)}
              >
                &times;
              </button>
            </div>

            {/* PRODUCT FORM */}

            <form onSubmit={handleAddProductSubmit} className="admin-form">
              {/* ==============================
                  PRODUCT NAME
              ============================== */}

              <div className="form-group">
                <label htmlFor="prodName">Product Name</label>

                <input
                  type="text"
                  id="prodName"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Silk Evening Gown"
                />
              </div>

              {/* ==============================
                  GENDER
              ============================== */}

              <div className="form-group">
                <label>Department / Target</label>

                <div className="form-radio-group">
                  {/* WOMEN */}

                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="women"
                      checked={product.gender === "women"}
                      onChange={handleInputChange}
                    />
                    Women
                  </label>

                  {/* MEN */}

                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="men"
                      checked={product.gender === "men"}
                      onChange={handleInputChange}
                    />
                    Men
                  </label>

                  {/* UNISEX */}

                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="unisex"
                      checked={product.gender === "unisex"}
                      onChange={handleInputChange}
                    />
                    Unisex
                  </label>
                </div>
              </div>

              {/* ==============================
                  PRICE + CATEGORY
              ============================== */}

              <div className="form-group-row">
                {/* PRICE */}

                <div className="form-group">
                  <label htmlFor="prodPrice">Price ($)</label>

                  <input
                    type="number"
                    id="prodPrice"
                    name="price"
                    step="0.01"
                    min="0"
                    value={product.price}
                    onChange={handleInputChange}
                    required
                    placeholder="299.00"
                  />
                </div>

                {/* CATEGORY */}

                <div className="form-group">
                  <label htmlFor="prodCategory">Category</label>

                  <select
                    id="prodCategory"
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                  >
                    <option value="clothing">Clothing</option>

                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              {/* ==============================
                  STOCK QUANTITY
              ============================== */}

              <div className="form-group">
                <label htmlFor="prodStock">Stock Quantity</label>

                <input
                  type="number"
                  id="prodStock"
                  name="stock"
                  min="0"
                  step="1"
                  value={product.stock}
                  onChange={handleInputChange}
                  required
                  placeholder="20"
                />
              </div>

              {/* ==============================
                  PRODUCT IMAGES
              ============================== */}

              <div className="form-group">
                <label htmlFor="prodImages">Product Images</label>

                <input
                  type="file"
                  id="prodImages"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />

                <small>Select up to 4 images from your computer.</small>

                {/* IMAGE PREVIEWS */}

                {product.images.length > 0 && (
                  <div
                    className="selected-images"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "10px",
                      marginTop: "15px",
                    }}
                  >
                    {product.images.map((file, index) => (
                      <div
                        className="selected-image"
                        key={`${file.name}-${index}`}
                        style={{
                          position: "relative",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            width: "25px",
                            height: "25px",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            background: "#000",
                            color: "#fff",
                          }}
                        >
                          &times;
                        </button>

                        <span
                          style={{
                            display: "block",
                            marginTop: "5px",
                            fontSize: "12px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ==============================
                  DESCRIPTION
              ============================== */}

              <div className="form-group">
                <label htmlFor="prodDesc">Description</label>

                <textarea
                  id="prodDesc"
                  name="description"
                  rows="3"
                  value={product.description}
                  onChange={handleInputChange}
                  placeholder="Enter details..."
                />
              </div>

              {/* ==============================
                  BUTTONS
              ============================== */}

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsAddProductOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="admin-btn-primary">
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
