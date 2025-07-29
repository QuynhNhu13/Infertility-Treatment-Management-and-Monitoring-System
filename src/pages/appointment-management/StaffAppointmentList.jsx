import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useAuth } from "../../context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/appointment-management/StaffAppointmentList.css";
import { STAFF_GET_DOCTOR, STAFF_GET_APPOINTMENT } from "../../api/apiUrls";
import CustomDateInput from "../../components/CustomDateInput";
import UpdateAppointmentStatusModal from "./UpdateAppointmentStatusModal";

export default function StaffAppointmentList() {
  const { getAuthHeader } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const openStatusModal = (id) => {
    setSelectedAppointmentId(id);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedAppointmentId(null);
  };


  const [filters, setFilters] = useState({
    date: new Date(),
    doctorId: null,
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(STAFF_GET_DOCTOR, {
        headers: getAuthHeader(),
      });
      const options = res.data.data.map((doctor) => ({
        value: doctor.id,
        label: doctor.fullName,
      }));
      setDoctorOptions(options);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", err);
      setError("Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        doctorId: filters.doctorId,
        date: filters.date ? filters.date.toISOString().split("T")[0] : null,
      };

      const res = await axios.get(STAFF_GET_APPOINTMENT, {
        headers: getAuthHeader(),
        params,
      });
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách cuộc hẹn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      date: new Date(),
      doctorId: null,
    });
    setSearchQuery(""); // reset luôn tìm kiếm
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
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

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#077BF6" : "#ddd",
      boxShadow: state.isFocused ? "0 0 0 1px #077BF6" : "none",
      "&:hover": {
        borderColor: "#077BF6",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#077BF6" : state.isFocused ? "#E3F2FD" : "white",
      color: state.isSelected ? "white" : "#333",
    }),
  };

  // 🔍 Lọc theo tên hoặc số điện thoại
  const filteredAppointments = appointments.filter((item) => {
    const name = item.patientName?.toLowerCase() || "";
    const phone = item.phoneNumber || "";
    return name.includes(searchQuery) || phone.includes(searchQuery);
  });

  return (
    <div className="staff-appointment-list">
      <div className="staff-appointment-list__header">
        <h2 className="staff-appointment-list__title">Danh sách lịch hẹn</h2>
        <p className="staff-appointment-list__subtitle">
          Quản lý và theo dõi các cuộc hẹn của bệnh nhân
        </p>
      </div>

      {error && (
        <div className="staff-appointment-list__error">
          <span>⚠️ {error}</span>
        </div>
      )}

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
            <label>Bác sĩ:</label>
            <Select
              options={doctorOptions}
              placeholder="Chọn bác sĩ"
              isClearable
              value={doctorOptions.find((option) => option.value === filters.doctorId) || null}
              onChange={(selected) => handleFilterChange("doctorId", selected?.value || null)}
              styles={customSelectStyles}
              className="staff-appointment-list__select"
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
                {/* <th>Ngày sinh</th> */}
                <th>Bác sĩ</th>
                <th>Ngày hẹn</th>
                <th>Giờ hẹn</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="9" className="staff-appointment-list__empty">
                    <div>📅 Không có cuộc hẹn nào phù hợp</div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((item, index) => {
                  const statusInfo = getStatusLabel(item.status);
                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.patientName || "-"}</td>
                      <td>{item.phoneNumber || "-"}</td>
                      <td>{formatGender(item.gender)}</td>
                      {/* <td>{formatDate(item.dob)}</td> */}
                      <td>{item.doctorName || "-"}</td>
                      <td>{formatDate(item.time)}</td>
                      <td>
                        {item.startTime && item.endTime
                          ? `${item.startTime} - ${item.endTime}`
                          : "-"}
                      </td>
                      <td>
                        <span className={`staff-appointment-list__status ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        {item.status === "UNCHECKED_IN" && (
                          <button
                            className="staff-appointment-list__btn-update"
                            onClick={() => openStatusModal(item.id)}
                          >
                            Cập nhật
                          </button>
                        )}
                      </td>
                    </tr>

                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
      <UpdateAppointmentStatusModal
        isOpen={isStatusModalOpen}
        onClose={closeStatusModal}
        appointmentId={selectedAppointmentId}
        onSuccess={fetchAppointments}
      />


      {filteredAppointments.length > 0 && (
        <div className="staff-appointment-list__summary">
          Tổng cộng: <strong>{filteredAppointments.length}</strong> cuộc hẹn
        </div>
      )}
    </div>
  );
}
