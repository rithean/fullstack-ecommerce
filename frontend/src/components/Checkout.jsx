import React, { useContext, useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { CartContext } from "./context/CartContext";
import { BaseUrl } from "./common/BaseUrl";
import axios from "axios";
import ClientLayout from "./common/layouts/ClientLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartData, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    discount: 0,
    shipping: 5,
    payment_status: "not paid",
    status: "pending",
  });

  const subtotal = cartData.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0
  );
  const total = subtotal + form.shipping - form.discount;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (orderIdFromPayPal = null) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      address: form.address,
      subtotal,
      discount: form.discount,
      shipping: form.shipping,
      payment_status: orderIdFromPayPal ? "paid" : "not paid",
      status: form.status,
      orderId: orderIdFromPayPal || `manual_order_${Date.now()}`,
      cart: cartData.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
    };

    try {
      const res = await axios.post(`${BaseUrl}/api/orders`, payload, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201 || res.status === 200) {
        toast.success("Order placed successfully!");
        clearCart();
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error("Order was not processed successfully.");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.data?.errors) {
        Object.values(err.response.data.errors).forEach((messages) =>
          messages.forEach((msg) => toast.error(msg))
        );
      } else {
        toast.error("Failed to place order. Please try again later.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOrderSubmit(); 
  };

  useEffect(() => {
    const paypalContainer = document.getElementById("paypal-button-container");
    if (paypalContainer && paypalContainer.children.length > 0) return;

    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AfoGBDV7ALjR749En8LgdzKhSBJ9zuBChk6Rat_WFVL1VU9i4-xJtHO-YxiJ_ESCHrxf3wvGsgCOAIOu&components=buttons";
    script.async = true;

    script.onload = () => {
      if (window.paypal) {
        window.paypal
          .Buttons({
            // ✅ Pre-check the form before creating a PayPal order
            onClick: () => {
              if (!form.name || !form.email || !form.address) {
                toast.error("Please fill in all fields before using PayPal.");
                throw new Error("Form validation failed.");
              }
            },
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: total.toFixed(2),
                    },
                  },
                ],
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then((details) => {
                handleOrderSubmit(details.id); // 👈 This will now work since form state is filled
              });
            },
            onError: (err) => {
              console.error("PayPal error:", err);
              toast.error("PayPal error. Please try again.");
            },
          })
          .render("#paypal-button-container");
      }
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
      if (paypalContainer) {
        paypalContainer.innerHTML = "";
      }
    };
  }, [total, form]); // 👈 Add `form` as dependency

  return (
    <ClientLayout>
      <div className="container my-5">
        <h2 className="text-center mb-4">Checkout</h2>

        <Row className="justify-content-center">
          {/* Order Form */}
          <Col md={7}>
            <Card className="shadow-sm border-0 rounded-lg mb-4">
              <Card.Body>
                <h5 className="mb-3">Shipping Information</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary" className="w-100">
                    Place Order
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col md={5}>
            <Card className="shadow-sm border-0 rounded-lg">
              <Card.Body>
                <h5 className="text-center">Order Summary</h5>
                <hr />
                {cartData.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between mb-2"
                  >
                    <div>
                      {item.name}{" "}
                      <span className="text-muted">x{item.qty}</span>
                    </div>
                    <div>${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span>${form.shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Discount</span>
                  <span>-${form.discount.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* PayPal Button */}
                <div className="mt-3" id="paypal-button-container"></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </ClientLayout>
  );
};

export default Checkout;
