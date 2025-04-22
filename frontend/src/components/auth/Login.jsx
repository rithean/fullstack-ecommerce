import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AdminAuthContext } from "../context/AdminAuth";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Login = () => {
  const { login } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        data
      );
      const result = res.data;

      if (result.status === true) {
        const adminInfo = {
          token: result.token,
          id: result.user.id,
          name: result.user.name,
        };
        localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
        login(adminInfo);
        setSuccessMessage("Login Successful");
        if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setErrorMessage(result.error || "An error occurred during login.");
        toast.error(result.error || "An error occurred during login.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
      console.log(error);
    }
  };

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  const handleSignup = () => {
    navigate("/auth/signup");
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
      <ToastContainer />
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

          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
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
                  id="email"
                  className="form-control"
                  placeholder="example@mail.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  style={{
                    fontSize: "16px",
                    paddingLeft: "1.5rem",
                  }}
                />
              </div>
              {errors.email && (
                <div className="text-danger">{errors.email.message}</div>
              )}
            </div>

            {/* Password Field */}
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
                  id="password"
                  className="form-control"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  style={{
                    fontSize: "16px",
                    paddingLeft: "1.5rem",
                  }}
                />
              </div>
              {errors.password && (
                <div className="text-danger">{errors.password.message}</div>
              )}
            </div>

            {/* Submit Button */}
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

            {/* Forgot Password */}
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

            {/* Signup Redirect */}
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
