import React, { useState, useEffect } from "react";
import {
  GET_AVAILABLE_DATES,
  GET_SLOTS_BY_DATE,
  CREATE_TREATMENT_SESSION,
} from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import dayjs from "dayjs";
import "../../styles/treatment-plan-management/CreateTreatmentSessionModal.css";

export default function CreateTreatmentSessionModal({ progressId, onClose, onSuccess }) {
  const { getAuthHeader, getJsonAuthHeader } = useAuth();

  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
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
        const res = await axios.get(`${GET_SLOTS_BY_DATE}?date=${selectedDate}`, {
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

    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

    let formattedTime = selectedTime.trim();
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

    console.log("📦 Payload gửi đi:", payload);
    console.log("🆔 Progress ID:", progressId);

    try {
      setLoading(true);
      const res = await axios.post(
        CREATE_TREATMENT_SESSION(progressId),
        payload,
        {
          headers: getJsonAuthHeader(),
        }
      );

      console.log("✅ Tạo lịch thành công:", res.data);
      onSuccess?.(res.data.data);
      onClose();
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "";
      console.error("❌ Lỗi tạo lịch:", errorMsg || err.message);

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
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            >
              <option value="">-- Ngày trống --</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          <div className="cts-form-group">
            <label>Chọn khung giờ:</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value="">-- Slot trống --</option>
              {slots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
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
