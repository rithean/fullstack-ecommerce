import React, { useContext, useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { CartContext } from "./context/CartContext";
import { BaseUrl } from "./common/BaseUrl";
import axios from "axios";
import ClientLayout from "./common/layouts/ClientLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

const Checkout = () => {
  const getToken = () => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    return adminInfo?.token || "";
  };

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

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address) {
      alert("Please fill all the required fields.");
      return;
    }

    const payload = {
      ...form,
      subtotal,
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
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Order Response:", res.data);

      toast.success("Order placed successfully!");
      alert("Order placed successfully!");

      setTimeout(() => {
        clearCart();
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to place order. Please try again later.");
    }
  };

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
                <Form onSubmit={handleOrderSubmit}>
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

                  <Button type="submit" variant="success" className="w-100">
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </ClientLayout>
  );
};

export default Checkout;
