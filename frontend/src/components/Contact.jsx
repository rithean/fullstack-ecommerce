import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import ClientLayout from "./common/layouts/ClientLayout";

const Contact = () => {
  return (
    <ClientLayout>
      <div className="contact-page">
        <Container className="my-5">
          {/* Header Section */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="fw-bold text-dark">Contact Us</h1>
              <p className="text-muted">
                Have any questions? We're here to help. Reach out to us!
              </p>
            </Col>
          </Row>

          {/* Contact Form Section */}
          <Row className="mb-5">
            <Col md={6}>
              <Card className="shadow-sm border-0 rounded">
                <Card.Body>
                  <Card.Title className="text-primary fw-semibold">
                    Get in Touch
                  </Card.Title>
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your name" />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                      />
                    </Form.Group>

                    <Form.Group controlId="formMessage">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter your message"
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="mt-3">
                      Send Message
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Details Section */}
            <Col md={6}>
              <Card className="shadow-sm border-0 rounded">
                <Card.Body>
                  <Card.Title className="text-primary fw-semibold">
                    Our Contact Info
                  </Card.Title>
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <FaPhoneAlt className="text-primary" size={20} />
                      <span className="ms-2">+123 456 7890</span>
                    </li>
                    <li className="mb-3">
                      <FaEnvelope className="text-primary" size={20} />
                      <span className="ms-2">info@example.com</span>
                    </li>
                    <li>
                      <FaMapMarkerAlt className="text-primary" size={20} />
                      <span className="ms-2">123 Street, City, Country</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Google Maps Section (Optional) */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary fw-semibold">
                    Our Location
                  </Card.Title>
                  <div className="map-container">
                    {/* Embed Google Map here */}
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.6554615175077!2d-122.42164838468158!3d37.77492977975903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808e8b8f8d69%3A0xabc12345!2sYour+Location!5e0!3m2!1sen!2sus!4v1618250236728!5m2!1sen!2sus"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ClientLayout>
  );
};

export default Contact;
