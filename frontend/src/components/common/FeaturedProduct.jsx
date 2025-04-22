import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import ProductCard from "./ProductCard";

const FeaturedProduct = () => {
  const [products, setProducts] = useState([]);
  const baseUrl = "http://localhost:8000";

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/products`);
        if (res.data.status) {
          setProducts(res.data.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-5 fw-bold text-dark">
        TRENDING <span className="text-primary">PRODUCTS</span>
      </h2>
      <Row className="g-4">
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FeaturedProduct;
