import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  GET_TREATMENT_PLAN,
  CREATE_TREATMENT_PLAN,
  GET_TREATMENT_SESSION,
  DELETE_TREATMENT_SESSION,
} from "../../api/apiUrls";
import TreatmentStageUpdateModal from "./TreatmentStageUpdateModal";
import ServiceSelectionModal from "./ServiceSelectionModal";
import TreatmentSessionFormModal from "./TreatmentSessionFormModal";
import TreatmentSessionDetailModal from "./TreatmentSessionDetailModal";
import "../../styles/medical-record-management/TreatmentPlan.css";
import { useNavigate } from "react-router-dom";


export default function TreatmentPlan({ medicalRecordId }) {
  const { getAuthHeader } = useAuth();
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedSessionStage, setSelectedSessionStage] = useState(null);
  const [editSession, setEditSession] = useState(null);
  const [sessionMap, setSessionMap] = useState({});
  const [openSessionMap, setOpenSessionMap] = useState({});
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState(null);
  const navigate = useNavigate();


  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch(GET_TREATMENT_PLAN(medicalRecordId), {
        method: "GET",
        headers: getAuthHeader(),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Lỗi khi lấy phác đồ điều trị");
      setTreatmentPlans(result.data || []);
      setError("");
    } catch (err) {
      console.error("Lỗi khi fetch treatment plans:", err);
      setError(err.message);
      setTreatmentPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatmentSession = async (stageId) => {
    try {
      const res = await fetch(GET_TREATMENT_SESSION(stageId), {
        method: "GET",
        headers: getAuthHeader(),
      });
      const result = await res.json();
      if (res.ok && Array.isArray(result.data)) {
        setSessionMap((prev) => ({ ...prev, [stageId]: result.data }));
      } else {
        setSessionMap((prev) => ({ ...prev, [stageId]: [] }));
      }
    } catch (error) {
      console.error("Lỗi khi fetch session:", error);
      setSessionMap((prev) => ({ ...prev, [stageId]: [] }));
    }
  };

  const handleDeleteSession = async (stageId, sessionId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa buổi khám này?")) return;
    try {
      await fetch(DELETE_TREATMENT_SESSION(stageId, sessionId), {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      await fetchTreatmentSession(stageId);
    } catch (error) {
      console.error("Lỗi khi xóa session:", error);
    }
  };

  useEffect(() => {
    if (medicalRecordId) {
      fetchTreatmentPlans();
    }
  }, [medicalRecordId]);

  useEffect(() => {
    treatmentPlans.forEach((plan) => {
      plan.treatmentStageProgressResponses?.forEach((stage) => {
        if (stage?.id) {
          fetchTreatmentSession(stage.id);
        }
      });
    });
  }, [treatmentPlans]);

  const handleCreateTreatmentPlan = async (serviceId) => {
    try {
      const res = await fetch(CREATE_TREATMENT_PLAN, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicalRecordId: Number(medicalRecordId),
          serviceId,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        await fetchTreatmentPlans();
        setIsServiceModalOpen(false);
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (err) {
      console.error("Lỗi khi tạo phác đồ:", err);
      return { success: false, message: err.message };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không rõ";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "Không rõ"
      : d.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "status-completed";
      case "IN_PROGRESS":
        return "status-in-progress";
      case "NOT_STARTED":
        return "status-pending";
      default:
        return "status-unknown";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Hoàn thành";
      case "IN_PROGRESS":
        return "Đang thực hiện";
      case "NOT_STARTED":
        return "Chưa bắt đầu";
      default:
        return "Không rõ";
    }
  };

  const toggleSessionVisibility = (stageId) => {
    setOpenSessionMap((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  if (loading) {
    return (
      <div className="tp-container">
        <div className="tp-loading">
          <div className="loading-spinner"></div>
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tp-container">
      <div className="tp-header">
        <h2>Phác đồ điều trị</h2>
        <button className="tp-create-btn" onClick={() => setIsServiceModalOpen(true)}>
          <span className="btn-icon">+</span> Tạo phác đồ điều trị
        </button>
      </div>

      {error && <div className="tp-error">{error}</div>}

      {treatmentPlans.length === 0 ? (
        <div className="tp-empty">
          <h3>Chưa có phác đồ điều trị</h3>
          <p>Tạo phác đồ điều trị đầu tiên để bắt đầu quá trình điều trị.</p>
        </div>
      ) : (
        <div className="tp-list">
          {treatmentPlans.map((plan) => (
            <div className="tp-item" >
              <div className="tp-item-header" key={plan.id}>

                <div className="tp-service">
                  <span className="service-label">Dịch vụ:</span>
                  <span className="service-name">{plan.serviceName}</span>
                </div>
              </div>

              <div className="tp-stages">
                <h4>Giai đoạn điều trị</h4>
                {plan.treatmentStageProgressResponses?.length > 0 ? (
                  <div className="stages-list">
                    {plan.treatmentStageProgressResponses.map((stage, idx) => {
                      const sessions = sessionMap[stage.id] || [];
                      const isOpen = openSessionMap[stage.id];

                      return (
                        <div className="stage-item" key={stage.id}>
                          <div className="stage-info">
                            <span className="stage-name">
                              {stage.stageName || `Giai đoạn ${idx + 1}`}
                            </span>
                            <span className={`stage-status ${getStatusColor(stage.status)}`}>
                              {getStatusText(stage.status)}
                            </span>
                            <div className="stage-dates">
                              {formatDate(stage.dateStart)} → {formatDate(stage.dateComplete)}
                            </div>
                            <div className="stage-notes">
                              {stage.notes || "Không có ghi chú"}
                            </div>

                            {sessions.length > 0 ? (
                              <>
                                <button
                                  className="toggle-session-btn"
                                  onClick={() => toggleSessionVisibility(stage.id)}
                                >
                                  {isOpen ? "Ẩn buổi khám" : "Xem buổi khám"}
                                </button>
                                <button
                                  className="detail-session-btn"
                                  onClick={() => setSelectedSessionForDetail(sessions[0])}
                                >
                                  Chi tiết
                                </button>
                                {isOpen && (
                                  <div className="session-info">
                                    <strong>Danh sách buổi khám:</strong>
                                    {sessions.map((s, i) => (
                                      <div key={s.id} className="session-item">
                                        <p><strong>Lần {i + 1}</strong></p>
                                        <p>Ngày: {formatDate(s.date)}</p>
                                        <p>Chẩn đoán: {s.diagnosis}</p>
                                        <p>Triệu chứng: {s.symptoms}</p>
                                        <p>Ghi chú: {s.notes}</p>
                                        <div className="session-actions">
                                          <button
                                            style={{
                                              backgroundColor: "#077BF6", // màu vàng gold
                                            }}
                                            onClick={() =>
                                              navigate(`/don-thuoc/${s.id}`, {
                                                state: {
                                                  session: s,
                                                  medicalRecordId: medicalRecordId,
                                                  stageId: stage.id,
                                                },
                                              })
                                            }
                                          >
                                            Đơn thuốc
                                          </button>
                                          <button onClick={() => setEditSession({ session: s, stageId: stage.id })}>Cập nhật</button>
                                          <button onClick={() => handleDeleteSession(stage.id, s.id)}>Xóa</button>


                                        </div>
                                        <hr />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <button
                                className="session-create-btn"
                                onClick={() => setSelectedSessionStage(stage)}
                              >
                                + Thêm ngày khám
                              </button>
                            )}
                          </div>

                          {stage.status !== "COMPLETED" && (
                            <button
                              className="stage-update-btn"
                              onClick={() => setSelectedStage(stage)}
                            >
                              Cập nhật giai đoạn
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-stages">Không có giai đoạn điều trị</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isServiceModalOpen && (
        <ServiceSelectionModal
          onClose={() => setIsServiceModalOpen(false)}
          onConfirm={handleCreateTreatmentPlan}
          getAuthHeader={getAuthHeader}
        />
      )}

      {selectedStage && (
        <TreatmentStageUpdateModal
          stage={selectedStage}
          onClose={() => setSelectedStage(null)}
          onSuccess={fetchTreatmentPlans}
        />
      )}

      {(selectedSessionStage || editSession) && (
        <TreatmentSessionFormModal
          stage={selectedSessionStage || editSession.session}
          initialData={editSession?.session || null}
          isEdit={!!editSession}
          onClose={() => {
            setSelectedSessionStage(null);
            setEditSession(null);
          }}
          onSuccess={async () => {
            const pid = editSession?.stageId || selectedSessionStage.id;
            await fetchTreatmentSession(pid);
            setSelectedSessionStage(null);
            setEditSession(null);
          }}
        />
      )}

      {selectedSessionForDetail && (
        <TreatmentSessionDetailModal
          session={{
            ...selectedSessionForDetail,
            medicalRecordId: medicalRecordId,
          }}
          onClose={() => setSelectedSessionForDetail(null)}
        />
      )}

    </div>
  );
}
