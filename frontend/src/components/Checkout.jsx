import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { useCart } from "./context/CartContext";
import ClientLayout from "./common/layouts/ClientLayout";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { BaseUrl } from "./common/BaseUrl";

const Checkout = () => {
  const { cartItems, removeItem, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [showPayPal, setShowPayPal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(""); 

  useEffect(() => {
    setClientId(
      "AfoGBDV7ALjR749En8LgdzKhSBJ9zuBChk6Rat_WFVL1VU9i4-xJtHO-YxiJ_ESCHrxf3wvGsgCOAIOu"
    ); 
  }, []);

  const total = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckoutDetails = () => {
    if (!form.name || !form.address || !form.phone || !form.email) {
      alert("Please fill in all shipping information");
      return;
    }
    setShowPayPal(true);
  };

  const handlePaymentSuccess = async (details) => {
    try {
      setLoading(true);
      console.log("Payment details:", details);

      await axios.post(`${BaseUrl}/api/checkout`, {
        ...form,
        user_id: 1,
        total_price: total,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        payment_details: details,
      });

      alert("Payment completed! Order saved.");
      clearCart();
    } catch (err) {
      console.error("Error sending order to backend", err);
      alert("Error storing order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="container py-5">
        <h3 className="text-center mb-4 fw-bold">Checkout</h3>

        {cartItems.length === 0 ? (
          <div className="text-center text-muted">
            <p>Your cart is empty. Please add items before checking out.</p>
          </div>
        ) : (
          <>
            {/* Cart Table */}
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
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="me-3"
                          style={{ width: "50px", height: "50px" }}
                        />
                        {item.name}
                      </div>
                    </td>
                    <td>${item.price}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTimes />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="text-end fw-bold">
                    Total:
                  </td>
                  <td colSpan="2" className="fw-bold">
                    ${total}
                  </td>
                </tr>
              </tbody>
            </Table>

            {/* Shipping Form */}
            <Row className="mt-4">
              <Col md={6}>
                <h4>Shipping Info</h4>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={handleCheckoutDetails}
                  >
                    Continue to PayPal
                  </Button>
                </Form>
              </Col>

              {/* PayPal Button */}
              {showPayPal && (
                <Col md={6} className="mt-4">
                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    clientId && (
                      <PayPalScriptProvider
                        options={{
                          "client-id": clientId,
                          currency: "USD",
                        }}
                      >
                        <PayPalButtons
                          style={{ layout: "vertical" }}
                          createOrder={(data, actions) =>
                            actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: total,
                                  },
                                },
                              ],
                            })
                          }
                          onApprove={async (data, actions) => {
                            const details = await actions.order.capture();
                            handlePaymentSuccess(details);
                          }}
                          onError={(err) => {
                            console.error("PayPal error", err);
                            alert("Payment failed!");
                          }}
                        />
                      </PayPalScriptProvider>
                    )
                  )}
                </Col>
              )}
            </Row>
          </>
        )}
      </div>
    </ClientLayout>
  );
};

export default Checkout;
