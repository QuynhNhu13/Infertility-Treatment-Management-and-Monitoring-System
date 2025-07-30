import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_DOCTORS_IN_HOME } from "../../api/apiUrls";
import "../../styles/doctor-management/DoctorList.css";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    const fetchDoctors = async () => {
        try {
            const res = await fetch(GET_DOCTORS_IN_HOME);
            const data = await res.json();
            if (res.ok) {
                setDoctors(data.data);
            } else {
                console.error("Lỗi khi lấy danh sách bác sĩ:", data.message);
            }
        } catch (err) {
            console.error("Lỗi khi fetch bác sĩ:", err);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <>
        <Header />
        <Navbar />
            <div className="doctor-list-container">
                <h2 className="doctor-list-title">ĐỘI NGŨ BÁC SĨ</h2>
                <div className="doctor-list-grid">
                    {doctors.map((doc) => (
                        <div key={doc.id} className="doctor-list-card">
                            <img
                                src={doc.imgUrl || "/default-doctor.jpg"}
                                alt={doc.fullName}
                                className="doctor-list-avatar"
                            />
                            <h3 className="doctor-list-name">{doc.fullName}</h3>
                            <p className="doctor-list-expertise">{doc.expertise}</p>
                            <p className="doctor-list-description">
                                {doc.description?.slice(0, 80)}...
                            </p>
                            <div className="doctor-list-buttons">
                                <button
                                    className="doctor-list-detail-button"
                                    onClick={() => navigate(`/bac-si/${doc.id}`)}
                                >
                                    Xem chi tiết
                                </button>
                                <button
                                    className="doctor-list-appointment-button"
                                    onClick={() => navigate(`/dat-lich-kham?doctorId=${doc.id}`)}
                                >
                                    Đặt lịch khám
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}