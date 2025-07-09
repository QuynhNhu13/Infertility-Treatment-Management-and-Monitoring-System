import "../styles/Header.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useState } from "react";

const Header = () => {
  const { user, logout, isAuthLoaded } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleBellClick = () => {
    console.log("Thông báo được bấm");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const goToProfile = () => {
    navigate("/ho-so-ca-nhan");
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  const getInitial = (fullName) => {
    return fullName?.trim().charAt(0).toUpperCase() || "?";
  };

  if (!isAuthLoaded) return null;

  return (
    <header className="custom-header">
      <img src={logo} alt="Logo Bệnh viện Thành Nhân" className="logo" />

      <div className="info-block">
        <FaPhoneAlt className="info-icon" />
        <div className="info-text">
          <h5>SỐ ĐIỆN THOẠI</h5>
          <p>0123-456-789</p>
        </div>
      </div>

      <div className="info-block">
        <FaEnvelope className="info-icon" />
        <div className="info-text">
          <h5>EMAIL LIÊN HỆ</h5>
          <p>benhvienthanhnhan136@gmail.com</p>
        </div>
      </div>

      <nav className="nav-links">
        {user ? (
          <>
            <Bell
              className="bell-icon"
              onClick={handleBellClick}
              style={{ cursor: "pointer" }}
              title="Thông báo"
            />

            <div className="user-dropdown">
              <div className="user-info" onClick={toggleDropdown}>
                <div className="user-avatar-circle" title={user.fullName}>
                  {getInitial(user.fullName)}
                </div>
              </div>

              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={goToProfile}>Tài khoản</button>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/dang-ky" className="nav-button-dangky">ĐĂNG KÝ</Link>
            <Link to="/dang-nhap" className="nav-button-dangnhap">ĐĂNG NHẬP</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
