import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Importing FontAwesome icons

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate Password
    if (!form.password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({}); // Clear validation errors on each submit

    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        form
      );
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #667eea, #764ba2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          border: "none",
          borderRadius: "1rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          backgroundColor: "#ffffffee",
        }}
      >
        <div className="card-body">
          <h3
            className="text-center mb-4"
            style={{ fontWeight: 600, color: "#333" }}
          >
            Welcome Back 👋
          </h3>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{
                    backgroundColor: "#6c63ff",
                    borderColor: "#6c63ff",
                    color: "#fff",
                    borderTopLeftRadius: "0.5rem",
                    borderBottomLeftRadius: "0.5rem",
                  }}
                >
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="example@mail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{
                    fontSize: "16px",
                    paddingLeft: "1.5rem", // To make space for the icon
                  }}
                />
              </div>
              {validationErrors.email && (
                <div className="text-danger">{validationErrors.email}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{
                    backgroundColor: "#6c63ff",
                    borderColor: "#6c63ff",
                    color: "#fff",
                    borderTopLeftRadius: "0.5rem",
                    borderBottomLeftRadius: "0.5rem",
                  }}
                >
                  <FaLock />
                </span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{
                    fontSize: "16px",
                    paddingLeft: "1.5rem", // To make space for the icon
                  }}
                />
              </div>
              {validationErrors.password && (
                <div className="text-danger">{validationErrors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                borderRadius: "0.5rem",
                fontWeight: "bold",
                padding: "10px",
                fontSize: "16px",
              }}
            >
              Login
            </button>

            {/* Forgot Password link */}
            <div className="text-center mt-3">
              <a
                href="#!"
                onClick={handleForgotPassword}
                style={{
                  color: "#6c63ff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign Up link */}
            <div className="text-center mt-2">
              <p
                style={{
                  fontSize: "14px",
                  color: "#6c63ff",
                }}
              >
                Don't have an account?{" "}
                <a
                  href="#!"
                  onClick={handleSignup}
                  style={{
                    color: "#6c63ff",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
