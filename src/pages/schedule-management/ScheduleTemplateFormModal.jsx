import React, { useState, useEffect } from "react";
import "../../styles/schedule-management/ScheduleTemplateFormModal.css";
import { useAuth } from "../../context/AuthContext";
import {
  CREATE_SCHEDULE_TEMPLATE,
  UPDATE_SCHEDULE_TEMPLATE,
} from "../../api/apiUrls";

export default function ScheduleTemplateFormModal({
  onClose,
  onSuccess,
  mode = "create",
  initialData = null,
}) {
  const { getAuthHeader } = useAuth();

  const [formData, setFormData] = useState({
    maxDoctors: "",
    maxStaffs: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        maxDoctors: initialData.maxDoctors,
        maxStaffs: initialData.maxStaffs,
      });
    }
  }, [mode, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        mode === "create"
          ? CREATE_SCHEDULE_TEMPLATE
          : UPDATE_SCHEDULE_TEMPLATE(initialData?.id);

      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        maxDoctors: parseInt(formData.maxDoctors),
        maxStaffs: parseInt(formData.maxStaffs),
      };

      const res = await fetch(url, {
        method,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess?.();
        onClose();
      } else {
        setError(data.message || "Có lỗi xảy ra.");
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stmf-overlay" onClick={onClose}>
      <div className="stmf-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === "edit" ? "Chỉnh sửa số lượng mẫu" : "Tạo mẫu lịch làm việc"}</h3>
        <form onSubmit={handleSubmit} className="stmf-form">
          {error && <div className="stmf-error">{error}</div>}

          <label>
            Số bác sĩ tối đa:
            <input
              type="number"
              name="maxDoctors"
              min="0"
              value={formData.maxDoctors}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Số nhân viên tối đa:
            <input
              type="number"
              name="maxStaffs"
              min="0"
              value={formData.maxStaffs}
              onChange={handleInputChange}
              required
            />
          </label>

          <div className="stmf-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : mode === "edit" ? "Cập nhật" : "Tạo mới"}
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
