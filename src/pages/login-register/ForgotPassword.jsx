import React, { useState } from "react";
import { FORGOT_PASSWORD } from "../../api/apiUrls";
import { FaEnvelope } from "react-icons/fa";

import Header from "../../components/Header.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/login-register/LoginForm.css";
import doctorBg from "../../assets/doctor-bg.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccessMessage("Liên kết đặt lại mật khẩu đã được gửi tới email của bạn.");
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Gửi email thất bại.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu quên mật khẩu:", error);
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      <div
        className="login-background"
        style={{
          backgroundImage: `url(${doctorBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="login-overlay">
          <div className="login-container">
            <h2>QUÊN MẬT KHẨU</h2>
            <p className="register-text">Nhập email bạn đã đăng ký để đặt lại mật khẩu!</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  onInvalid={(e) => e.target.setCustomValidity("Vui lòng nhập email hợp lệ")}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>

              <button type="submit" className="login-button">
                Gửi yêu cầu
              </button>

              {successMessage && (
                <div className="success-box">
                  <p>{successMessage}</p>
                </div>
              )}
              {errorMessage && (
                <div className="error-box">
                  <p>{errorMessage}</p>
                </div>
              )}
            </form>

            <div className="login-footer">
              <a href="/dang-nhap" className="forgot-link">
                ← Quay lại đăng nhập
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
