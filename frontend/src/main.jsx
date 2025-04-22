import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/style.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import { AdminAuthProvider } from "./components/context/AdminAuth.jsx";
import { CartProvider } from "./components/context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminAuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AdminAuthProvider>
  </StrictMode>
);
