import React, { useState } from "react";
import Select from "react-select";
import { useAuth } from "../../context/AuthContext";
import { LAB_TEST_RESULT_FROM } from "../../api/apiUrls";
import "../../styles/lab-test-management/LabTestResultForm.css";

export default function LabTestResultForm({ labTestId, onSuccess, onCancel }) {
  const { getAuthHeader } = useAuth();

  const [formData, setFormData] = useState({
    resultSummary: "",
    resultDetails: "",
    status: "COMPLETED",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const statusOptions = [
    { value: "COMPLETED", label: "Đã hoàn thành" },
    { value: "PROCESSING", label: "Đang xử lý" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      status: selectedOption.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(LAB_TEST_RESULT_FROM(labTestId), {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gửi kết quả thất bại");
      }

      setSuccess(true);
      if (onSuccess) setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      console.error("Lỗi gửi kết quả:", err);
      setError(err.message || "Đã xảy ra lỗi khi gửi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ltf-container">
      {success ? (
        <div className="ltf-success-message">Gửi kết quả thành công!</div>
      ) : (
        <form onSubmit={handleSubmit} className="ltf-form">
          <div className="ltf-group">
            <label>Tóm tắt kết quả:</label>
            <input
              type="text"
              name="resultSummary"
              value={formData.resultSummary}
              onChange={handleChange}
              placeholder="Nhập tóm tắt kết quả"
              required
            />
          </div>

          <div className="ltf-group">
            <label>Chi tiết kết quả:</label>
            <textarea
              name="resultDetails"
              rows="4"
              value={formData.resultDetails}
              onChange={handleChange}
              placeholder="Nhập chi tiết kết quả"
              required
            />
          </div>

          <div className="ltf-group">
            <label>Trạng thái:</label>
            <Select
              options={statusOptions}
              value={statusOptions.find(opt => opt.value === formData.status)}
              onChange={handleStatusChange}
              classNamePrefix="react-select"
              isSearchable={false}
            />
          </div>

          <div className="ltf-group">
            <label>Ghi chú:</label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Ghi chú (tuỳ chọn)"
            />
          </div>

          {error && <div className="ltf-error">{error}</div>}

          <div className="ltf-form-actions">
            <button type="submit" className="ltf-submit-btn" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi kết quả"}
            </button>
            {onCancel && (
              <button type="button" className="ltf-cancel-btn" onClick={onCancel}>
                Huỷ
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
