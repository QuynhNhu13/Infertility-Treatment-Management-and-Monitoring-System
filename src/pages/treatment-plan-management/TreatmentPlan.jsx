import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  GET_TREATMENT_PLAN,
  CREATE_TREATMENT_PLAN,
  UPDATE_TREATMENT_PLAN,
} from "../../api/apiUrls";
import ServiceSelectionModal from "../../pages/service-management/ServiceSelectionModal";
import CreateTreatmentSessionModal from "./CreateTreatmentSessionModal"; // sửa lại path nếu cần


export default function TreatmentPlan({ medicalRecordId }) {
  const { getAuthHeader } = useAuth();

  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [selectedStage, setSelectedStage] = useState(null); // để mở modal tạo session


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
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "Không hợp lệ"
      : d.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
  };

  return (
    <div className="tp-container">
      <div className="tp-header">
        <h2>Phác đồ điều trị</h2>
        {treatmentPlans.length === 0 ? (
          <button
            className="tp-create-btn"
            onClick={() => setIsServiceModalOpen(true)}
          >
            + Tạo phác đồ điều trị
          </button>
        ) : (
          <button
            className="tp-create-btn"
            onClick={() => {
              setIsServiceModalOpen(true);
              setIsUpdate(true);
            }}
          >
            ✎ Cập nhật phác đồ điều trị
          </button>
        )}
      </div>

      {loading ? (
        <div className="tp-loading">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="tp-error">Lỗi: {error}</div>
      ) : treatmentPlans.length === 0 ? (
        <div className="tp-empty">
          <p>Chưa có phác đồ điều trị nào.</p>
          <p>Bấm nút "Tạo phác đồ điều trị" để bắt đầu.</p>
        </div>
      ) : (
        <div className="tp-list">
          {treatmentPlans.map((plan) => (
            <div className="tp-item" key={plan.id}>
              <h3>Dịch vụ: {plan.serviceName}</h3>
              <p>Trạng thái: {plan.status === "IN_PROGRESS" ? "Đang thực hiện" : plan.status}</p>
              <p>
                Ngày bắt đầu: {formatDate(plan.dateStart)} | Ngày kết thúc:{" "}
                {formatDate(plan.dateEnd)}
              </p>

              <div className="tp-stages">
                <h4>Giai đoạn điều trị:</h4>
                {plan.treatmentStageProgressResponses?.map((stage) => (
  <div className="stage-item" key={stage.id}>
    <strong>{stage.stageName}</strong>
    <p>Trạng thái: {stage.status}</p>
    <p>
      Từ {formatDate(stage.dateStart)} đến{" "}
      {formatDate(stage.dateComplete)}
    </p>
    <p>Ghi chú: {stage.notes || "Không có"}</p>
    
    <button
      className="stage-session-btn"
      onClick={() => setSelectedStage(stage)}
    >
      + Tạo lịch hẹn
    </button>
  </div>
))}

              </div>
            </div>
          ))}
        </div>
      )}

      {isServiceModalOpen && (
        <ServiceSelectionModal
          onClose={() => {
            setIsServiceModalOpen(false);
            setIsUpdate(false);
          }}
          onConfirm={async (serviceId) => {
            if (isUpdate && treatmentPlans.length > 0) {
              const plan = treatmentPlans[0]; // Giả định chỉ có 1 plan
              const updateData = {
                medicalRecordId: Number(medicalRecordId),
                serviceId,
              };
              return await handleUpdateTreatmentPlan(plan.id, updateData);
            } else {
              return await handleCreateTreatmentPlan(serviceId);
            }
          }}
          getAuthHeader={getAuthHeader}
        />
      )}

      {selectedStage && (
  <CreateTreatmentSessionModal
    progressId={selectedStage.id}
    onClose={() => setSelectedStage(null)}
    onSuccess={() => {
      alert("Tạo buổi khám thành công");
      fetchTreatmentPlans(); // reload để hiển thị mới
    }}
  />
)}

    </div>
  );
}
