import React, { useState, useEffect } from "react";
import AdminLayout from "../../common/layouts/AdminLayout";
import axios from "axios";
import { BaseUrl } from "../../common/BaseUrl";
import { Pencil, Trash } from "react-bootstrap-icons";

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_best: 0,
    is_discount: 0,
    status: 1,
  });
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const getToken = () => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    console.log(adminInfo);
    return adminInfo?.token || "";
  };

  const fetchCollections = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/collections", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setCollections(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err.response || err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleModalShow = (collection = null) => {
    if (collection) {
      setEditMode(true);
      setCurrentId(collection.id);
      setForm({
        name: collection.name,
        description: collection.description,
        is_best: collection.is_best,
        is_discount: collection.is_discount,
        status: collection.status,
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setForm({
        name: "",
        description: "",
        is_best: 0,
        is_discount: 0,
        status: 1,
      });
    }
    setImage(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setForm({
      name: "",
      description: "",
      is_best: 0,
      is_discount: 0,
      status: 1,
    });
    setImage(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;
      const config = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (image) formData.append("image", image);

      if (editMode) {
        await axios.post(
          `http://localhost:8000/api/admin/collections/${currentId}?_method=PUT`,
          formData,
          config
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/admin/collections",
          formData,
          config
        );
      }

      handleModalClose();
      fetchCollections();
    } catch (err) {
      console.error("Save error:", err.response || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;
      await axios.delete(`http://localhost:8000/api/admin/collections/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCollections();
    } catch (err) {
      console.error("Delete error:", err.response || err);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2>Collection Management</h2>
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
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Best Collection</th>
                <th>Is Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((slide) => (
                <tr key={slide.id}>
                  <td>{slide.id}</td>
                  <td>
                    {slide.image && (
                      <img
                        src={`${BaseUrl}${slide.image}`}
                        alt={slide.title}
                        style={{ width: "100px", height: "auto" }}
                      />
                    )}
                  </td>
                  <td>{slide.name}</td>
                  <td>{slide.description}</td>
                  <td>{slide.is_best === 1 ? "Best Collection" : "Not"}</td>
                  <td>{slide.is_discount === 1 ? "Discount" : "Not"}</td>
                  <td>{slide.status === 1 ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleModalShow(slide)}
                        title="Edit"
                      >
                        <Pencil /> {/* Use the Pencil icon */}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(slide.id)}
                        title="Delete"
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {collections.length === 0 && (
                <tr>
                  <td colSpan="7">No collections found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Collection" : "Create Collection"}
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
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setImage(e.target.files[0])}
                      accept="image/*"
                      {...(!editMode ? { required: true } : {})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Best Collections</label>
                    <select
                      className="form-select"
                      name="is_best"
                      value={form.is_best}
                      onChange={handleChange}
                    >
                      <option value={1}>Is Best</option>
                      <option value={0}>Not</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Discount</label>
                    <select
                      className="form-select"
                      name="is_discount"
                      value={form.is_discount}
                      onChange={handleChange}
                    >
                      <option value={1}>Is Discount</option>
                      <option value={0}>Not</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
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

export default Collection;
