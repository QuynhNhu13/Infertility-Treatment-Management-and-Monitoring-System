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

const SidebarMana = () => {
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
        <Link to="/manager/reports" className={isActive("/manager/reports") ? "active" : ""}>
          <BarChart2 size={18} />
          <span>Báo cáo</span>
        </Link>
         <Link to={`${ROUTES.MANAGER}/${ROUTES.SCHEDULE_TEMPLATE_LIST}`} className={isActive(`${ROUTES.MANAGER}/${ROUTES.SCHEDULE_TEMPLATE_LIST}`) ? "active" : ""}>
          <Calendar size={18} />
          <span>Lịch làm việc</span>
        </Link>
        <Link to="/manager/registration" className={isActive("/manager/registration") ? "active" : ""}>
          <FileText size={18} />
          <span>Hồ sơ đăng ký</span>
        </Link>
        <Link to="/manager/medical-review" className={isActive("/manager/medical-review") ? "active" : ""}>
          <CheckCircle size={18} />
          <span>Duyệt hồ sơ y tế</span>
        </Link>
      </div>

      <div className="sidebar-section">
        <div className="section-title section-special">QUẢN LÝ CHUYÊN MÔN</div>

        <Link
          to={`${ROUTES.MANAGER}/${ROUTES.SERVICE_MANAGE}`}
          className={isActive(`${ROUTES.MANAGER}/${ROUTES.SERVICE_MANAGE}`) ? "active" : ""}
        >
          <Stethoscope size={18} />
          <span>Phương pháp</span>
        </Link>

        <Link to="" className={isActive("") ? "active" : ""}>
          <Users size={18} />
          <span>Chuyên gia & Bác sĩ</span>
        </Link>
        <Link to="/manager/achievements" className={isActive("/manager/achievements") ? "active" : ""}>
          <Trophy size={18} />
          <span>Thành tựu</span>
        </Link>

        <Link
          to={`${ROUTES.MANAGER}/${ROUTES.LIST_BLOG_MANA}`}
          className={isActive(`${ROUTES.MANAGER}/${ROUTES.LIST_BLOG_MANA}`) ? "active" : ""}
        >
          <Stethoscope size={18} />
          <span>Góc chia sẻ</span>
        </Link>
      </div>
    </aside>
  );
};

export default SidebarMana;
