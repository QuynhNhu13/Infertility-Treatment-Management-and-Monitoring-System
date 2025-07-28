import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { UPDATE_TREATMENT_SESSION } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import "../../styles/treatment-plan-management/UpdateTreatmentSessionModal.css";

Modal.setAppElement("#root");

export default function UpdateTreatmentSessionModal({
  isOpen,
  onClose,
  progressId,
  sessionData,
  onUpdateSuccess,
}) {
  const { getAuthHeader } = useAuth();
  const [formData, setFormData] = useState({
    diagnosis: "",
    symptoms: "",
    notes: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState(null);

  // Reset success message & error when modal is opened
  useEffect(() => {
    if (isOpen) {
      setSuccessData(null);
      setErrorMessage("");
    }
  }, [isOpen]);

  // Load sessionData vào form nếu chưa cập nhật
  useEffect(() => {
    if (sessionData && !successData) {
      setFormData({
        diagnosis: sessionData.diagnosis || "",
        symptoms: sessionData.symptoms || "",
        notes: sessionData.notes || "",
      });
    }
  }, [sessionData, successData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!progressId || !sessionData?.id) {
      setErrorMessage("Thiếu thông tin về buổi khám hoặc tiến trình.");
      return;
    }

    try {
      const response = await fetch(
        UPDATE_TREATMENT_SESSION(progressId, sessionData.id),
        {
          method: "PUT",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Cập nhật thất bại. Vui lòng kiểm tra lại dữ liệu.");
      }

      if (onUpdateSuccess) {
        onUpdateSuccess(result.data);
      }

      setSuccessData(result.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Lỗi khi cập nhật buổi khám:", error);
      setErrorMessage(error.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="utsm-modal"
      overlayClassName="utsm-modal-overlay"
    >
      <h2 className="utsm-title">Cập nhật buổi khám</h2>
      <form onSubmit={handleSubmit} className="utsm-form">
        <label className="utsm-label">Triệu chứng</label>
        <textarea
          name="symptoms"
          className="utsm-textarea"
          value={formData.symptoms}
          onChange={handleChange}
          required
        />

        <label className="utsm-label">Kết luận chẩn đoán</label>
        <textarea
          name="diagnosis"
          className="utsm-textarea"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />

        <label className="utsm-label">Ghi chú thêm</label>
        <textarea
          name="notes"
          className="utsm-textarea"
          value={formData.notes}
          onChange={handleChange}
        />

        {errorMessage && <p className="utsm-error">{errorMessage}</p>}

        <div className="utsm-btn-group">
          <button type="submit" className="utsm-btn-submit">
            Cập nhật
          </button>
          <button type="button" className="utsm-btn-cancel" onClick={onClose}>
            Hủy
          </button>
        </div>
      </form>

      {successData && (
        <div className="utsm-result">
          <h3 className="utsm-result-title">Đã cập nhật thành công:</h3>
          <p><strong>Triệu chứng:</strong> {successData.symptoms}</p>
          <p><strong>Chẩn đoán:</strong> {successData.diagnosis}</p>
          <p><strong>Ghi chú:</strong> {successData.notes}</p>
          <p><strong>Trạng thái:</strong> {successData.status}</p>
        </div>
      )}
    </Modal>
  );
}
