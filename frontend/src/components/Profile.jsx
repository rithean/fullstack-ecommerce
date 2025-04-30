import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import { BaseUrl } from "./common/BaseUrl";
import ClientLayout from "./common/layouts/ClientLayout";

const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo || !userInfo.token) {
          console.error("Authentication token missing.");
          return;
        }

        const token = userInfo.token;
        const res = await axios.get(`${BaseUrl}/api/auth/me`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data.data);
      } catch (error) {
        console.error("Fetch profile error:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <ClientLayout>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-lg">
              <Card.Body className="text-center">
                <Image
                  src={`${BaseUrl}${profile.avatar}`}
                  roundedCircle
                  width="120"
                  height="120"
                  className="mb-3"
                  alt="Avatar"
                />
                <Card.Title>{profile.name}</Card.Title>
                <Card.Text>
                  <strong>Email:</strong> {profile.email}
                </Card.Text>
                <Card.Text>
                  <strong>Phone:</strong> {profile.phone || "N/A"}
                </Card.Text>
                <Card.Text>
                  <strong>Address:</strong> {profile.address || "N/A"}
                </Card.Text>
                <Card.Text>
                  <strong>Date of Birth:</strong> {profile.date_of_birth}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </ClientLayout>
  );
};

export default Profile;
