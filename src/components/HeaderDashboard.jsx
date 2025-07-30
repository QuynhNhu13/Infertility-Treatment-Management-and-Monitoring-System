import "../styles/HeaderDashboard.css";
import logo from "../assets/logobv.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import ROUTES from "../routes/RoutePath";

const HeaderDashboard = () => {
  const { user, logout, isAuthLoaded } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDateOnly = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTimeOnly = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
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
    navigate(ROUTES.LOGIN);
  };

  const getInitial = (fullName) => {
    return fullName?.trim().charAt(0).toUpperCase() || "?";
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Quản trị viên";
      case "ROLE_MANAGER":
        return "Quản lý";
      case "ROLE_STAFF":
        return "Nhân viên y tế";
      case "ROLE_DOCTOR":
        return "Bác sĩ";
      default:
        return "Người dùng";
    }
  };

  if (!isAuthLoaded) return null;

  return (
    <header className="dashboard-header">
      <div className="dashboard-left-section">
        <div className="dashboard-welcome-text">
          <h3>Xin chào, {user?.fullName || "Người dùng"}!</h3>
          <p>Vai trò: {getRoleLabel(user?.role)}</p>
        </div>
      </div>

      <nav className="dashboard-nav-links">
        <div className="dashboard-time-text">
          <div>{formatDateOnly(currentTime)}</div>
          <div>{formatTimeOnly(currentTime)}</div>
        </div>

        <div className="dashboard-user-dropdown">
          <div className="dashboard-user-info" onClick={toggleDropdown}>
            <div className="dashboard-avatar-circle" title={user?.fullName}>
              {getInitial(user?.fullName)}
            </div>
          </div>

          {/* {showDropdown && (
            <div className="dashboard-dropdown-menu">
              <button onClick={goToProfile}>Tài khoản</button>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )} */}
        </div>
      </nav>
    </header>
  );
};

export default HeaderDashboard;
