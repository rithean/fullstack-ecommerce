import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/admin/Dashboard";
import Login from "./components/auth/Login";

import Brands from "./components/admin/brands/Brand";
import Category from "./components/admin/categories/Category";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/brands" element={<Brands />} />
        <Route path="/admin/categories" element={<Category />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
