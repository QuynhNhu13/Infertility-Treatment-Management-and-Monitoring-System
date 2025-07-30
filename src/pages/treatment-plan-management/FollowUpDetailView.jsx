import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  GET_SESSION_DETAIL,
  GET_AVAILABLE_DATES,
  GET_SLOTS_BY_DATE,
} from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import "../../styles/treatment-plan-management/FollowUpDetail.css";

export default function FollowUpDetailView({ sessionId }) {
  const { getAuthHeader } = useAuth();

  const [session, setSession] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    message: "",
    appointmentNote: "",
  });

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
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchSession();
  }, [sessionId]);

  if (loading) return <div>🔄 Đang tải dữ liệu...</div>;
  if (!session) return <div>❌ Không tìm thấy thông tin buổi khám.</div>;

  return (
    <div className="follow-up-container">
      <h2>Chi tiết lịch hẹn</h2>

      <div className="follow-up-field">
        <label>Ngày hẹn:</label>
        <span>{formData.date || "Chưa có"}</span>
      </div>

      <div className="follow-up-field">
        <label>Giờ hẹn:</label>
        <span>{formData.time || "Chưa có"}</span>
      </div>

      <div className="follow-up-field">
        <label>Lời nhắn:</label>
        <span>{formData.message || "Không có"}</span>
      </div>

      <div className="follow-up-field">
        <label>Ghi chú cuộc hẹn:</label>
        <span>{formData.appointmentNote || "Không có"}</span>
      </div>
    </div>
  );
}
