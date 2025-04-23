import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/auth/Login";

import Brands from "./components/admin/brands/Brand";
import Category from "./components/admin/categories/Category";
import SignUp from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOtp from "./components/auth/VerifyOtp";
import ResetPassword from "./components/auth/ResetPassword";
import { AdminRequireAuth } from "./components/admin/AdminRequireAuth";
import { ToastContainer } from "react-bootstrap";
import About from "./components/About";
import Contact from "./components/Contact";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Product from "./components/admin/products/Product";
import Slideshow from "./components/admin/slideshow/Slideshow";
import Logo from "./components/admin/logo/Logo";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/verify-otp" element={<VerifyOtp />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRequireAuth>
                <Dashboard />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/brands"
            element={
              <AdminRequireAuth>
                <Brands />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRequireAuth>
                <Category />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRequireAuth>
                <Product />
              </AdminRequireAuth>
            }
          />

          <Route
            path="/admin/slideshows"
            element={
              <AdminRequireAuth>
                <Slideshow />
              </AdminRequireAuth>
            }
          />

          <Route path="/admin/logos" element={
            <AdminRequireAuth>
              <Logo />
            </AdminRequireAuth>
          } />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
