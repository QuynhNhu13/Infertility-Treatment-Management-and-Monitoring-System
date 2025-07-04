import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { GG_LOGIN, REGISTER, RESEND_VERIFICATION_EMAIL } from "../../api/apiUrls";
import Header from "../../components/Header.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/login-register/LoginForm.css";
import doctorBg from "../../assets/doctor-bg.png";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await fetch(REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          <>
            Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.
            <br />
            Nếu chưa nhận được, vui lòng{" "}
            <span
              onClick={resendConfirmationEmail}
              style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
            >
              bấm vào đây
            </span>{" "}
            để gửi lại.
          </>
        );
        setErrorMessage("");
      } else {
        const msg = data.message;
        if (typeof msg === "object") {
          setErrorMessage(msg);
        } else {
          setErrorMessage(msg || "Đăng ký thất bại");
        }
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const resendConfirmationEmail = async () => {
    try {
      const response = await fetch(RESEND_VERIFICATION_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccessMessage("Email xác nhận đã được gửi lại! Vui lòng kiểm tra hộp thư.");
        setErrorMessage("");
      } else {
        let msg = "Không thể gửi lại email xác nhận.";
        try {
          const errorData = await response.json();
          msg = errorData.message || msg;
        } catch (e) {
          console.warn("Không có JSON hợp lệ trong phản hồi:", e);
        }
        setErrorMessage(msg);
      }
    } catch (error) {
      console.error("Lỗi gửi lại email xác nhận:", error);
      setErrorMessage("Đã xảy ra lỗi khi gửi lại email. Vui lòng thử lại.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = GG_LOGIN;
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
            <h2>ĐĂNG KÝ</h2>
            <p className="register-text">
              Bạn đã có tài khoản?{" "}
              <a href="/dang-nhap" className="register-link">
                Đăng nhập
              </a>
            </p>

            <form onSubmit={handleRegister} className="login-form">
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Họ tên"
                  value={fullName}
                  required
                  onChange={(e) => setFullName(e.target.value)}
                  onInvalid={(e) => e.target.setCustomValidity("Vui lòng nhập họ tên")}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>

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

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  onInvalid={(e) => e.target.setCustomValidity("Vui lòng nhập mật khẩu")}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onInvalid={(e) => e.target.setCustomValidity("Vui lòng xác nhận mật khẩu")}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>

              <button type="submit" className="login-button">
                Đăng ký
              </button>

              {errorMessage && (
                <div className="error-box">
                  {typeof errorMessage === "string" ? (
                    <p>{errorMessage}</p>
                  ) : (
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                      {Object.entries(errorMessage).map(([field, msg]) => (
                        <li key={field}>
                          <strong>{field}:</strong> {msg}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {successMessage && (
                <div className="success-box">
                  <p style={{ whiteSpace: "pre-line" }}>{successMessage}</p>
                </div>
              )}
            </form>

            <div className="login-footer">
              <div className="divider">
                <span className="line" />
                <span className="or">hoặc</span>
                <span className="line" />
              </div>
              <button className="google-button" onClick={handleGoogleLogin}>
                <span className="google-icon">G</span> Đăng nhập bằng Google
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterForm;
