import React, { useState, useEffect } from "react";
import AdminLayout from "../../common/layouts/AdminLayout";
import axios from "axios";
import { Pencil, Trash } from "react-bootstrap-icons";
import { BaseUrl } from "../../common/BaseUrl";

const defaultForm = {
  name: "",
  price: "",
  qty: "",
  description: "",
  status: 1,
  is_trending: 0,
  is_limited: 0,
  category_id: "",
  brand_id: "",
};

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDeletedId, setConfirmDeleteId] = useState(null);

  const fetchProducts = async (page = 1) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;
      const res = await axios.get(
        `http://localhost:8000/api/products?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data.data.data || []);
      setTotalPages(res.data.data.last_page || 1);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;
      const res = await axios.get("http://localhost:8000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;
      const res = await axios.get("http://localhost:8000/api/brands", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(res.data.data || []);
    } catch (err) {
      console.error("Fetch brands error:", err);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    fetchCategories();
    fetchBrands();
  }, [currentPage]);

  const handleModalShow = (product = null) => {
    if (product) {
      setEditMode(true);
      setCurrentId(product.id);
      setForm({
        name: product.name,
        price: product.price,
        qty: product.qty,
        description: product.description,
        status: product.status,
        is_trending: product.is_trending,
        is_limited: product.is_limited,
        category_id: product.category_id,
        brand_id: product.brand_id,
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setForm(defaultForm);
    }
    setImage(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setForm(defaultForm);
    setImage(null);
    setEditMode(false);
    setCurrentId(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!adminInfo || !adminInfo.token) {
      console.error("Authentication token missing.");
      return;
    }
    const token = adminInfo.token;
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append("image", image);

    try {
      if (editMode) {
        await axios.post(
          `http://localhost:8000/api/admin/products/${currentId}?_method=PUT`,
          formData,
          config
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/admin/products",
          formData,
          config
        );
      }
      handleModalClose();
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;
      await axios.delete(`http://localhost:8000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    
  };

  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage > 1) {
      pages.push(
        <li className="page-item" key="prev">
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          className={`page-item ${i === currentPage ? "active" : ""}`}
          key={i}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <li className="page-item" key="next">
          <button
            className="page-link"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      );
    }

    return <ul className="pagination justify-content-center">{pages}</ul>;
  };

  return (
    <AdminLayout>
      <h2 className="mb-4">All Products</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => handleModalShow()}
      >
        + Create New
      </button>

      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Trending</th>
              <th>Limited</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {item.image && (
                    <img
                      src={`${BaseUrl}${item.image}`}
                      alt={item.name}
                      style={{ width: "100px", height: "60px" }}
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
                <td>
                  {categories.find((c) => c.id === item.category_id)?.name ||
                    "N/A"}
                </td>
                <td>
                  {brands.find((b) => b.id === item.brand_id)?.name || "N/A"}
                </td>
                <td>{item.status === 1 ? "Active" : "Inactive"}</td>
                <td>{item.is_trending === 1 ? "Trending" : "Not"}</td>
                <td>{item.is_limited === 1 ? "Limited" : "Not"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleModalShow(item)}
                  >
                    <Pencil />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setConfirmDeleteId(item.id)}
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5>{editMode ? "Edit Product" : "Create Product"}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                  ></button>
                </div>
                <div className="modal-body">
                  {["name", "price", "qty", "description"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label text-capitalize">
                        {field}
                      </label>
                      <input
                        type={
                          field === "price" || field === "qty"
                            ? "number"
                            : "text"
                        }
                        name={field}
                        className="form-control"
                        value={form[field]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      name="category_id"
                      className="form-select"
                      value={form.category_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Brand</label>
                    <select
                      name="brand_id"
                      className="form-select"
                      value={form.brand_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Brand --</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={form.status}
                        onChange={handleChange}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label">Trending</label>
                      <select
                        name="is_trending"
                        className="form-select"
                        value={form.is_trending}
                        onChange={handleChange}
                      >
                        <option value={1}>Trending</option>
                        <option value={0}>Not Trending</option>
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label">Limited</label>
                      <select
                        name="is_limited"
                        className="form-select"
                        value={form.is_limited}
                        onChange={handleChange}
                      >
                        <option value={1}>Limited</option>
                        <option value={0}>Not Limited</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    {editMode ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmDeletedId && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setConfirmDeleteId(null)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this product?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleDelete(confirmDeletedId);
                    setConfirmDeleteId(null);
                  }}
                >
                  Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Product;
