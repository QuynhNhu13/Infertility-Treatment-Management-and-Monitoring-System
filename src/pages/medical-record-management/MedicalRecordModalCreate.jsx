import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CREATE_MEDICAL_RECORD } from "../../api/apiUrls";
import "../../styles/medical-record-management/MedicalRecordModalCreate.css";

export default function MedicalRecordModalCreate({ accountId, onClose, onAddRecord }) {
  const { getJsonAuthHeader } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(CREATE_MEDICAL_RECORD(accountId), {
        method: "POST",
        headers: getJsonAuthHeader(),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Tạo hồ sơ thất bại");
      }

      const newRecord = result.data; 
      setSuccessMessage("Tạo hồ sơ thành công!");

      if (onAddRecord) {
        onAddRecord(newRecord); 
      }

      setTimeout(() => {
        onClose(); 
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crm-modal-overlay" onClick={onClose}>
      <div className="crm-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Xác nhận tạo hồ sơ mới</h3>
        {error && <p className="crm-error">{error}</p>}
        {successMessage && <p className="crm-success">{successMessage}</p>}
        <div className="crm-buttons">
          <button className="crm-cancel-btn" onClick={onClose} disabled={loading}>
            Hủy
          </button>
          <button className="crm-confirm-btn" onClick={handleCreate} disabled={loading}>
            {loading ? "Đang tạo..." : "Xác nhận tạo"}
          </button>
        </div>
      </div>
    </div>
  );
}
