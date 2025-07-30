import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  GET_AVAILABLE_DATES,
  GET_SLOTS_BY_DATE,
  CREATE_TREATMENT_SESSION,
} from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import dayjs from "dayjs";
import "../../styles/treatment-plan-management/CreateTreatmentSessionModal.css";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#077BF6" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px #077BF6" : "none",
    "&:hover": {
      borderColor: "#077BF6",
    },
    padding: "2px 4px",
    borderRadius: "8px",
    fontSize: "14px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#077BF6"
      : state.isFocused
      ? "#e2efff"
      : "#fff",
    color: state.isSelected ? "#fff" : "#001D54",
    padding: "10px",
    cursor: "pointer",
    fontSize: "14px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#001D54",
    fontWeight: "500",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "8px",
    zIndex: 5,
  }),
};

export default function CreateTreatmentSessionModal({ progressId, onClose, onSuccess }) {
  const { getAuthHeader, getJsonAuthHeader } = useAuth();

  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [message, setMessage] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const res = await axios.get(GET_AVAILABLE_DATES, {
          headers: getAuthHeader(),
        });
        setAvailableDates(res.data.data || []);
      } catch (err) {
        console.error("❌ Error fetching available dates:", err);
      }
    };
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      try {
        const res = await axios.get(`${GET_SLOTS_BY_DATE}?date=${selectedDate.value}`, {
          headers: getAuthHeader(),
        });
        setSlots(res.data.data || []);
      } catch (err) {
        console.error("❌ Error fetching slots:", err);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert("Vui lòng chọn ngày và khung giờ trước khi tạo lịch.");
      return;
    }

    const formattedDate = dayjs(selectedDate.value).format("YYYY-MM-DD");
    let formattedTime = selectedTime.value.trim();

    if (/^\d{2}:\d{2}$/.test(formattedTime)) {
      formattedTime += ":00";
    }

    if (!/^\d{2}:\d{2}:\d{2}$/.test(formattedTime)) {
      alert("⚠️ Thời gian không hợp lệ. Vui lòng chọn lại khung giờ.");
      return;
    }

    const payload = {
      date: formattedDate,
      time: formattedTime,
      message: message.trim(),
      appointmentNote: appointmentNote.trim(),
    };

    try {
      setLoading(true);
      const res = await axios.post(
        CREATE_TREATMENT_SESSION(progressId),
        payload,
        {
          headers: getJsonAuthHeader(),
        }
      );

      onSuccess?.(res.data.data);
      onClose();
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "";

      if (errorMsg.includes("đã có lịch tái hẹn")) {
        alert("⚠️ Bệnh nhân đã có lịch tái hẹn trong phác đồ điều trị.");
        onClose();
        return;
      }

      if (err?.response?.data?.message) {
        alert(`Lỗi: ${err.response.data.message}`);
      } else if (err?.response?.status === 500) {
        alert("Lỗi máy chủ (500). Vui lòng thử lại hoặc kiểm tra dữ liệu.");
      } else {
        alert("Tạo lịch thất bại. Vui lòng kiểm tra dữ liệu hoặc thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cts-modal-overlay">
      <div className="cts-modal">
        <h2 className="cts-title">Tạo lịch hẹn điều trị</h2>
        <form onSubmit={handleSubmit} className="cts-form">
          <div className="cts-form-group">
            <label>Chọn ngày:</label>
            <Select
              styles={customSelectStyles}
              options={availableDates.map((date) => ({ label: date, value: date }))}
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="-- Ngày trống --"
              isClearable
            />
          </div>

          <div className="cts-form-group">
            <label>Chọn khung giờ:</label>
            <Select
              styles={customSelectStyles}
              options={slots.map((slot) => ({ label: slot, value: slot }))}
              value={selectedTime}
              onChange={setSelectedTime}
              placeholder="-- Slot trống --"
              isClearable
            />
          </div>

          <div className="cts-form-group">
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="cts-form-group">
            <label>Ghi chú cuộc hẹn:</label>
            <textarea
              value={appointmentNote}
              onChange={(e) => setAppointmentNote(e.target.value)}
            />
          </div>

          <div className="cts-modal-actions">
            <button
              type="submit"
              disabled={loading || !selectedDate || !selectedTime}
              className="cts-submit-btn"
            >
              {loading ? "Đang tạo..." : "Tạo lịch"}
            </button>
            <button type="button" onClick={onClose} className="cts-cancel-btn">
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
