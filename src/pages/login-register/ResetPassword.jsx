import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { RESET_PASSWORD } from "../../api/apiUrls";

import Header from "../../components/Header.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/login-register/LoginForm.css";

import doctorBg from "../../assets/doctor-bg.png";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setErrorMessage("Liên kết không hợp lệ hoặc đã hết hạn.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu mới và xác nhận không khớp.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch(RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: newPassword,
          confirmPassword,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Mật khẩu đã được đặt lại thành công! Vui lòng đăng nhập!");
        setErrorMessage("");
        setTimeout(() => navigate("/dang-nhap"), 3000);
      } else {
        const errorData = await response.json();
        let msg = "Đặt lại mật khẩu thất bại.";

        if (typeof errorData === "string") {
          msg = errorData;
        } else if (errorData.message) {
          msg = errorData.message;
        } else if (errorData.password) {
          msg = Array.isArray(errorData.password)
            ? errorData.password.join(", ")
            : errorData.password;
        }

        setErrorMessage(msg);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu reset mật khẩu:", error);
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
            <h2>ĐẶT LẠI MẬT KHẨU</h2>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  onInvalid={(e) => e.target.setCustomValidity("Mật khẩu ít nhất 6 ký tự")}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

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

              <button type="submit" className="login-button">
                Đặt lại mật khẩu
              </button>
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

export default ResetPassword;
