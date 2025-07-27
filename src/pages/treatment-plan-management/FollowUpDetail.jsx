import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  GET_SESSION_DETAIL,
  UPDATE_SESSION,
  GET_AVAILABLE_DATES,
  GET_SLOTS_BY_DATE,
} from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import "../../styles/treatment-plan-management/FollowUpDetail.css";

export default function FollowUpDetail({ sessionId }) {
  const { getAuthHeader } = useAuth();

  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    message: "",
    appointmentNote: "",
  });

  const [availableDates, setAvailableDates] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await axios.get(GET_SESSION_DETAIL(sessionId), {
          headers: getAuthHeader(),
        });

        const data = res.data.data || res.data;

        setSession(data);
        setFormData({
          date: data.date || "",
          time: data.time || "",
          message: data.message || "",
          appointmentNote: data.appointmentNote || "",
        });
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu phiên:", err);
        setStatusMessage("❌ Không thể tải dữ liệu buổi khám.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchSession();
  }, [sessionId]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const res = await axios.get(GET_AVAILABLE_DATES, {
          headers: getAuthHeader(),
        });
        setAvailableDates(res.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách ngày:", err);
      }
    };

    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (!formData.date) return;

    const fetchSlots = async () => {
      try {
        const res = await axios.get(`${GET_SLOTS_BY_DATE}?date=${formData.date}`, {
          headers: getAuthHeader(),
        });
        setAvailableSlots(res.data.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy khung giờ:", err);
      }
    };

    fetchSlots();
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const now = new Date();
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const diffInMs = selectedDateTime - now;

    if (diffInMs < 24 * 60 * 60 * 1000) {
      setStatusMessage("❌ Chỉ được chỉnh sửa lịch hẹn trước ít nhất 24 giờ.");
      return;
    }

    try {
      await axios.put(
        UPDATE_SESSION(sessionId),
        {
          date: formData.date,
          time: formData.time,
          message: formData.message,
          appointmentNote: formData.appointmentNote,
        },
        {
          headers: getAuthHeader(),
        }
      );
      setStatusMessage("✅ Cập nhật lịch hẹn thành công.");
      setEditMode(false);
    } catch (error) {
      console.error("❌ Lỗi cập nhật:", error);
      setStatusMessage("❌ Cập nhật thất bại.");
    }
  };

  if (loading) return <div>🔄 Đang tải dữ liệu...</div>;
  if (!session) return <div>❌ Không tìm thấy thông tin buổi khám.</div>;

  return (
    <div className="follow-up-container">
      <h2>Chi tiết lịch hẹn</h2>

      <div className="follow-up-field">
        <label>Ngày hẹn:</label>
        {editMode ? (
          <select name="date" value={formData.date} onChange={handleChange}>
            <option value="">-- Chọn ngày --</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {dayjs(date).format("YYYY-MM-DD")}
              </option>
            ))}
          </select>
        ) : (
          <span>{formData.date || "Chưa có"}</span>
        )}
      </div>

      <div className="follow-up-field">
        <label>Giờ hẹn:</label>
        {editMode ? (
          <select name="time" value={formData.time} onChange={handleChange}>
            <option value="">-- Chọn khung giờ --</option>
            {Array.isArray(availableSlots) &&
              availableSlots.map((slot, i) => (
                <option key={i} value={slot}>
                  {slot}
                </option>
              ))}
          </select>
        ) : (
          <span>{formData.time || "Chưa có"}</span>
        )}
      </div>

      <div className="follow-up-field">
        <label>Lời nhắn:</label>
        {editMode ? (
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
        ) : (
          <span>{formData.message || "Không có"}</span>
        )}
      </div>

      <div className="follow-up-field">
        <label>Ghi chú cuộc hẹn:</label>
        {editMode ? (
          <textarea
            name="appointmentNote"
            value={formData.appointmentNote}
            onChange={handleChange}
          />
        ) : (
          <span>{formData.appointmentNote || "Không có"}</span>
        )}
      </div>

      <div className="follow-up-actions">
        {editMode ? (
          <>
            <button onClick={handleUpdate}>💾 Lưu</button>
            <button onClick={() => setEditMode(false)}>❌ Hủy</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>✏️ Chỉnh sửa</button>
        )}
      </div>

      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
}
