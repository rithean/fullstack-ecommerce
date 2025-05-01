import React, { useState, useEffect } from "react";
import AdminLayout from "../../common/layouts/AdminLayout";
import axios from "axios";
import { BaseUrl } from "../../common/BaseUrl";

const Logo = () => {
  const [logos, setLogos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const fetchLogos = async () => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!adminInfo || !adminInfo.token) {
        console.error("Authentication token missing.");
        return;
      }
      const token = adminInfo.token;
      const res = await axios.get("http://localhost:8000/api/logos", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setLogos(res.data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const handleModalShow = (logo = null) => {
    setEditMode(!!logo);
    setCurrentId(logo ? logo.id : null);
    setImage(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditMode(false);
    setCurrentId(null);
    setImage(null);
    setShowModal(false);
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
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      if (image) formData.append("image", image);

      if (editMode) {
        await axios.post(
          `http://localhost:8000/api/admin/logos/${currentId}?_method=PUT`,
          formData,
          config
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/admin/logos",
          formData,
          config
        );
      }

      handleModalClose();
      fetchLogos();
    } catch (err) {
      console.error("Save error:", err);
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
      await axios.delete(`http://localhost:8000/api/admin/logos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLogos();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2>Logo Management</h2>
        <button
          className="btn btn-primary my-3"
          onClick={() => handleModalShow()}
        >
          + Upload Logo
        </button>

        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logos.map((logo) => (
                <tr key={logo.id}>
                  <td>{logo.id}</td>
                  <td>
                    {logo.image && (
                      <img
                        src={`${BaseUrl}${logo.image}`}
                        alt="Logo"
                        style={{ width: "100px", height: "auto" }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleModalShow(logo)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(logo.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Logo" : "Upload Logo"}
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
                    <label className="form-label">Logo Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setImage(e.target.files[0])}
                      accept="image/*"
                      {...(!editMode ? { required: true } : {})}
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
                    {editMode ? "Update" : "Upload"}
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

export default Logo;
