import "../styles/SidebarMana.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  Calendar,
  BookOpen,
  BarChart2,
  CheckCircle,
  Stethoscope,
  LogOut
} from "lucide-react";
import logobv from "../assets/logobv.png";
import ROUTES from "../routes/RoutePath";
import { useAuth } from "../context/AuthContext";

const SidebarStaff = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

   const handleLogout = () => {
    logout();
    navigate("/dang-nhap");
  };

  return (
    <aside className="sidebar">
      <div className="logobv-container">
        <img src={logobv} alt="Bệnh viện Đa khoa Thành Nhân" className="logobv" />
      </div>

      <div className="sidebar-section">
        <div className="section-title">TÁC VỤ NHÂN VIÊN</div>

        <Link   to={`${ROUTES.STAFF}/${ROUTES.DIRECT_PATIENT_MANA}`}
          className={isActive(`${ROUTES.STAFF}/${ROUTES.DIRECT_PATIENT_MANA}`) ? "active" : ""}>
          <Users size={18} />
          <span>Quản lý tài khoản</span>
        </Link>

        <Link to="/staff/invoice-create" className={isActive("/staff/invoice-create") ? "active" : ""}>
          <FileText size={18} />
          <span>Tạo hóa đơn</span>
        </Link>

        <Link to="/staff/calendar" className={isActive("/staff/calendar") ? "active" : ""}>
          <Calendar size={18} />
          <span>Xem lịch</span>
        </Link>

        <Link to={`${ROUTES.STAFF}/${ROUTES.STAFF_APPOINTMENT_LIST}`}
          className={isActive(`${ROUTES.STAFF}/${ROUTES.STAFF_APPOINTMENT_LIST}`) ? "active" : ""}>
          <BookOpen size={18} />
          <span>Danh sách cuộc hẹn</span>
        </Link>

        <Link
          to={`${ROUTES.STAFF}/${ROUTES.LAB_TEST_RESULT_LIST}`}
          className={isActive(`${ROUTES.STAFF}/${ROUTES.LAB_TEST_RESULT_LIST}`) ? "active" : ""}
        >
          <Users size={18} />
          <span>Kết quả xét nghiệm</span>
        </Link>

        <Link to="/staff/direct-booking" className={isActive("/staff/direct-booking") ? "active" : ""}>
          <CheckCircle size={18} />
          <span>Đặt lịch hẹn trực tiếp</span>
        </Link>

        <Link to="/staff/consultation-forms" className={isActive("/staff/consultation-forms") ? "active" : ""}>
          <Stethoscope size={18} />
          <span>Biểu mẫu tư vấn</span>
        </Link>

                <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarStaff;
