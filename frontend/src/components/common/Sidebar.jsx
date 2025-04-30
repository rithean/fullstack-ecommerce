import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaStoreAlt,
  FaListUl,
  FaCogs,
  FaImage,
  FaImages,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BaseUrl } from "./BaseUrl";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/logos");
        const logoPath = res.data.data[0]?.image; 
        if (logoPath) {
          setLogoUrl(`${BaseUrl}${logoPath}`); 
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      }
    };

    fetchLogo();
  }, []);

  return (
    <div className="d-flex flex-column bg-dark text-white vh-100 p-3">
      <div className="mb-4 d-flex justify-content-center align-items-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Admin Panel Logo"
            style={{
              height: "50px",
              objectFit: "cover",
              maxWidth: "100%",
            }}
          />
        ) : (
          <h3 className="text-white">Admin Panel</h3>
        )}
      </div>
      <ul className="nav flex-column mb-auto">
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
            <FaStoreAlt className="me-2" /> Brands
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/admin/categories"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaListUl className="me-2" /> Categories
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/admin/products"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaCogs className="me-2" /> Products
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/admin/collections"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaImages className="me-2" /> Collections
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link
            to="/admin/slideshows"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaImage className="me-2" /> Slideshows
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
        <button className="btn btn-danger w-100" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
