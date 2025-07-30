import "../styles/SidebarUser.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCog, Users, LogOut, ArrowLeft } from "lucide-react";
import logobv from "../assets/logobv.png";
import { useAuth } from "../context/AuthContext";
import ROUTES from "../routes/RoutePath";

const SidebarAdmin = () => {
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
        <div className="section-title">QUẢN LÝ HỆ THỐNG</div>

        <Link
          to={`${ROUTES.ADMIN}/${ROUTES.ADMIN_MANA_ACC}`}
          className={isActive(`${ROUTES.ADMIN}/${ROUTES.ADMIN_MANA_ACC}`) ? "active" : ""}
        >
          <Users size={18} />
          <span>Quản lý tài khoản</span>
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

export default SidebarAdmin;
