import React, { useContext } from "react";
import { CartContext } from "./context/CartContext";
import { Button, Card, Table, Row, Col } from "react-bootstrap";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { BaseUrl } from "./common/BaseUrl";
import { Link } from "react-router-dom";
import ClientLayout from "./common/layouts/ClientLayout";

const Cart = () => {
  const { cartData, incrementQty, decrementQty, removeFromCart } =
    useContext(CartContext);

  const totalPrice = cartData
    .reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    .toFixed(2);

  return (
    <ClientLayout>
      <div className="container my-5">
        <h2 className="text-center mb-4">Your Shopping Cart</h2>
        {cartData.length === 0 ? (
          <div className="text-center">
            <p>Your cart is empty.</p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <Row className="justify-content-center">
            {/* Table with Products */}
            <Col md={8}>
              <Table striped bordered hover responsive className="cart-table">
                <thead className="cart-table-header">
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cartData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={`${BaseUrl}${item.image}`}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td>
                        <div className="d-flex justify-content-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="me-2 cart-btn"
                            onClick={() => decrementQty(item.id)}
                          >
                            <FaMinus />
                          </Button>
                          <span>{item.qty}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="ms-2 cart-btn"
                            onClick={() => incrementQty(item.id)}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </td>
                      <td>${(Number(item.price) * item.qty).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>

            {/* Summary Cart (Aligned to the Right Below the Table) */}
            <Col md={4} className="mt-4">
              <Card className="cart-summary-card shadow-sm border-0 rounded-lg">
                <Card.Body>
                  <h5 className="text-center">Summary</h5>
                  <div className="d-flex justify-content-between mt-3">
                    <span className="fw-semibold">Subtotal</span>
                    <span className="fw-bold">${totalPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span className="fw-semibold">Shipping</span>
                    <span className="text-muted">Calculated at checkout</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">${totalPrice}</span>
                  </div>
                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    as={Link}
                    to="/checkout"
                  >
                    Proceed to Checkout
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </ClientLayout>
  );
};

export default Cart;
