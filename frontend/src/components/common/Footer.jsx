import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import { BaseUrl } from "./BaseUrl";
import axios from "axios";
import { Link } from "react-router-dom";

const Footer = () => {
  const [logo, setLogoUrl] = useState("");

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
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            {logo && (
              <img
                src={logo}
                alt="RT Store Logo"
                style={{ height: "50px", marginBottom: "10px" }}
              />
            )}
            <p>
              A modern ecommerce platform to explore our products, read about
              us, and stay connected.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-light text-decoration-none">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-light text-decoration-none">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-light text-decoration-none">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect</h5>
            <p>
              <FaEnvelope /> sokrithean341@gmail.com
            </p>
            <div className="d-flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-4"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-4"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light fs-4"
              >
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>
        <hr className="border-light" />
        <p className="text-center mb-0">
          &copy; {new Date().getFullYear()} RT Store. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
