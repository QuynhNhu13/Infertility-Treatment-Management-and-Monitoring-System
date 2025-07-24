import React, { useState, useEffect } from "react";
import { GET_AVAILABLE_DATES, GET_SLOTS_BY_DATE, CREATE_TREATMENT_SESSION } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import "../../styles/treatment-plan-management/CreateTreatmentSessionModal.css"; // tuỳ chỉnh CSS theo giao diện

export default function CreateTreatmentSessionModal({ progressId, onClose, onSuccess }) {
  const { getAuthHeader } = useAuth();
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
        const res = await axios.get(GET_AVAILABLE_DATES, { headers: getAuthHeader() });
        setAvailableDates(res.data.data || []);
      } catch (err) {
        console.error("Error fetching dates:", err);
      }
    };
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const fetchSlots = async () => {
      try {
        const res = await axios.get(`${GET_SLOTS_BY_DATE}?date=${selectedDate}`, { headers: getAuthHeader() });
        setSlots(res.data.data || []);
      } catch (err) {
        console.error("Error fetching slots:", err);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return alert("Chọn ngày và khung giờ trước");

    try {
      setLoading(true);
      const payload = {
        date: selectedDate,
        time: selectedTime,
        message,
        appointmentNote,
      };

      const res = await axios.post(
        CREATE_TREATMENT_SESSION(progressId),
        payload,
        { headers: getAuthHeader() }
      );
      onSuccess?.(res.data.data);
      onClose();
    } catch (err) {
      console.error("Error creating session:", err);
      alert("Tạo lịch thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ts-modal-overlay">
      <div className="ts-modal">
        <h2>Tạo lịch hẹn điều trị</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Chọn ngày:</label>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required>
              <option value="">-- Ngày trống --</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Chọn khung giờ:</label>
            <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required>
              <option value="">-- Slot trống --</option>
              {slots.map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Message:</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>

          <div>
            <label>Ghi chú cuộc hẹn:</label>
            <textarea value={appointmentNote} onChange={(e) => setAppointmentNote(e.target.value)} />
          </div>

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo lịch"}
            </button>
            <button type="button" onClick={onClose}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
}
