import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorFormCreateModal from "../../pages/doctor-management/DoctorFormCreateModal";
import DoctorFormUpdateModal from "../../pages/doctor-management/DoctorFormUpdateModal";
import { useAuth } from "../../context/AuthContext";
import { GET_DOCTORS_IN_HOME } from "../../api/apiUrls";
import "../../styles/doctor-management/DoctorManager.css";

export default function DoctorManager() {
  const { getAuthHeader } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await fetch(GET_DOCTORS_IN_HOME, {
        method: "GET",
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (res.ok) setDoctors(data.data);
      else console.error("Lỗi khi lấy danh sách bác sĩ:", data.message);
    } catch (err) {
      console.error("Lỗi khi fetch bác sĩ:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="dm-container">
      <h2 className="dm-title">Quản lý bác sĩ</h2>
      <button className="dm-add-button" onClick={() => setShowCreateModal(true)}>
        + Thêm bác sĩ mới
      </button>

      <table className="dm-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Chức vụ</th>
            <th>Chuyên khoa</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.fullName}</td>
              <td>{doc.position}</td>
              <td>{doc.expertise}</td>
              <td>
                <button
                  className="dm-edit-button"
                  onClick={() => setSelectedDoctorId(doc.id)}
                >
                  Sửa
                </button>
                <button
                  className="dm-detail-button"
                  onClick={() => navigate(`/bac-si/${doc.id}`)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateModal && (
        <DoctorFormCreateModal
          onClose={() => {
            setShowCreateModal(false);
            fetchDoctors();
          }}
        />
      )}

      {selectedDoctorId && (
        <DoctorFormUpdateModal
          id={selectedDoctorId}
          onClose={() => {
            setSelectedDoctorId(null);
            fetchDoctors();
          }}
        />
      )}
    </div>
  );
}
