import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"; 

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!form.name) {
      errors.name = "Name is required.";
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!form.password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    if (!validateForm()) return;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/register", 
        form
      );
      const { message } = res.data;
      alert(message); 
      navigate("/login"); 
    } catch (err) {
      const msg = err.response?.data?.message || "Sign Up failed";
      setError(msg);
    }
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
            Create an Account
          </h3>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
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
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={{
                    fontSize: "16px",
                    paddingLeft: "1.5rem", 
                  }}
                />
              </div>
              {validationErrors.name && (
                <div className="text-danger">{validationErrors.name}</div>
              )}
            </div>

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
                    paddingLeft: "1.5rem", 
                  }}
                />
              </div>
              {validationErrors.email && (
                <div className="text-danger">{validationErrors.email}</div>
              )}
            </div>

            <div className="mb-3">
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
                    paddingLeft: "1.5rem", 
                  }}
                />
              </div>
              {validationErrors.password && (
                <div className="text-danger">{validationErrors.password}</div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
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
                  name="confirmPassword"
                  id="confirmPassword"
                  className="form-control"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    fontSize: "16px",
                    paddingLeft: "1.5rem", 
                  }}
                />
              </div>
              {validationErrors.confirmPassword && (
                <div className="text-danger">
                  {validationErrors.confirmPassword}
                </div>
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
              Sign Up
            </button>

            {/* Redirect to Login */}
            <div className="text-center mt-3">
              <p
                style={{
                  fontSize: "14px",
                  color: "#6c63ff",
                }}
              >
                Already have an account?{" "}
                <a
                  href="#!"
                  onClick={() => navigate("/login")}
                  style={{
                    color: "#6c63ff",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Log In
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
