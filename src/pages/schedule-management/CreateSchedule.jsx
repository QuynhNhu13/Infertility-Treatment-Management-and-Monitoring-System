import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/schedule-management/CreateSchedule.css";
import { CREATE_SCHEDULE } from "../../api/apiUrls";

export default function CreateSchedule({ onClose, onSuccess }) {
  const { getAuthHeader } = useAuth();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await fetch(CREATE_SCHEDULE, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Tạo lịch làm việc thành công!");
        onSuccess?.(); 
        onClose();   
      } else {
        setError(data.message || "Đã xảy ra lỗi.");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csm-overlay" onClick={onClose}>
      <div className="csm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Tạo lịch làm việc</h3>
        <form onSubmit={handleSubmit} className="csm-form">
          {error && <div className="csm-error">{error}</div>}
          {successMessage && <div className="csm-success">{successMessage}</div>}

          <label>
            Ngày bắt đầu:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>

          <label>
            Ngày kết thúc:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>

          <div className="csm-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo lịch làm việc"}
            </button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
