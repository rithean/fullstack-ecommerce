import React, { useContext, useState } from "react";
import { Card, Button, Badge, Modal, Offcanvas } from "react-bootstrap";
import {
  FaShoppingCart,
  FaEye,
  FaStar,
  FaStarHalfAlt,
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { BaseUrl } from "./BaseUrl";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const {
    addToCart,
    showCart,
    setShowCart,
    cartData,
    incrementQty,
    decrementQty,
    removeFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const fixedRating = 4.2;
  const [showModal, setShowModal] = useState(false);

  const getRating = () => {
    const fullStars = Math.floor(fixedRating);
    const hasHalfStar = fixedRating - fullStars >= 0.5;
    return { fullStars, hasHalfStar };
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowCart(true);
  };

  const handleToCheckout = () => {
    navigate("/checkout");
  }

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
              onClick={handleAddToCart}
            >
              <FaShoppingCart />
            </Button>
            <Button
              variant="outline-light"
              className="rounded-circle"
              size="sm"
              title="View Details"
              onClick={handleShowModal}
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
            <Button
              variant="primary"
              className="rounded-pill btn-sm"
              onClick={handleAddToCart}
            >
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
            style={{ width: "100%", height: "300px", objectFit: "contain" }}
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
          <div className="d-flex align-items-center mb-2">
            {[...Array(getRating().fullStars)].map((_, index) => (
              <FaStar
                key={`full-modal-${product.id}-${index}`}
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
                key={`empty-modal-${product.id}-${index}`}
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

      {/* Cart Drawer Offcanvas */}
      <Offcanvas
        show={showCart}
        onHide={() => setShowCart(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cartData.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartData.map((item) => (
                <div
                  key={item.id}
                  className="d-flex mb-3 align-items-center border-bottom pb-2"
                >
                  <img
                    src={`${BaseUrl}${item.image}`}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                    className="me-3 rounded"
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{item.name}</div>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => decrementQty(item.id)}
                      >
                        <FaMinus />
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="ms-2"
                        onClick={() => incrementQty(item.id)}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                    <small className="text-muted">
                      ${item.price} × {item.qty} = $
                      {(item.price * item.qty).toFixed(2)}
                    </small>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
              <hr />
              <div className="fw-bold fs-5">
                Total: $
                {cartData
                  .reduce((acc, item) => acc + item.price * item.qty, 0)
                  .toFixed(2)}
              </div>
              <Button
                variant="primary"
                className="mt-3 w-100"
                onClick={handleToCheckout}
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ProductCard;
