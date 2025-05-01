import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import { BaseUrl } from "./BaseUrl";
import axios from "axios";
import { Link } from "react-router-dom";

const Footer = () => {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo ? userInfo.token : null;

        const res = await axios.get(`${BaseUrl}/api/footers`, {
          headers: {
            "Accept": 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        if (res.data.status) {
          setFooter(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load footer:", err);
      }
    };

    fetchFooter();
  }, []);

  if (!footer) return null;

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            {footer.logo && (
              <img
                src={`${BaseUrl}${footer.logo}`}
                alt="Footer Logo"
                style={{ height: "50px", marginBottom: "10px" }}
              />
            )}
            <p>{footer.description}</p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              {Array.isArray(footer.quick_links) &&
                footer.quick_links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path || "/"}
                      className="text-light text-decoration-none"
                    >
                      {link.name || "Link"}
                    </Link>
                  </li>
                ))}
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect</h5>
            {footer.email && (
              <p>
                <FaEnvelope /> {footer.email}
              </p>
            )}
            <div className="d-flex gap-3">
              {footer.social_links?.facebook && (
                <a
                  href={footer.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light fs-4"
                >
                  <FaFacebook />
                </a>
              )}
              {footer.social_links?.twitter && (
                <a
                  href={footer.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light fs-4"
                >
                  <FaTwitter />
                </a>
              )}
              {footer.social_links?.instagram && (
                <a
                  href={footer.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light fs-4"
                >
                  <FaInstagram />
                </a>
              )}
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
