// SidebarUser.jsx
import "../styles/SidebarUser.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, FileText, LogOut, BookOpen, ArrowLeft } from "lucide-react";
import logobv from "../assets/logobv.png";
import { useAuth } from "../context/AuthContext";
import ROUTES from "../routes/RoutePath";

const SidebarUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/dang-nhap");
  };

  const handleBackHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <aside className="sidebar">
      <div className="logobv-container">
        <img src={logobv} alt="Bệnh viện Đa khoa Thành Nhân" className="logobv" />
      </div>

      <div className="sidebar-section">
        <div className="section-title">TÀI KHOẢN CÁ NHÂN</div>

        <Link to={`${ROUTES.USER}/${ROUTES.PROFILE_VIEW}`}
          className={isActive(`${ROUTES.USER}/${ROUTES.PROFILE_VIEW}`) ? "active" : ""}>
          <User size={18} />
          <span>Thông tin tài khoản</span>
        </Link>

        <Link to={`${ROUTES.USER}/${ROUTES.MEDICAL_RECORD_HISTORY_VIEW}`} className={isActive(`${ROUTES.USER}/${ROUTES.MEDICAL_RECORD_HISTORY_VIEW}`) ? "active" : ""}>
          <FileText size={18} />
          <span>Hồ sơ điều trị</span>
        </Link>

        <Link to={`${ROUTES.USER}/${ROUTES.USER_APPOINTMENT_LIST}`}
          className={isActive(`${ROUTES.USER}/${ROUTES.USER_APPOINTMENT_LIST}`) ? "active" : ""}>
          <BookOpen size={18} />
          <span>Danh sách lịch khám</span>
        </Link>

        <button className="logout-btn" onClick={handleBackHome}>
          <ArrowLeft size={18} />
          <span>Trang chủ</span>
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarUser;
