import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../common/layouts/AdminLayout";
import { Pencil, Trash } from "react-bootstrap-icons";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", status: 1 });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const fetchBrands = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo?.token) {
        console.error("Authentication token missing.");
        return;
      }

      const res = await axios.get("http://localhost:8000/api/brands", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });
      setBrands(res.data.data || []);
    } catch (err) {
      console.error("Error fetching brands:", err.response || err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleModalShow = (brand = null) => {
    if (brand) {
      setEditMode(true);
      setCurrentId(brand.id);
      setForm({ name: brand.name, status: brand.status });
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
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo?.token) {
        console.error("Authentication token missing.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      };

      if (editMode) {
        await axios.put(
          `http://localhost:8000/api/admin/brands/${currentId}`,
          form,
          config
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/admin/brands",
          form,
          config
        );
      }

      handleModalClose();
      fetchBrands();
    } catch (err) {
      console.error("Error saving brand:", err.response || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo?.token) {
        console.error("Authentication token missing.");
        return;
      }

      await axios.delete(`http://localhost:8000/api/admin/brands/${id}`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
        },
      });

      fetchBrands();
    } catch (err) {
      console.error("Error deleting brand:", err.response || err);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2>Brand Management</h2>
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
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>{brand.id}</td>
                  <td>{brand.name}</td>
                  <td>{brand.status === 1 ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleModalShow(brand)}
                      >
                        <Pencil />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(brand.id)}
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan="4">No brands found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
                      {editMode ? "Edit Brand" : "Create Brand"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleModalClose}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Brand Name
                      </label>
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
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        name="status"
                        className="form-control"
                        value={form.status}
                        onChange={handleChange}
                        required
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
      </div>
    </AdminLayout>
  );
};

export default Brand;
