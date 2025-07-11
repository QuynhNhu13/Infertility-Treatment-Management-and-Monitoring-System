import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MEDICAL_RECORD_CREATE } from "../../api/apiUrls";
import "../../styles/medical-record-management/MedicalRecordCreate.css";


export default function MedicalRecordCreate({ medicalRecordId, onSuccess }) {
  const { getAuthHeader } = useAuth();
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(MEDICAL_RECORD_CREATE(medicalRecordId), {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms, diagnosis }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      const data = await res.json();
      if (onSuccess) onSuccess(data.data);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mr-create-form">
      <h3>Thêm thông tin y tế</h3>
      <form onSubmit={handleSubmit}>
        <div className="mr-form-group">
          <label>Triệu chứng</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
            rows={3}
          />
        </div>

        <div className="mr-form-group">
          <label>Chẩn đoán ban đầu</label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            required
            rows={3}
          />
        </div>

        {error && <div className="mr-error-text">{error}</div>}

        <button type="submit" className="mr-create-submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thông tin"}
        </button>
      </form>
    </div>
  );
}
