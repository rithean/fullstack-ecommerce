import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email && location.state?.otp) {
      setEmail(location.state.email);
      setOtp(location.state.otp);
    } else {
      navigate("/auth/forgot-password"); 
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const payload = {
      email,
      password: newPassword,
      password_confirmation: confirmPassword,
      otp,
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/reset-password",
        payload
      );
      setStatus(res.data.message || "Password reset successfully.");

      setTimeout(() => {
        setLoading(false);
        navigate("/auth/login"); 
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Password reset failed.";
      setError(msg);
      setLoading(false);
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
            Reset Password
          </h3>

          {status && <div className="alert alert-success">{status}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  fontSize: "16px",
                  padding: "10px",
                }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password_confirmation" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                className="form-control"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  fontSize: "16px",
                  padding: "10px",
                }}
              />
            </div>

            {/* Hidden OTP field, you can remove it if you prefer */}
            <input type="hidden" value={otp} />

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                borderRadius: "0.5rem",
                fontWeight: "bold",
                padding: "10px",
                fontSize: "16px",
              }}
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
