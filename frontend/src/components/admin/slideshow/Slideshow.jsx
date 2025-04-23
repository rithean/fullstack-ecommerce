import React, { useState, useEffect } from "react";
import AdminLayout from "../../common/layouts/AdminLayout";
import axios from "axios";
import { BaseUrl } from "../../common/BaseUrl";
import { Pencil, Trash } from "react-bootstrap-icons";

const Slideshow = () => {
  const [slideshows, setSlideshows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    status: 1,
  });
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const fetchSlideshows = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;
      const res = await axios.get("http://localhost:8000/api/slideshows", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setSlideshows(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err.response || err);
    }
  };

  useEffect(() => {
    fetchSlideshows();
  }, []);

  const handleModalShow = (slideshow = null) => {
    if (slideshow) {
      setEditMode(true);
      setCurrentId(slideshow.id);
      setForm({
        title: slideshow.title,
        subtitle: slideshow.subtitle,
        description: slideshow.description,
        status: slideshow.status,
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setForm({ title: "", subtitle: "", description: "", status: 1 });
    }
    setImage(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setForm({ title: "", subtitle: "", description: "", status: 1 });
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
        // Handle missing token (redirect to login or show an error)
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
          `http://localhost:8000/api/admin/slideshows/${currentId}?_method=PUT`,
          formData,
          config
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/admin/slideshows",
          formData,
          config
        );
      }

      handleModalClose();
      fetchSlideshows();
    } catch (err) {
      console.error("Save error:", err.response || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        // Handle missing token (redirect to login or show an error)
        return;
      }
      const token = adminInfo.token;
      await axios.delete(`http://localhost:8000/api/admin/slideshows/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSlideshows();
    } catch (err) {
      console.error("Delete error:", err.response || err);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2>Slideshow Management</h2>
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
                <th>Title</th>
                <th>Subtitle</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slideshows.map((slide) => (
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
                  <td>{slide.title}</td>
                  <td>{slide.subtitle}</td>
                  <td>{slide.description}</td>
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
              {slideshows.length === 0 && (
                <tr>
                  <td colSpan="7">No slideshows found.</td>
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
                  {editMode ? "Edit Slideshow" : "Create Slideshow"}
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
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subtitle</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subtitle"
                      value={form.subtitle}
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

export default Slideshow;
