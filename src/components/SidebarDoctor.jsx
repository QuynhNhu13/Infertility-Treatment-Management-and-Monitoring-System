import "../styles/SidebarMana.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../routes/RoutePath";

import {
  BarChart2,
  Calendar,
  FileText,
  CheckCircle,
  Stethoscope,
  Users,
  Trophy,
  BookOpen,
} from "lucide-react";
import logobv from "../assets/logobv.png";

const SidebarDoctor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="logobv-container">
        <img src={logobv} alt="Bệnh viện Đa khoa Thành Nhân" className="logobv" />
      </div>

      <div className="sidebar-section">
        <div className="section-title">QUẢN LÝ HÀNH CHÍNH</div>
        <Link to="/manager/schedule" className={isActive("/manager/schedule") ? "active" : ""}>
          <Calendar size={18} />
          <span>Đánh giá từ bệnh nhân</span>
        </Link>
        <Link to="/manager/registration" className={isActive("/manager/registration") ? "active" : ""}>
          <FileText size={18} />
          <span>Lịch trình</span>
        </Link>
        <Link to="/manager/medical-review" className={isActive("/manager/medical-review") ? "active" : ""}>
          <CheckCircle size={18} />
          <span>Đơn xin nghỉ phép</span>
        </Link>
      </div>

      <div className="sidebar-section">
        <div className="section-title section-special">QUẢN LÝ CHUYÊN MÔN</div>

        <Link
          to={`${ROUTES.DOCTOR}/${ROUTES.DOCTOR_APPOINTMENT_MANAGER}`}
          className={isActive(`${ROUTES.DOCTOR}/${ROUTES.DOCTOR_APPOINTMENT_MANAGER}`) ? "active" : ""}
        >
          <Users size={18} />
          <span>Hồ sơ bệnh nhân</span>
        </Link>
        <Link to={`${ROUTES.MANAGER}/${ROUTES.SERVICE_MANAGE}`} className={isActive("/manager/methods") ? "active" : ""}>
          <Stethoscope size={18} />
          <span>Tạo kế hoạch điều trị</span>
        </Link>

        <Link
          to={`${ROUTES.DOCTOR}/${ROUTES.DOCTOR_BLOG_MANAGER}`}
          className={isActive(`${ROUTES.DOCTOR}/${ROUTES.DOCTOR_BLOG_MANAGER}`) ? "active" : ""}
        >
          <Users size={18} />
          <span>Góc chia sẻ</span>
        </Link>

      </div>
    </aside>
  );
};

export default SidebarDoctor;
