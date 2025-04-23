import React, { useState, useEffect } from "react";
import AdminLayout from "../../common/layouts/AdminLayout";
import axios from "axios";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8000/api/admin/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleModalShow = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategoryId(category.id);
      setCategoryName(category.name);
      setStatus(category.status);
    } else {
      setEditMode(false);
      setCurrentCategoryId(null);
      setCategoryName("");
      setStatus(1);
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentCategoryId(null);
    setCategoryName("");
    setStatus(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const categoryData = { name: categoryName, status };

      if (editMode) {
        await axios.put(
          `http://localhost:8000/api/admin/categories/${currentCategoryId}`,
          categoryData,
          config
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/admin/categories",
          categoryData,
          config
        );
      }

      handleModalClose();
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="mb-4">All Categories</h2>
      <button
        className="btn btn-primary mb-3 rounded-pill px-4 py-2 shadow-sm"
        onClick={() => handleModalShow()}
      >
        <i className="bi bi-plus-circle me-2"></i>Create New
      </button>

      <div className="table-responsive">
        <table className="table table-bordered table-striped shadow-sm rounded text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <span
                    className={`badge text-uppercase ${
                      item.status === 1 ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {item.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2 rounded-pill text-white"
                    onClick={() => handleModalShow(item)}
                  >
                    <i className="bi bi-pencil-square"></i> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm rounded-pill"
                    onClick={() => handleDelete(item._id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bootstrap Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Category" : "Create Category"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(Number(e.target.value))}
                    >
                      <option value={1}>Active</option>
                      <option value={2}>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
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

export default Category;
