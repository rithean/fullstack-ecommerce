import React from "react";
import { Table, Button, Row, Col, Image } from "react-bootstrap";
import { useCart } from "./context/CartContext"; 
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import ClientLayout from "./common/layouts/ClientLayout";
import { BaseUrl } from "./common/BaseUrl";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate(); 

  const proceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <ClientLayout>
      <div className="container py-5">
        <h3 className="text-center mb-4 fw-bold">Your Shopping Cart</h3>
        {cartItems.length === 0 ? (
          <div className="text-center text-muted">
            <p>Your cart is empty. Start adding some items!</p>
          </div>
        ) : (
          <>
            <Table
              striped
              bordered
              hover
              responsive
              className="cart-table rounded"
            >
              <thead className="bg-primary text-white">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <Image
                          src={`${BaseUrl}${item.image}`}
                          alt={item.name}
                          rounded
                          className="cart-item-img me-3"
                        />
                        <span className="ms-3 cart-item-name">{item.name}</span>
                      </div>
                    </td>
                    <td>${item.price}</td>
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity === 1}
                          className="cart-qty-btn"
                        >
                          <FaMinus />
                        </Button>
                        <span className="mx-3 cart-qty-text">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="cart-qty-btn"
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="cart-remove-btn"
                      >
                        <FaTimes />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr className="font-weight-bold">
                  <td colSpan="3" className="text-end">
                    <h5>Total:</h5>
                  </td>
                  <td colSpan="2">
                    <h5>
                      $
                      {cartItems
                        .reduce(
                          (acc, item) => acc + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </h5>
                  </td>
                </tr>
              </tbody>
            </Table>

            <Row>
              <Col className="text-end mt-4">
                <Button
                  variant="primary"
                  className="w-25 cart-checkout-btn"
                  onClick={proceedToCheckout} // Navigate to Checkout
                >
                  Proceed to Checkout
                </Button>
              </Col>
            </Row>
          </>
        )}
      </div>
    </ClientLayout>
  );
};

export default Cart;
