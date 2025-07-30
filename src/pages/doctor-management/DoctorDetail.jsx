import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/doctor-management/DoctorDetail.css";
import { GET_DOCTOR_DETAIL_BY_ID } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const res = await fetch(GET_DOCTOR_DETAIL_BY_ID(id));
      const data = await res.json();
      if (res.ok) {
        setDoctor(data.data);
      } else {
        setError("Không thể tải thông tin bác sĩ");
        console.error("Lỗi khi lấy thông tin bác sĩ:", data.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải thông tin");
      console.error("Lỗi khi fetch chi tiết bác sĩ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="doctor-detail-container">
          <div className="doctor-detail-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin bác sĩ...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !doctor) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="doctor-detail-container">
          <div className="doctor-detail-error">
            <div className="error-icon">⚠️</div>
            <h3>Không thể tải thông tin bác sĩ</h3>
            <p>{error || "Bác sĩ không tồn tại hoặc đã bị xóa"}</p>
            <button 
              className="back-button"
              onClick={() => navigate('/bac-si')}
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className="doctor-detail-container">
      
        <div className="doctor-detail-card">
          {/* Header Section */}
          <div className="doctor-header">
            <div className="doctor-avatar-section">
              <div className="avatar-container">
                <img
                  src={doctor.imgUrl || "/default-doctor.jpg"}
                  alt={doctor.fullName}
                  className="doctor-detail-avatar"
                  onError={(e) => {
                    e.target.src = "/default-doctor.jpg";
                  }}
                />
                <div className="status-indicator">
                  <span className={`status-dot ${doctor.status === "ACTIVE" ? "active" : "inactive"}`}></span>
                  {doctor.status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"}
                </div>
              </div>
            </div>

            <div className="doctor-basic-info">
              <h1 className="doctor-detail-name">{doctor.fullName}</h1>
              <div className="doctor-title-badge">
               
                <span>{doctor.position || "Bác sĩ"}</span>
              </div>
              <div className="doctor-expertise-tag">
                
                <span>{doctor.expertise}</span>
              </div>
            </div>

            <div className="doctor-actions">
              <button
                className="appointment-btn primary"
                onClick={() => {
                  if (user) {
                    navigate(`/dat-lich-kham?doctorId=${doctor.id}`);
                  } else {
                    alert("Vui lòng đăng nhập để đặt lịch khám!");
                    navigate("/dang-nhap");
                  }
                }}
              >
                <span className="btn-icon">📅</span>
                Đặt lịch khám
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="doctor-content">
            <div className="content-grid">
              {/* Main Info */}
              <div className="main-content">
                <div className="info-section">
                  <h3 className="section-title-a">
                    <span className="title-icon">📋</span>
                    Thông tin chi tiết
                  </h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Chức vụ:</label>
                      <span>{doctor.position || "Chưa cập nhật"}</span>
                    </div>
                    <div className="info-item">
                      <label>Chuyên khoa:</label>
                      <span>{doctor.expertise}</span>
                    </div>
                    <div className="info-item">
                      <label>Trạng thái:</label>
                      <span className={`status-text ${doctor.status === "ACTIVE" ? "active" : "inactive"}`}>
                        {doctor.status === "ACTIVE" ? "Đang làm việc" : doctor.status}
                      </span>
                    </div>
                  </div>
                </div>

                {doctor.achievements && (
                  <div className="achievements-section">
                    <h3 className="section-title-a">
                      <span className="title-icon">🏆</span>
                      Thành tích & Kinh nghiệm
                    </h3>
                    <div className="achievements-content">
                      <p>{doctor.achievements}</p>
                    </div>
                  </div>
                )}

                <div className="description-section">
                  <h3 className="section-title-a">
                    <span className="title-icon">📝</span>
                    Giới thiệu
                  </h3>
                  <div className="description-content">
                    {doctor.description ? (
                      <div
                        className="doctor-description-html"
                        dangerouslySetInnerHTML={{ __html: doctor.description }}
                      />
                    ) : (
                      <p className="no-description">Chưa có thông tin giới thiệu.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="sidebar-content">
                <div className="quick-info-card">
                  <h4>Thông tin nhanh</h4>
                  <div className="quick-info-list">
                    <div className="quick-info-item">
                      <span className="info-icon">🏥</span>
                      <div>
                        <label>Chuyên khoa</label>
                        <span>{doctor.expertise}</span>
                      </div>
                    </div>
 
                    <div className="quick-info-item">
                      <span className="info-icon">📍</span>
                      <div>
                        <label>Địa điểm</label>
                        <span>Bệnh viện Đa khoa Thành Nhân</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="appointment-card">
                  <h4>Đặt lịch nhanh</h4>
                  <p>Đặt lịch khám với bác sĩ {doctor.fullName} ngay hôm nay!</p>
                  <button
                    className="quick-appointment-btn"
                    onClick={() => {
                      if (user) {
                        navigate(`/dat-lich-kham?doctorId=${doctor.id}`);
                      } else {
                        alert("Vui lòng đăng nhập để đặt lịch khám!");
                        navigate("/dang-nhap");
                      }
                    }}
                  >
                    <span className="btn-icon">⚡</span>
                    Đặt lịch ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}