import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { useAuth } from "../../context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/appointment-management/StaffAppointmentList.css";
import { GET_ALL_APPOINTMENT } from "../../api/apiUrls";
import CustomDateInput from "../../components/CustomDateInput";
import MedicalRecordHistoryModal from "../medical-record-management/MedicalRecordHistory";

export default function DoctorAppointmentManager() {
  const { getAuthHeader } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const [filters, setFilters] = useState({
    date: new Date(),
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        date: filters.date ? filters.date.toISOString().split("T")[0] : null,
      };
      const res = await axios.get(GET_ALL_APPOINTMENT, {
        headers: getAuthHeader(),
        params,
      });
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách cuộc hẹn:", err);
      setError("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({ date: new Date() });
    setSearchQuery("");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleOpenMedicalRecord = (accountId) => {
    setSelectedAccountId(accountId);
    setShowRecordModal(true);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      UNPAID: { label: "Chưa thanh toán", class: "status--unpaid" },
      NOT_PAID: { label: "Không thanh toán", class: "status--not-paid" },
      UNCHECKED_IN: { label: "Chưa đến", class: "status--unchecked-in" },
      CHECKED_IN: { label: "Đã đến", class: "status--checked-in" },
      CANCELLED: { label: "Đã hủy", class: "status--cancelled" },
    };
    return statusMap[status] || { label: status, class: "status--default" };
  };

  const formatGender = (gender) => {
    const genderMap = {
      MALE: "Nam",
      FEMALE: "Nữ",
      OTHER: "Khác",
    };
    return genderMap[gender] || "-";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const filteredAppointments = appointments.filter((item) => {
    const name = item.patientName?.toLowerCase() || "";
    const phone = item.phoneNumber || "";
    return name.includes(searchQuery) || phone.includes(searchQuery);
  });

  return (
    <div className="staff-appointment-list">
      <div className="staff-appointment-list__header">
        <h2 className="staff-appointment-list__title">Lịch hẹn của tôi</h2>
        <p className="staff-appointment-list__subtitle">
          Danh sách các cuộc hẹn bạn sẽ thực hiện
        </p>
      </div>
      
{/* 
      {error && (
        <div className="staff-appointment-list__error">
          <span>⚠️ {error}</span>
        </div>
      )} */}

      <div className="staff-appointment-list__filters">
        <div className="staff-appointment-list__filter-row">
          <div className="staff-appointment-list__filter-group">
            <label>Ngày hẹn:</label>
            <DatePicker
              selected={filters.date}
              onChange={(date) => handleFilterChange("date", date)}
              placeholderText="Chọn ngày hẹn"
              dateFormat="dd/MM/yyyy"
              customInput={<CustomDateInput />}
              withPortal
            />
          </div>

          <div className="staff-appointment-list__filter-group">
            <label>Tìm kiếm:</label>
            <input
              type="text"
              placeholder="Nhập tên hoặc số điện thoại"
              value={searchQuery}
              onChange={handleSearchChange}
              className="staff-appointment-list__search-input"
            />
          </div>

          <div className="staff-appointment-list__filter-actions">
            <button
              className="staff-appointment-list__btn staff-appointment-list__btn--reset"
              onClick={handleReset}
              disabled={loading}
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <div className="staff-appointment-list__table-container">
        {loading ? (
          <div className="staff-appointment-list__loading">
            <div className="staff-appointment-list__spinner"></div>
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          <table className="staff-appointment-list__table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Bệnh nhân</th>
                <th>Điện thoại</th>
                <th>Giới tính</th>
                <th>Ngày hẹn</th>
                <th>Giờ hẹn</th>
                <th>Trạng thái</th>
                <th>Hồ sơ</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="staff-appointment-list__empty">
                    <div>📅 Không có cuộc hẹn nào phù hợp</div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((item, index) => {
                  const statusInfo = getStatusLabel(item.status);
                  const isDisabled =
                    !item.userId || item.status !== "CHECKED_IN";
                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.patientName || "-"}</td>
                      <td>{item.phoneNumber || "-"}</td>
                      <td>{formatGender(item.gender)}</td>
                      <td>{formatDate(item.time)}</td>
                      <td>
                        {item.startTime && item.endTime
                          ? `${item.startTime} - ${item.endTime}`
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`staff-appointment-list__status ${statusInfo.class}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenMedicalRecord(item.userId)}
                          disabled={isDisabled}
                          title={
                            isDisabled
                              ? "Chỉ xem được sau khi bệnh nhân đã đến"
                              : "Xem hồ sơ bệnh án"
                          }
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            backgroundColor: isDisabled ? "#ccc" : "#077BF6",
                            color: isDisabled ? "#666" : "#fff",
                            border: "none",
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            fontSize: "14px",
                            transition: "all 0.2s ease-in-out",
                            boxShadow: isDisabled ? "none" : "0 2px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          Xem hồ sơ
                        </button>

                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {filteredAppointments.length > 0 && (
        <div className="staff-appointment-list__summary">
          Tổng cộng: <strong>{filteredAppointments.length}</strong> cuộc hẹn
        </div>
      )}

      {showRecordModal && selectedAccountId && (
        <MedicalRecordHistoryModal
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
