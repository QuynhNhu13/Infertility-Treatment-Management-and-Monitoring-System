import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { LOGIN, GG_LOGIN, PROFILE_LOGIN } from "../../api/apiUrls";
import ROUTES from "../../routes/RoutePath";

import Header from "../../components/Header.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/login-register/LoginForm.css";

import doctorBg from "../../assets/doctor-bg.png";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Vui lòng nhập email hợp lệ!");
      return;
    } else {
      setEmailError("");
    }

    try {
      const response = await fetch(LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.data.token;

        localStorage.setItem("token", token);

        const profileResponse = await fetch(PROFILE_LOGIN, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const user = {
            fullName: profileData.data.fullName,
            role: profileData.data.email, 
            token: token,
          };

          login(user);
          setErrorMessage("");

          switch (user.role) {
            case "ROLE_ADMIN":
              navigate(ROUTES.ADMIN);
              break;
            case "ROLE_MANAGER":
              navigate(ROUTES.MANAGER);
              break;
            case "ROLE_DOCTOR":
              navigate(ROUTES.DOCTOR);
              break;
            case "ROLE_STAFF":
              navigate(ROUTES.STAFF);
              break;
            case "ROLE_USER":
              navigate(ROUTES.HOME);
              break;
            default:
              navigate(ROUTES.HOME);
              break;
          }
        } else {
          setErrorMessage("Đăng nhập thành công nhưng không lấy được thông tin người dùng.");
        }
      } else {
        setErrorMessage("Email hoặc mật khẩu không đúng.\nVui lòng đăng nhập lại!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
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
            <h2>ĐĂNG NHẬP</h2>
            <p className="register-text">
              Bạn chưa có tài khoản?{" "}
              <a href="/dang-ky" className="register-link">
                Đăng ký
              </a>
            </p>

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
              </div>
              {emailError && <div className="error-box">{emailError}</div>}

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {errorMessage && (
                <div className="error-box">
                  <p style={{ whiteSpace: "pre-line" }}>{errorMessage}</p>
                </div>
              )}

              <button type="submit" className="login-button">
                Đăng nhập
              </button>
            </form>

            <div className="login-footer">
              <a href="/quen-mat-khau" className="forgot-link">
                Quên mật khẩu ?
              </a>
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

export default LoginForm;
