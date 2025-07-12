import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { TREATMENT_UPDATE } from "../../api/apiUrls";
import "../../styles/medical-record-management/TreatmentStageUpdateModal.css";

export default function TreatmentStageUpdateModal({ stage, onClose, onSuccess }) {
  const { getAuthHeader } = useAuth();
  const [formData, setFormData] = useState({
    dateStart: stage.dateStart?.substring(0, 10) || "",
    dateComplete: stage.dateComplete?.substring(0, 10) || "",
    notes: stage.notes || "",
    status: stage.status || "IN_PROGRESS",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        TREATMENT_UPDATE(stage.id),
        {
          method: "PUT",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();
      if (res.ok) {
        onSuccess(result.data);
        onClose();
      } else {
        alert("Cập nhật thất bại: " + result.message);
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tsu-modal-overlay">
      <div className="tsu-modal">
        <h3>Cập nhật giai đoạn điều trị</h3>
        <div className="tsu-form">
          <label>
            Ngày bắt đầu:
            <input
              type="date"
              name="dateStart"
              value={formData.dateStart}
              onChange={handleChange}
            />
          </label>
          <label>
            Ngày hoàn thành:
            <input
              type="date"
              name="dateComplete"
              value={formData.dateComplete}
              onChange={handleChange}
            />
          </label>
          <label>
            Ghi chú:
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </label>
          <label>
            Trạng thái:
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="NOT_STARTED">Chưa bắt đầu</option>
              <option value="IN_PROGRESS">Đang thực hiện</option>
              <option value="COMPLETED">Đã hoàn thành</option>
            </select>
          </label>
        </div>

        <div className="tsu-actions">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
}
