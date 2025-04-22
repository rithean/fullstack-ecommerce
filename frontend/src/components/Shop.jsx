import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import ClientLayout from "./common/layouts/ClientLayout";
import { BaseUrl } from "./common/BaseUrl";
import ProductCard from "./common/ProductCard";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/products`);
        if (res.data.status) {
          setProducts(res.data.data.data);
          setFilteredProducts(res.data.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoriesAndBrands = async () => {
      try {
        const resCategories = await axios.get(`${BaseUrl}/api/categories`);
        const resBrands = await axios.get(`${BaseUrl}/api/brands`);
        setCategories(resCategories.data.data);
        setBrands(resBrands.data.data);
      } catch (error) {
        console.error("Failed to fetch categories or brands", error);
      }
    };

    fetchProducts();
    fetchCategoriesAndBrands();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category_id)
      );
    }
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand_id)
      );
    }

    const filteredBySearch = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProducts(filteredBySearch);
  }, [selectedCategories, selectedBrands, products, searchQuery]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <ClientLayout>
      <Container className="my-5">
        <h2 className="text-center mb-5 fw-bold text-dark">
          ALL <span className="text-primary">PRODUCTS</span>
        </h2>

        <Row className="g-4">
          <Col xs={12} md={4} lg={3}>
            <div className="sidebar p-4 border rounded">
              <input
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control mb-4 p-2"
              />
              <h4 className="mb-4">Filter Products</h4>

              {/* Categories Filter */}
              <div className="mb-3">
                <h5>Categories</h5>
                <ul className="list-unstyled">
                  {categories.map((category) => (
                    <li key={category.id} className="mb-2">
                      <label>
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                        />
                        {category.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands Filter */}
              <div>
                <h5>Brands</h5>
                <ul className="list-unstyled">
                  {brands.map((brand) => (
                    <li key={brand.id} className="mb-2">
                      <label>
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => handleBrandChange(brand.id)}
                        />
                        {brand.name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Col>

          {/* Product Cards */}
          <Col xs={12} md={8} lg={9}>
            <Row className="g-4">
              {filteredProducts.length === 0 ? (
                <div>No products found</div>
              ) : (
                filteredProducts.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={4}>
                    <ProductCard product={product} />
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </ClientLayout>
  );
};

export default Shop;
