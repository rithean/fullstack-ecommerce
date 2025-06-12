import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../common/layouts/AdminLayout";
import { Pencil, Trash } from "react-bootstrap-icons";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", status: 1 });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      console.error("Fetch error:", err.response || err);
    }
  };

  const handleModalShow = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentId(category.id);
      setForm({ name: category.name, status: category.status });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setForm({ name: "", status: 1 });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setForm({ name: "", status: 1 });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editMode) {
        await axios.put(
          `http://localhost:8000/api/admin/categories/${currentId}`,
          form,
          config
        );
      } else {
        await axios.post(
          `http://localhost:8000/api/admin/categories`,
          form,
          config
        );
      }

      handleModalClose();
      fetchCategories();
    } catch (err) {
      console.error("Submit error:", err.response || err);
    }
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;

      await axios.delete(
        `http://localhost:8000/api/admin/categories/${categoryToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      console.error("Delete error:", err.response || err);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2>Category Management</h2>
        <button
          className="btn btn-primary my-3"
          onClick={() => handleModalShow()}
        >
          + Create New
        </button>

        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.status === 1 ? "Active" : "Inactive"}</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleModalShow(category)}
                        >
                          <Pencil />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => confirmDelete(category)}
                        >
                          <Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
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
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Category Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        className="form-control"
                        value={form.status}
                        onChange={handleChange}
                      >
                        <option value={1}>Active</option>
                        <option value={2}>Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleDeleteCancel}
                  ></button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete the category{" "}
                  <strong>{categoryToDelete?.name}</strong>?
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteConfirmed}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleDeleteCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Category;
