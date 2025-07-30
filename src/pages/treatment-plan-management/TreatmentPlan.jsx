import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  GET_TREATMENT_PLAN,
  CREATE_TREATMENT_PLAN,
  UPDATE_TREATMENT_PLAN,
} from "../../api/apiUrls";
import ServiceSelectionModal from "../../pages/service-management/ServiceSelectionModal";
import CreateTreatmentSessionModal from "./CreateTreatmentSessionModal";
import TreatmentSessionView from "./TreatmentSessionView";
import "../../styles/treatment-plan-management/TreatmentPlan.css";
import UpdateStageProgressModal from "./UpdateStageProgressModal";
import TreatmentPlanUpdateModal from "./TreatmentPlanUpdateModal";
import { toast } from "react-toastify";

export default function TreatmentPlan({ medicalRecordId }) {
  const { getAuthHeader } = useAuth();

  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [expandedStages, setExpandedStages] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [isPlanUpdateModalOpen, setIsPlanUpdateModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);


  const openUpdateModal = (id) => {
    setSelectedStageId(id);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedStageId(null);
  };

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

      if (res.status === 404) {
        setTreatmentPlans([]);
        setError("");
        return;
      }

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

  // const handleCreateTreatmentPlan = async (serviceId) => {
  //   try {
  //     const res = await fetch(CREATE_TREATMENT_PLAN, {
  //       method: "POST",
  //       headers: {
  //         ...getAuthHeader(),
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         medicalRecordId: Number(medicalRecordId),
  //         serviceId,
  //       }),
  //     });

  //     const result = await res.json();
      

  //     if (res.ok) {
  //       await fetchTreatmentPlans();
  //       setIsServiceModalOpen(false);
  //       return { success: true };
  //     } else {
  //       return { success: false, message: result.message };
  //     }
  //   } catch (err) {
  //     console.error("Lỗi khi tạo phác đồ:", err);
  //     return { success: false, message: err.message };
  //   }
  // };

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
      // Sau khi tạo phác đồ thành công, gọi tiếp API tạo hóa đơn
      const invoiceRes = await fetch(`http://localhost:8080/api/invoices/create?id=${result.data.accountId}`, {
        method: "POST",
        headers: getAuthHeader(),
      });

      const invoiceResult = await invoiceRes.json();

      if (invoiceRes.ok) {
        toast.success("Tạo phác đồ và hóa đơn thành công");
      } else {
        toast.warning("Tạo phác đồ thành công nhưng tạo hóa đơn thất bại");
      }

      await fetchTreatmentPlans();
      setIsServiceModalOpen(false);
      return { success: true };
    } else {
      return { success: false, message: result.message };
    }
  } catch (err) {
    console.error("Lỗi khi tạo phác đồ hoặc hóa đơn:", err);
    return { success: false, message: err.message };
  }
};


  const handleUpdateTreatmentPlan = async (planId, updatedData) => {
    try {
      const res = await fetch(UPDATE_TREATMENT_PLAN(planId), {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Cập nhật phác đồ thành công");
        await fetchTreatmentPlans();
        return { success: true };
      } else {
        alert("Cập nhật thất bại: " + result.message);
        return { success: false };
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật phác đồ:", err);
      return { success: false, message: err.message };
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

  const handleServiceModalConfirm = async (serviceId) => {
    if (isUpdate && treatmentPlans.length > 0) {
      const plan = treatmentPlans[0];
      const updateData = {
        medicalRecordId: Number(medicalRecordId),
        serviceId,
      };
      return await handleUpdateTreatmentPlan(plan.id, updateData);
    } else {
      return await handleCreateTreatmentPlan(serviceId);
    }
  };

  const handleSessionCreated = () => {
    alert("Tạo buổi khám thành công");
    fetchTreatmentPlans();
    setSelectedStage(null);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setIsUpdate(false);
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
        {treatmentPlans.length === 0 ? (
          <button
            className="treatment-plan__btn treatment-plan__btn--create"
            onClick={() => setIsServiceModalOpen(true)}
          >
            + Tạo phác đồ điều trị
          </button>
        ) : (
          <button
            className="treatment-plan__btn treatment-plan__btn--update"
            onClick={() => {
              const firstPlan = treatmentPlans[0];
              if (firstPlan) {
                setSelectedPlanId(firstPlan.id);
                setIsPlanUpdateModalOpen(true);
              }
            }}
          >
            ✎ Cập nhật phác đồ điều trị
          </button>

        )}
      </div>

      {treatmentPlans.length === 0 ? (
        <div className="treatment-plan__empty">
          <p>Chưa có phác đồ điều trị nào.</p>
          <p>Bấm nút "Tạo phác đồ điều trị" để bắt đầu.</p>
        </div>
      ) : (
        <div className="treatment-plan__list">
          {treatmentPlans.map((plan) => (
            <div className="treatment-plan__item" key={plan.id}>
              <div className="treatment-plan__item" key={plan.id}>
                <div className="treatment-plan__info">
                  <h3 className="treatment-plan__service">Phương pháp: {plan.serviceName}</h3>

                  <div className="treatment-plan__meta">
                    <span
                      className={`treatment-plan__status treatment-plan__status--${plan.status.toLowerCase()}`}
                    >
                      {getStatusText(plan.status)}
                    </span>
                  </div>

                  {(plan.dateStart || plan.dateEnd || plan.notes) && (
                    <div className="treatment-plan__details" style={{ fontSize: "14px", color: "#333" }}>
                      {(plan.dateStart || plan.dateEnd) && (
                        <>
                          {plan.dateStart && (
                            <p><strong style={{ color: "#077BF6" }}>Ngày bắt đầu:</strong> {new Date(plan.dateStart).toLocaleDateString()}</p>
                          )}
                          {plan.dateEnd && (
                            <p><strong style={{ color: "#077BF6" }}>Ngày kết thúc:</strong> {new Date(plan.dateEnd).toLocaleDateString()}</p>
                          )}
                        </>
                      )}
                      {plan.notes && (
                        <p><strong style={{ color: "#077BF6" }}>Ghi chú:</strong> {plan.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>


              <div className="treatment-plan__stages">
                <h4 className="treatment-plan__stages-title">Giai đoạn điều trị:</h4>
                {plan.treatmentStageProgressResponses?.map((stage) => (
                  <div className="treatment-plan__stage" key={stage.id}>
                    <div
                      className="treatment-plan__stage-header"
                      onClick={() => toggleStageExpansion(stage.id)}
                    >
                      <div className="treatment-plan__stage-info">
                        <strong className="treatment-plan__stage-name">{stage.stageName}</strong>
                        <span
                          className={`treatment-plan__stage-status treatment-plan__stage-status--${stage.status.toLowerCase()}`}
                        >
                          {getStatusText(stage.status)}
                        </span>
                      </div>
                      <button className="treatment-plan__stage-toggle">
                        {expandedStages[stage.id] ? "▲" : "▼"}
                      </button>
                    </div>

                    <div className="treatment-plan__stage-meta">
                      {stage.notes && (
                        <span className="treatment-plan__stage-notes">
                          Ghi chú: {stage.notes}
                        </span>
                      )}
                    </div>

                    {expandedStages[stage.id] && (
                      <div className="treatment-plan__stage-content">
                        <div className="treatment-plan__sessions">
                          <TreatmentSessionView progressId={stage.id} />
                        </div>
                        <div className="treatment-plan__stage-buttons">
                          <button
                            className="treatment-plan__btn treatment-plan__btn--session"
                            onClick={() => setSelectedStage(stage)}
                          >
                            + Tạo lịch hẹn
                          </button>
                          <button
                            onClick={() => openUpdateModal(stage.id)}
                            style={{
                              marginLeft: "15px",
                              backgroundImage: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                              color: "#fff",
                              padding: "6px 14px",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "13px",
                              cursor: "pointer",
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                              transition: "filter 0.3s ease"
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(0.95)")}
                            onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                          >
                            ✎ Cập nhật tiến trình
                          </button>


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

      <UpdateStageProgressModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        stageId={selectedStageId}
        onUpdateSuccess={fetchTreatmentPlans}
      />

      {isServiceModalOpen && (
        <ServiceSelectionModal
          onClose={closeServiceModal}
          onConfirm={handleServiceModalConfirm}
          getAuthHeader={getAuthHeader}
        />
      )}

      {selectedStage && (
        <CreateTreatmentSessionModal
          progressId={selectedStage.id}
          onClose={() => setSelectedStage(null)}
          onSuccess={handleSessionCreated}
        />
      )}

      {isPlanUpdateModalOpen && selectedPlanId && (
        <TreatmentPlanUpdateModal
          isOpen={isPlanUpdateModalOpen}
          onRequestClose={() => {
            setIsPlanUpdateModalOpen(false);
            setSelectedPlanId(null);
          }}
          planId={selectedPlanId}
          onUpdated={fetchTreatmentPlans}
        />
      )}

    </div>
  );
}
