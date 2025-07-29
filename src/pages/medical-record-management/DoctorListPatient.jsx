import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/medical-record-management/DoctorListPatient.css";
import { DOCTOR_LIST_PATIENT } from "../../api/apiUrls";
import MedicalRecordHistory from "../medical-record-management/MedicalRecordHistory";

export default function DoctorListPatient() {
  const { getAuthHeader } = useAuth();
  const [patients, setPatients] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (searchKey = "") => {
    setLoading(true);
    try {
      const response = await axios.get(DOCTOR_LIST_PATIENT, {
        headers: getAuthHeader(),
        params: searchKey ? { keyword: searchKey } : {},
      });
      setPatients(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bệnh nhân:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      fetchPatients(keyword.trim());
    } else {
      fetchPatients();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewRecord = (accountId) => {
    if (accountId) {
      setSelectedAccountId(accountId);
      setShowRecordModal(true);
    } else {
      alert("Không có mã tài khoản để xem hồ sơ.");
    }
  };

  return (
    <div className="doctor-list-patient-container">
      <h2>HỒ SƠ BỆNH NHÂN ĐÃ TIẾP NHẬN</h2>

      <div className="doctor-list-patient__search-bar">
        <input
          type="text"
          placeholder="Tìm theo tên, email hoặc số điện thoại"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>

      <div className="doctor-list-patient__table-container">
        <table className="doctor-list-patient__table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Giới tính</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  {loading ? "Đang tải danh sách bệnh nhân..." : "Không có bệnh nhân nào."}
                </td>
              </tr>
            ) : (
              patients.map((patient, index) => (
                <tr key={patient.id}>
                  <td data-label="STT">{index + 1}</td>
                  <td data-label="Họ tên">{patient.fullName}</td>
                  <td data-label="Email">{patient.email}</td>
                  <td data-label="SĐT">{patient.phoneNumber}</td>
                  <td data-label="Giới tính">{patient.gender === "MALE" ? "Nam" : "Nữ"}</td>
                  <td data-label="Hành động">
                    <button
                      className="doctor-list-patient__btn"
                      onClick={() => handleViewRecord(patient.id)}
                    >
                      Xem hồ sơ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showRecordModal && selectedAccountId && (
        <MedicalRecordHistory
          accountId={selectedAccountId}
          onClose={() => {
            setShowRecordModal(false);
            setSelectedAccountId(null);
          }}
        />
      )}
    </div>
  );
}
