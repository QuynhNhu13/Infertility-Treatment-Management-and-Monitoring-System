// src/components/Header.jsx
import "../styles/Header.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useNotification } from "../components/NotificationContext"; // ✅ dùng context

const Header = () => {
  const { user, logout, isAuthLoaded } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const socketRef = useRef(null);

  const {
    notifications,
    fetchNotifications
  } = useNotification();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = () => {
    navigate("/thong-bao");
    // Không cần reset count ở đây nếu NotificationPage đã gọi markAllAsRead
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

  // WebSocket để nhận thông báo mới
  useEffect(() => {
    if (!user || !user.email) return;

    const socketUrl = `ws://localhost:8080/ws/notifications/${user.email}`;
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log("🔌 WebSocket connected:", socketUrl);
    };

    socketRef.current.onmessage = (event) => {
      console.log("🔔 Thông báo mới:", event.data);
      fetchNotifications(); // Khi có noti mới thì gọi lại API để cập nhật
    };

    socketRef.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("🔌 WebSocket disconnected");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [user, fetchNotifications]);

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
            <div className="notification-container" onClick={handleBellClick}>
              <Bell className="bell-icon" title="Thông báo" />
              {unreadCount > 0 && (
  <span className="notification-dot"></span>
)}

            </div>

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
