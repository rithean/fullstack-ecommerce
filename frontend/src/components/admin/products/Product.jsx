import React, { useState, useEffect } from "react";
import AdminLayout from "../../common/layouts/AdminLayout";
import axios from "axios";
import { Pencil, Trash } from "react-bootstrap-icons";

const defaultForm = {
  name: "",
  price: "",
  qty: "",
  description: "",
  status: 1,
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

  const getToken = () => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    return adminInfo?.token || "";
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/products", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProducts(res.data.data.data || []);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/categories", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/brands", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setBrands(res.data.data || []);
    } catch (err) {
      console.error("Fetch brands error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

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
    e.preventDefault();
    const token = getToken();
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
      fetchProducts();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
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
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price}</td>
                <td>
                  {categories.find((cat) => cat.id === item.category_id)
                    ?.name || "N/A"}
                </td>
                <td>
                  {brands.find((b) => b.id === item.brand_id)?.name || "N/A"}
                </td>
                <td>{item.status === 1 ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleModalShow(item)}
                  >
                    <Pencil />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  <div className="mb-3">
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
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Product;
