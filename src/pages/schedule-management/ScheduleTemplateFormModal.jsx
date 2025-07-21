import React, { useState, useEffect } from "react";
import Select from "react-select"; 
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
    dayOfWeek: "MONDAY",
    shiftId: "1",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dayOptions = [
    { value: "MONDAY", label: "Thứ 2" },
    { value: "TUESDAY", label: "Thứ 3" },
    { value: "WEDNESDAY", label: "Thứ 4" },
    { value: "THURSDAY", label: "Thứ 5" },
    { value: "FRIDAY", label: "Thứ 6" },
    { value: "SATURDAY", label: "Thứ 7" },
    { value: "SUNDAY", label: "Chủ nhật" },
  ];

  const shiftOptions = [
    { value: "1", label: "Ca sáng" },
    { value: "2", label: "Ca chiều" },
    { value: "3", label: "Ca tối" },
  ];

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

  const handleSelectChange = (field, selected) => {
    setFormData((prev) => ({ ...prev, [field]: selected.value }));
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

      const payload =
        mode === "edit"
          ? {
              maxDoctors: parseInt(formData.maxDoctors),
              maxStaffs: parseInt(formData.maxStaffs),
              dayOfWeek: initialData?.dayOfWeek,
              shiftId: initialData?.shiftId,
            }
          : {
              maxDoctors: parseInt(formData.maxDoctors),
              maxStaffs: parseInt(formData.maxStaffs),
              dayOfWeek: formData.dayOfWeek,
              shiftId: parseInt(formData.shiftId),
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

          {mode === "edit" && (
            <div className="stmf-fixed-info">
              <p>
                <strong>Ngày:</strong> {initialData?.dayOfWeek}
              </p>
              <p>
                <strong>Ca:</strong> {initialData?.shiftTime}
              </p>
            </div>
          )}

          {mode === "create" && (
            <>
              <label>Ngày trong tuần:</label>
              <Select
                options={dayOptions}
                value={dayOptions.find((opt) => opt.value === formData.dayOfWeek)}
                onChange={(selected) => handleSelectChange("dayOfWeek", selected)}
              />

              <label>Ca làm việc:</label>
              <Select
                options={shiftOptions}
                value={shiftOptions.find((opt) => opt.value === formData.shiftId)}
                onChange={(selected) => handleSelectChange("shiftId", selected)}
              />
            </>
          )}

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
