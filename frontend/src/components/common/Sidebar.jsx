import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaIndustry,
  FaTags,
  FaBoxes,
  FaImages,
  FaImage,
} from "react-icons/fa";
import { AdminAuthContext } from "../context/AdminAuth";

const Sidebar = () => {
  const { logout } = useContext(AdminAuthContext);

  return (
    <div className="d-flex flex-column bg-dark text-white vh-100 p-3">
      <div className="mb-4">
        <h3 className="text-white">Admin Panel</h3>
      </div>
      <ul className="nav flex-column mb-auto">
        {" "}
        {/* Use mb-auto to push items to the top */}
        <li className="nav-item mb-2">
          <Link
            to="/admin/dashboard"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaTachometerAlt className="me-2" /> Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/admin/brands"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaIndustry className="me-2" /> Brands
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/admin/categories"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaTags className="me-2" /> Categories
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/admin/products"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaBoxes className="me-2" /> Products
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/admin/slideshows"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaImages className="me-2" /> Slideshows
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/admin/logos"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaImage className="me-2" /> Logos
          </Link>
        </li>
      </ul>
      <div className="mt-auto">
        {" "}
        <button className="btn btn-danger w-100" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
