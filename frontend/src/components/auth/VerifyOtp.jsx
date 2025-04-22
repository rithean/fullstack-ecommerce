import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate("/auth/forgot-password");
    }
  }, [location.state, navigate]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        let newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("Text").trim().slice(0, 6);
    const digits = pastedData.split("").filter((char) => /[0-9]/.test(char));
    if (digits.length === 6) {
      setOtp(digits);
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    setLoading(true);

    const fullOtp = otp.join("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/verify-otp",
        {
          email,
          otp: fullOtp,
        }
      );

      setStatus(res.data.message || "OTP verified successfully.");
      setTimeout(() => {
        setLoading(false);
        navigate("/auth/reset-password", { state: { email, otp: fullOtp } });
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP.";
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
            Verify OTP
          </h3>

          {status && <div className="alert alert-success">{status}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 text-center" onPaste={handlePaste}>
              <label htmlFor="otp" className="form-label d-block mb-3">
                Enter the 6-digit code sent to your email
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="form-control"
                    style={{
                      width: "45px",
                      height: "50px",
                      textAlign: "center",
                      fontSize: "20px",
                      borderRadius: "0.5rem",
                      border: "1px solid #ccc",
                    }}
                  />
                ))}
              </div>
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
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
