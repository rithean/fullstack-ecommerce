import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/auth/Login";

import Brands from "./components/admin/brands/Brand";
import Category from "./components/admin/categories/Category";
import SignUp from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOtp from "./components/auth/VerifyOtp";
import ResetPassword from "./components/auth/ResetPassword";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/brands" element={<Brands />} />
        <Route path="/admin/categories" element={<Category />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
