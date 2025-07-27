import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_PRESCRIPTION } from "../../api/apiUrls";
import PrescriptionAdd from "./PrescriptionAddModal";
import PrescriptionEditModal from "./PrescriptionEditModal";
import "../../styles/prescription-management/PrescriptionSystem.css";
import { useAuth } from "../../context/AuthContext";

const PrescriptionSystem = ({ sessionId: sessionIdProp }) => {
  const { sessionId: sessionIdParam } = useParams();
  const sessionId = sessionIdProp || sessionIdParam;

  const { getAuthHeader } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);

  const fetchPrescriptions = async () => {
    if (!sessionId) return;
    setLoading(true);
    setNotFound(false);
    setErrorMessage("");

    try {
      const response = await fetch(GET_PRESCRIPTION(sessionId), {
        method: "GET",
        headers: getAuthHeader(),
      });

      const result = await response.json();

      if (response.status === 200 && result.data) {
        setPrescriptions(result.data);
      } else {
        setNotFound(true);
        setErrorMessage(result.message || "Không có đơn thuốc nào");
      }
    } catch (error) {
      setNotFound(true);
      setErrorMessage("Lỗi kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [sessionId]);

  const handleCreateSuccess = () => {
    setShowCreate(false);
    fetchPrescriptions();
  };

  const handleCreateCancel = () => {
    setShowCreate(false);
  };

  return (
    <div className="prescription-session-page">
      <div className="page-header">
        {!showCreate && (
          <button className="btn-create" onClick={() => setShowCreate(true)}>
            + Tạo đơn thuốc mới
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải dữ liệu đơn thuốc...</p>
        </div>
      ) : notFound ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h3 className="empty-state-title">Không tìm thấy đơn thuốc</h3>
            <p className="empty-state-message">{errorMessage}</p>
            {/* {!showCreate && (
              <button className="btn-primary" onClick={() => setShowCreate(true)}>
                + Tạo đơn thuốc mới
              </button>
            )} */}
          </div>
        </div>
      ) : (
        <div className="prescription-grid">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="prescription-card">
              <div className="prescription-header">
                <div className="prescription-id">Đơn thuốc #{prescription.id}</div>
              </div>

              <div className="prescription-notes">
                <h4 className="section-title">Ghi chú:</h4>
                <p className="notes-content">{prescription.notes || "Không có ghi chú"}</p>
              </div>

              <div className="medications-section">
                <h4 className="section-title">
                  Danh sách thuốc ({prescription.medications?.length || 0})
                </h4>
                <div className="medications-list">
                  {prescription.medications?.slice(0, 3).map((medication, index) => (
                    <div key={index} className="medication-item">
                      <div className="medication-name">{medication.medicationName}</div>
                      <div className="medication-details">
                        <span className="dosage">{medication.dosage}</span>
                        <span className="frequency">{medication.frequency}</span>
                        <span className="quantity">SL: {medication.quantity}</span>
                      </div>
                    </div>
                  ))}
                  {prescription.medications?.length > 3 && (
                    <div className="medication-item remaining">
                      ... và {prescription.medications.length - 3} thuốc khác
                    </div>
                  )}
                </div>
              </div>

              <div className="prescription-actions">
                <button
                  className="btn-edit"
                  onClick={() => setEditingPrescription(prescription)}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <PrescriptionAdd
          sessionId={sessionId}
          onSuccess={handleCreateSuccess}
          onClose={handleCreateCancel}
        />
      )}

      {editingPrescription && (
        <PrescriptionEditModal
          prescription={editingPrescription}
          onClose={() => setEditingPrescription(null)}
          onSuccess={fetchPrescriptions}
        />
      )}
    </div>
  );
};

export default PrescriptionSystem;
