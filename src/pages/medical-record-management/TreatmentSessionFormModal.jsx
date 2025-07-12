import React, { useState, useEffect } from "react";
import {
  CREATE_TREATMENT_SESSION,
  UPDATE_TREATMENT_SESSION,
} from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "../../styles/medical-record-management/TreatmentSessionFormModal.css";

export default function TreatmentSessionFormModal({
  stage,
  initialData = null,
  isEdit = false,
  onClose,
  onSuccess,
}) {
  const { getAuthHeader } = useAuth();

  const [formData, setFormData] = useState({
    date: "",
    diagnosis: "",
    symptoms: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        date: initialData.date || "",
        diagnosis: initialData.diagnosis || "",
        symptoms: initialData.symptoms || "",
        notes: initialData.notes || "",
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let url = "";
      let method = "";

      if (isEdit) {
        if (!initialData || !initialData.id) {
          toast.error("Không tìm thấy thông tin buổi khám để cập nhật.");
          setSubmitting(false);
          return;
        }
        url = UPDATE_TREATMENT_SESSION(stage.id, initialData.id);
        method = "PUT";
      } else {
        url = CREATE_TREATMENT_SESSION(stage.id);
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(isEdit ? "Cập nhật buổi khám thành công" : "Tạo buổi khám thành công");
        if (onSuccess) await onSuccess();
      } else {
        toast.error(result.message || "Thao tác thất bại");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      toast.error("Đã xảy ra lỗi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isEdit ? "Cập nhật buổi khám" : "Thêm buổi khám"} - {stage.stageName || "Giai đoạn"}</h3>
        <form onSubmit={handleSubmit} className="session-form">
          <label>
            Ngày khám:
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </label>
          <label>
            Chẩn đoán:
            <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} required />
          </label>
          <label>
            Triệu chứng:
            <input type="text" name="symptoms" value={formData.symptoms} onChange={handleChange} />
          </label>
          <label>
            Ghi chú:
            <textarea name="notes" value={formData.notes} onChange={handleChange} />
          </label>

          <div className="modal-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Lưu"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
