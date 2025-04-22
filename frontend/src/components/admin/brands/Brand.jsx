import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Badge } from "react-bootstrap";
import { PencilSquare, Trash, PlusCircle } from "react-bootstrap-icons";
import AdminLayout from "../../common/layouts/AdminLayout";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [status, setStatus] = useState(1);
  const [editMode, setEditMode] = useState(false); 
  const [currentBrandId, setCurrentBrandId] = useState(null); 

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "http://localhost:8000/api/brands",
        config
      );

      setBrands(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `http://localhost:8000/api/admin/brands/${id}`,
        config
      );
      setBrands(brands.filter((brand) => brand._id !== id)); // Remove the brand from the list
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  const renderStatus = (status) => {
    return status === 1 ? (
      <Badge bg="success" className="text-uppercase">
        Active
      </Badge>
    ) : (
      <Badge bg="secondary" className="text-uppercase">
        Inactive
      </Badge>
    );
  };

  const handleModalClose = () => {
    setShowModal(false);
    setBrandName("");
    setStatus(1);
    setEditMode(false);
    setCurrentBrandId(null);
  };

  const handleModalShow = (brand = null) => {
    if (brand) {
      // Edit mode
      setEditMode(true);
      setCurrentBrandId(brand.id);
      setBrandName(brand.name);
      setStatus(brand.status);
    } else {
      // Create mode
      setEditMode(false);
      setCurrentBrandId(null);
      setBrandName("");
      setStatus(1);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const brandData = { name: brandName, status };

      if (editMode) {
        // Edit brand
        await axios.put(
          `http://localhost:8000/api/admin/brands/${currentBrandId}`,
          brandData,
          config
        );
      } else {
        // Create new brand
        await axios.post(
          "http://localhost:8000/api/admin/brands",
          brandData,
          config
        );
      }

      // Close modal and refresh brands list
      handleModalClose();
      fetchBrands(); // Fetch updated list of brands
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  return (
    <AdminLayout>
      <h2 className="mb-4">All Brands</h2>
      <Button
        variant="primary"
        className="mb-3 rounded-pill px-4 py-2 shadow-sm"
        onClick={() => handleModalShow()} // Show modal for creating brand
      >
        <PlusCircle /> <span className="ms-2">Create New</span>
      </Button>

      <div className="table-responsive">
        <Table striped bordered hover className="shadow-sm rounded">
          <thead className="table-dark text-center">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="align-middle text-center">
                <td>{brand.id}</td>
                <td>{brand.name}</td>
                <td>{renderStatus(brand.status)}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      variant="warning"
                      size="sm"
                      className="rounded-pill text-white shadow-sm me-2"
                      onClick={() => handleModalShow(brand)} // Show modal for editing brand
                    >
                      <PencilSquare /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="rounded-pill shadow-sm"
                      onClick={() => handleDelete(brand._id)}
                    >
                      <Trash /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Bootstrap Modal for creating/editing brand */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Brand" : "Create Brand"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="brandName">Brand Name</label>
                    <input
                      type="text"
                      id="brandName"
                      className="form-control"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mt-3">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(Number(e.target.value))}
                      required
                    >
                      <option value={1}>Active</option>
                      <option value={2}>Inactive</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-center mt-4">
                    <Button
                      variant="primary"
                      type="submit"
                      className="rounded-pill px-4 py-2 shadow-sm"
                    >
                      {editMode ? "Update Brand" : "Create Brand"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Brand;
