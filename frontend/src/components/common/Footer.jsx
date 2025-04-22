import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5>RT Store</h5>
            <p>
              A modern ecommerce platform to explore our products, read about us, and stay
              connected.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a href="/shop" className="text-light text-decoration-none">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="text-light text-decoration-none">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-light text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect</h5>
            <p>
              <FaEnvelope /> sokrithean341@gmail.com
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-4">
                <FaFacebook />
              </a>
              <a href="#" className="text-light fs-4">
                <FaTwitter />
              </a>
              <a href="#" className="text-light fs-4">
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
