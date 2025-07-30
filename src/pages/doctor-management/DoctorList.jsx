import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_DOCTORS_IN_HOME } from "../../api/apiUrls";
import "../../styles/doctor-management/DoctorList.css";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

export default function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await fetch(GET_DOCTORS_IN_HOME);
            const data = await res.json();
            if (res.ok) {
                setDoctors(data.data);
            } else {
                console.error("Lỗi khi lấy danh sách bác sĩ:", data.message);
            }
        } catch (err) {
            console.error("Lỗi khi fetch bác sĩ:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    if (loading) {
        return (
            <>
                <Header />
                <Navbar />
                <div className="doctor-list-container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải danh sách bác sĩ...</p>
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
            <div className="doctor-list-container">
                <div className="doctor-list-header">
                    <div className="header-content">
                        <h1 className="doctor-list-title">
                            <span className="title-highlight">ĐỘI NGŨ CHUYÊN GIA</span>
                            <span className="title-main">BÁC SĨ</span>
                        </h1>
                        <p className="doctor-list-subtitle">
                            Đội ngũ bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm, luôn sẵn sàng chăm sóc sức khỏe của bạn
                        </p>
                    </div>
                    <div className="header-decoration">
                        <div className="decoration-circle"></div>
                        <div className="decoration-line"></div>
                    </div>
                </div>

                <div className="doctor-list-stats">
                    <div className="stat-item">
                        <span className="stat-number">{doctors.length}+</span>
                        <span className="stat-label">Bác sĩ</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">15+</span>
                        <span className="stat-label">Chuyên khoa</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">24/7</span>
                        <span className="stat-label">Hỗ trợ</span>
                    </div>
                </div>

                <div className="doctor-list-grid">
                    {doctors.map((doc, index) => (
                        <div
                            key={doc.id}
                            className="doctor-list-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="card-header">
                                <div className="doctor-avatar-container">
                                    <img
                                        src={doc.imgUrl || "/default-doctor.jpg"}
                                        alt={doc.fullName}
                                        className="doctor-list-avatar"
                                        onError={(e) => {
                                            e.target.src = "/default-doctor.jpg";
                                        }}
                                    />

                                </div>
                            </div>

                            <div className="card-content">
                                <h3 className="doctor-list-name">{doc.fullName}</h3>
                                <div className="doctor-expertise-badge">

                                    <span className="doctor-list-expertise">{doc.expertise}</span>
                                </div>
                                <p className="doctor-list-description">
                                    {doc.description?.slice(0, 100) || "Bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm"}
                                    {doc.description?.length > 100 && "..."}
                                </p>
                            </div>

                            <div className="card-footer">
                                <div className="doctor-list-buttons">
                                    <button
                                        className="doctor-list-detail-button"
                                        onClick={() => navigate(`/bac-si/${doc.id}`)}
                                    >

                                        Xem chi tiết
                                    </button>
                                    <button
                                        className="doctor-list-appointment-button"
                                        onClick={() => {
                                            if (user) {
                                                navigate(`/dat-lich-kham?doctorId=${doc.id}`);
                                            } else {
                                                alert("Vui lòng đăng nhập để đặt lịch khám!");
                                                navigate("/dang-nhap");
                                            }
                                        }}
                                    >

                                        Đặt lịch khám
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {doctors.length === 0 && !loading && (
                    <div className="empty-state">

                        <h3>Chưa có bác sĩ nào</h3>
                        <p>Hiện tại chưa có thông tin bác sĩ. Vui lòng quay lại sau!</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}