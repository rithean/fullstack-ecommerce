import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaHeart, FaAward, FaUsers, FaShippingFast } from "react-icons/fa";
import { BaseUrl } from "./common/BaseUrl";
import image1 from "../assets/images/rithean.jpg";
import image2 from "../assets/images/tra.jpg";
import ClientLayout from "./common/layouts/ClientLayout";
import axios from "axios";

const profileImage = [image1, image2];

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo ? userInfo.token : null;

        console.log(userInfo);

        const res = await axios.get(`${BaseUrl}/api/abouts`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status) {
          setAboutData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load About Us data:", err);
      }
    };

    fetchAbout();
  }, []);

  if (!aboutData) return null;

  const iconMap = {
    FaHeart: <FaHeart size={40} />,
    FaAward: <FaAward size={40} />,
    FaUsers: <FaUsers size={40} />,
    FaShippingFast: <FaShippingFast size={40} />,
  };

  return (
    <ClientLayout>
      <div className="about-page">
        <Container className="py-5">
          {/* Header Section */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="fw-bold text-dark header-title">
                {aboutData.header_title}
              </h1>
              <p className="text-muted header-description">
                {aboutData.header_description}
              </p>
            </Col>
          </Row>

          {/* Mission Section */}
          <Row className="mb-5">
            <Col md={12}>
              <div className="bg-light p-4 rounded shadow text-center">
                <h5 className="text-primary fw-semibold">Our Mission</h5>
                <p>{aboutData.mission}</p>
              </div>
            </Col>
          </Row>

          {/* Values Section */}
          <Row className="mb-5 text-center">
            {JSON.parse(aboutData.values).map((value, idx) => (
              <Col key={idx} md={3}>
                <div className="bg-light p-4 rounded shadow value-card h-100">
                  {iconMap[value.icon] || <FaHeart size={40} />}
                  <h5 className="mt-3">{value.title}</h5>
                  <p>{value.description}</p>
                </div>
              </Col>
            ))}
          </Row>

          {/* Team Section */}
          <Row className="mb-5 text-center">
            <Col>
              <h2 className="fw-bold text-dark">Meet Our Team</h2>
              <p className="text-muted">
                Our team is passionate about delivering the best products and
                services to you.
              </p>
            </Col>
          </Row>

          <Row className="text-center">
            {JSON.parse(aboutData.team).map((member, idx) => (
              <Col key={idx} md={6}>
                <div className="card shadow border-0 team-card">
                  <div className="card-body">
                    <img
                      src={profileImage[idx]}
                      alt={member.name}
                      className="card-img mb-3 team-img"
                    />
                    <h5>{member.name}</h5>
                    <p>{member.position}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </ClientLayout>
  );
};

export default About;
