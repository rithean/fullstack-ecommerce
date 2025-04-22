import React from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { FaHeart, FaUsers, FaShippingFast, FaAward } from "react-icons/fa";
import ClientLayout from "./common/layouts/ClientLayout";

const About = () => {
  return (
    <ClientLayout>
      <div className="about-page">
        <Container className="my-5">
          {/* Header Section */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="fw-bold text-dark">About Us</h1>
              <p className="text-muted">
                Learn more about our mission, values, and why we are the best
                choice for your online shopping experience.
              </p>
            </Col>
          </Row>

          {/* Mission Section */}
          <Row className="mb-5">
            <Col md={12}>
              <Card className="shadow-sm border-0 rounded py-5">
                <Card.Body>
                  <Card.Title className="text-primary fw-semibold">
                    Our Mission
                  </Card.Title>
                  <Card.Text>
                    We are committed to offering a vast selection of quality
                    products at competitive prices. Our goal is to provide an
                    easy and seamless shopping experience for our customers.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Values Section */}
          <Row className="mb-5 text-center">
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <FaHeart className="text-danger" size={40} />
                  <Card.Title className="mt-3">Customer First</Card.Title>
                  <Card.Text>
                    We prioritize our customers by offering great service, fast
                    delivery, and hassle-free returns.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <FaAward className="text-warning" size={40} />
                  <Card.Title className="mt-3">Quality Products</Card.Title>
                  <Card.Text>
                    Our products are carefully selected to ensure that you
                    receive the best value for your money.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <FaUsers className="text-primary" size={40} />
                  <Card.Title className="mt-3">Teamwork</Card.Title>
                  <Card.Text>
                    Our team works together to ensure a smooth and enjoyable
                    experience for our customers.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <FaShippingFast className="text-success" size={40} />
                  <Card.Title className="mt-3">Fast Shipping</Card.Title>
                  <Card.Text>
                    We offer fast, reliable shipping options so that your orders
                    arrive as quickly as possible.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Meet the Team Section */}
          <Row className="mb-5 text-center">
            <Col>
              <h2 className="fw-bold text-dark">Meet Our Team</h2>
              <p className="text-muted">
                Our team is passionate about delivering the best products and
                service to you.
              </p>
            </Col>
          </Row>

          <Row className="text-center">
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Image
                  src="https://via.placeholder.com/150"
                  roundedCircle
                  fluid
                />
                <Card.Body>
                  <Card.Title className="fw-semibold">John Doe</Card.Title>
                  <Card.Text>Founder & CEO</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Image
                  src="https://via.placeholder.com/150"
                  roundedCircle
                  fluid
                />
                <Card.Body>
                  <Card.Title className="fw-semibold">Jane Smith</Card.Title>
                  <Card.Text>Head of Marketing</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ClientLayout>
  );
};

export default About;
