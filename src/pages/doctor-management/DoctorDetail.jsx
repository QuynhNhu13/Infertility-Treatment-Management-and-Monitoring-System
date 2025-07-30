import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/doctor-management/DoctorDetail.css";
import { GET_DOCTOR_DETAIL_BY_ID } from "../../api/apiUrls";

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  const fetchDoctor = async () => {
    try {
      const res = await fetch(GET_DOCTOR_DETAIL_BY_ID(id));
      const data = await res.json();
      if (res.ok) {
        setDoctor(data.data);
      } else {
        console.error("Lỗi khi lấy thông tin bác sĩ:", data.message);
      }
    } catch (err) {
      console.error("Lỗi khi fetch chi tiết bác sĩ:", err);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (!doctor) {
    return <div className="doctor-detail-loading">Đang tải thông tin bác sĩ...</div>;
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className="doctor-detail-container">
        <div className="doctor-detail-card">
          <img
            src={doctor.imgUrl || "/default-doctor.jpg"}
            alt={doctor.fullName}
            className="doctor-detail-avatar"
          />
          <div className="doctor-detail-info">
            <h2 className="doctor-detail-name">{doctor.fullName}</h2>
            <p className="doctor-detail-position"><strong>Chức vụ:</strong> {doctor.position}</p>
            <p className="doctor-detail-expertise"><strong>Chuyên khoa:</strong> {doctor.expertise}</p>
            {doctor.achievements && (
              <p className="doctor-detail-achievements">
                <strong>Thành tích:</strong> {doctor.achievements}
              </p>
            )}
            <p className="doctor-detail-status">
              <strong>Trạng thái:</strong> {doctor.status === "ACTIVE" ? "Đang làm việc" : doctor.status}
            </p>
            <div className="doctor-detail-description">
              <strong>Mô tả:</strong>
              <div
                className="doctor-description-html"
                dangerouslySetInnerHTML={{ __html: doctor.description || "" }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
