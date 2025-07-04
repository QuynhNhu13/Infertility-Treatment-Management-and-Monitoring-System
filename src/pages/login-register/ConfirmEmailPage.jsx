import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGISTER_CONFIRM_EMAIL } from "../../api/apiUrls";

import Header from "../../components/Header.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/login-register/LoginForm.css";
import doctorBg from "../../assets/doctor-bg.png";

const ConfirmEmailPage = () => {
  const [message, setMessage] = useState("Đang xác nhận email...");
  const [isSuccess, setIsSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setMessage("Không tìm thấy token xác nhận.");
      setIsSuccess(false);
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await fetch(`${REGISTER_CONFIRM_EMAIL}?token=${token}`);

        const result = await response.json();

        if (response.ok) {
          setMessage(result.message || "Xác nhận email thành công! Vui lòng đăng nhập!");
          setIsSuccess(true);

          setTimeout(() => {
            navigate("/dang-nhap");
          }, 5000);
        } else {
          setMessage(result.message || "Xác nhận email thất bại.");
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("Lỗi xác nhận email:", error);
        setMessage("Đã xảy ra lỗi khi xác nhận email.");
        setIsSuccess(false);
      }
    };

    confirmEmail();
  }, [navigate]);

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
            <h2>XÁC NHẬN EMAIL</h2>

            {isSuccess === true && (
              <div className="success-box" style={{ textAlign: "center", marginTop: "20px" }}>
                <p>{message}</p>
              </div>
            )}

            {isSuccess === false && (
              <div className="success-box" style={{ textAlign: "center", marginTop: "20px" }}>
                <p>{message}</p>
              </div>
            )}

            {isSuccess === null && (
              <p style={{ textAlign: "center", marginTop: "20px", color: "#333" }}>{message}</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConfirmEmailPage;
