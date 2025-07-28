import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_TREATMENT_PLAN } from "../../api/apiUrls";
import TreatmentSessionViewUser from "./TreatmentSessionViewUser";
import "../../styles/treatment-plan-management/TreatmentPlan.css";

export default function TreatmentPlanView({ medicalRecordId }) {
  const { getAuthHeader } = useAuth();

  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedStages, setExpandedStages] = useState({});

  useEffect(() => {
    if (medicalRecordId) {
      fetchTreatmentPlans();
    }
  }, [medicalRecordId]);

  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch(GET_TREATMENT_PLAN(medicalRecordId), {
        method: "GET",
        headers: getAuthHeader(),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Lỗi khi lấy phác đồ điều trị");
      }

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa xác định";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "Không hợp lệ"
      : date.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
  };

  const getStatusText = (status) => {
    const statusMap = {
      IN_PROGRESS: "Đang thực hiện",
      COMPLETED: "Đã hoàn thành",
      PENDING: "Chờ xử lý",
      CANCELLED: "Đã hủy",
      NOT_STARTED: "Chưa bắt đầu",
    };
    return statusMap[status] || status;
  };

  const toggleStageExpansion = (stageId) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  if (loading) {
    return <div className="treatment-plan__loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="treatment-plan__error">Lỗi: {error}</div>;
  }

  return (
    <div className="treatment-plan">
      <div className="treatment-plan__header">
        <h2 className="treatment-plan__title">Phác đồ điều trị</h2>
      </div>

      {treatmentPlans.length === 0 ? (
        <div className="treatment-plan__empty">
          <p>Không có phác đồ điều trị nào để hiển thị.</p>
        </div>
      ) : (
        <div className="treatment-plan__list">
          {treatmentPlans.map((plan) => (
            <div className="treatment-plan__item" key={plan.id}>
              <div className="treatment-plan__info">
                <h3 className="treatment-plan__service">Dịch vụ: {plan.serviceName}</h3>
                <div className="treatment-plan__meta">
                  <span className={`treatment-plan__status treatment-plan__status--${plan.status.toLowerCase()}`}>
                    {getStatusText(plan.status)}
                  </span>
                </div>
              </div>

              <div className="treatment-plan__stages">
                <h4 className="treatment-plan__stages-title">Giai đoạn điều trị:</h4>
                {plan.treatmentStageProgressResponses?.map((stage) => (
                  <div className="treatment-plan__stage" key={stage.id}>
                    <div className="treatment-plan__stage-header" onClick={() => toggleStageExpansion(stage.id)}>
                      <div className="treatment-plan__stage-info">
                        <strong className="treatment-plan__stage-name">{stage.stageName}</strong>
                        <span className={`treatment-plan__stage-status treatment-plan__stage-status--${stage.status.toLowerCase()}`}>
                          {getStatusText(stage.status)}
                        </span>
                      </div>
                      <button className="treatment-plan__stage-toggle">
                        {expandedStages[stage.id] ? "▲" : "▼"}
                      </button>
                    </div>

                    {stage.notes && (
                      <div className="treatment-plan__stage-meta">
                        <span className="treatment-plan__stage-notes">Ghi chú: {stage.notes}</span>
                      </div>
                    )}

                    {expandedStages[stage.id] && (
                      <div className="treatment-plan__stage-content">
                        <div className="treatment-plan__sessions">
                          <TreatmentSessionViewUser progressId={stage.id} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
