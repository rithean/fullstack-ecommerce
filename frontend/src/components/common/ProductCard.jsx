import React, { useState } from "react";
import { Card, Button, Badge, Modal, Offcanvas, Image } from "react-bootstrap";
import {
  FaShoppingCart,
  FaEye,
  FaStar,
  FaStarHalfAlt,
  FaPlus,
  FaMinus,
  FaTimes,
} from "react-icons/fa";
import { BaseUrl } from "./BaseUrl"; 
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const fixedRating = 4.2;
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const navigate = useNavigate();

  const { cartItems, addToCart, updateQuantity, removeItem } = useCart();

  const getRating = () => {
    const fullStars = Math.floor(fixedRating);
    const hasHalfStar = fixedRating - fullStars >= 0.5;
    return { fullStars, hasHalfStar };
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  const handleAddToCart = () => {
    addToCart(product);
    handleShowCart();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Card className="h-100 shadow-sm border-0 rounded-lg overflow-hidden product-card">
        <div className="position-relative">
          <div className="overflow-hidden rounded-top bg-light">
            <Card.Img
              variant="top"
              src={`${BaseUrl}${product.image}`}
              alt={product.name}
              className="product-image w-100"
              style={{
                objectFit: "cover",
                height: "220px",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </div>
          {product.status === 1 && (
            <Badge
              bg="success"
              className="position-absolute top-0 end-0 px-4 py-2 m-3 rounded-pill"
            >
              Active
            </Badge>
          )}
          <div className="product-overlay">
            <Button
              variant="outline-light"
              className="rounded-circle me-2"
              size="sm"
              title="Add to Cart"
              onClick={handleAddToCart} // Trigger add to cart
            >
              <FaShoppingCart />
            </Button>
            <Button
              variant="outline-light"
              className="rounded-circle"
              size="sm"
              title="View Details"
              onClick={handleShowModal} // Trigger modal on click
            >
              <FaEye />
            </Button>
          </div>
        </div>

        <Card.Body className="d-flex flex-column p-3">
          <div className="mb-2">
            <Card.Title className="fw-semibold text-dark mb-1 line-clamp-1">
              {product.name}
            </Card.Title>
            <Card.Subtitle className="text-muted small mb-2">
              {product.category?.name || `Category: ${product.category_id}`}
            </Card.Subtitle>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-danger fw-bold fs-5">${product.price}</span>
            {product.qty <= 5 && (
              <Badge bg="warning" pill>
                Low Stock
              </Badge>
            )}
          </div>
          <Card.Text className="small text-secondary line-clamp-2 mb-3">
            {product.description}
          </Card.Text>
          {/* Rating Stars */}
          <div className="d-flex align-items-center mb-2">
            {[...Array(getRating().fullStars)].map((_, index) => (
              <FaStar
                key={`full-${product.id}-${index}`}
                className="text-warning me-1"
                size={14}
              />
            ))}
            {getRating().hasHalfStar && (
              <FaStarHalfAlt className="text-warning me-1" size={14} />
            )}
            {[
              ...Array(
                5 - getRating().fullStars - (getRating().hasHalfStar ? 1 : 0)
              ),
            ].map((_, index) => (
              <FaStar
                key={`empty-${product.id}-${index}`}
                className="text-muted me-1"
                size={14}
              />
            ))}
            <span className="text-muted small ms-2">({fixedRating})</span>
          </div>
          <div className="mt-auto d-grid">
            <Button variant="primary" className="rounded-pill btn-sm">
              Shop Now
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Product Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`${BaseUrl}${product.image}`}
            alt={product.name}
            className="img-fluid mb-3"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <p>
            <strong>Category:</strong>{" "}
            {product.category?.name || `Category: ${product.category_id}`}
          </p>
          <p>
            <strong>Brand:</strong>{" "}
            {product.brand?.name || `Brand: ${product.brand_id}`}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Price:</strong> ${product.price}
          </p>
          <p>
            <strong>Stock:</strong> {product.qty} left
          </p>
          {/* Rating in Modal */}
          <div className="d-flex align-items-center mb-2">
            {[...Array(getRating().fullStars)].map((_, index) => (
              <FaStar
                key={`full-${product.id}-${index}`}
                className="text-warning me-1"
                size={14}
              />
            ))}
            {getRating().hasHalfStar && (
              <FaStarHalfAlt className="text-warning me-1" size={14} />
            )}
            {[
              ...Array(
                5 - getRating().fullStars - (getRating().hasHalfStar ? 1 : 0)
              ),
            ].map((_, index) => (
              <FaStar
                key={`empty-${product.id}-${index}`}
                className="text-muted me-1"
                size={14}
              />
            ))}
            <span className="text-muted small ms-2">({fixedRating})</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cart OffCanvas */}
      <Offcanvas
        show={showCart}
        onHide={handleCloseCart}
        placement="end"
        scroll
        backdrop
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartItems.length === 0 ? (
            <div className="text-center text-muted">
              <p>Your cart is empty!</p>
            </div>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-4">
                  <Image
                    src={`${BaseUrl}${item.image}`}
                    alt={item.name}
                    rounded
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <span className="text-muted">${item.price}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity === 1}
                    >
                      <FaMinus />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <FaPlus />
                    </Button>
                    <Button
                      variant="link"
                      className="ms-3 text-danger"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <span>
                  $
                  {cartItems
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <Button
                variant="primary"
                className="mt-3 w-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ProductCard;
