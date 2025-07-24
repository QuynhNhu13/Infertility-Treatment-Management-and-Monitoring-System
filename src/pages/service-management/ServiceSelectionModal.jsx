import React, { useState, useEffect } from "react";
import { LIST_SERVICE } from "../../api/apiUrls";
import "../../styles/service-management/ServiceSelectionModal.css";

export default function ServiceSelectionModal({ onClose, onConfirm, getAuthHeader }) {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(LIST_SERVICE, {
        method: "GET",
        headers: getAuthHeader(),
      });
      const result = await res.json();
      if (res.ok) {
        setServices(result.data || []);
      } else {
        setError(result.message || "Lỗi khi lấy danh sách dịch vụ");
      }
    } catch (err) {
      console.error("Lỗi khi fetch services:", err);
      setError("Không thể tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedServiceId) {
      setError("Vui lòng chọn một dịch vụ");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const result = await onConfirm(selectedServiceId);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || "Tạo phác đồ thất bại");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra khi tạo phác đồ");
    } finally {
      setCreating(false);
    }
  };

  const handleServiceSelect = (serviceId) => {
    setSelectedServiceId(serviceId);
    setError("");
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="ssm-modal-overlay" onClick={onClose}>
      <div className="ssm-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="ssm-modal-header">
          <h3>Chọn dịch vụ điều trị</h3>
          <button className="ssm-modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="ssm-modal-body">
          {loading ? (
            <div className="ssm-modal-loading">
              <div className="ssm-loading-spinner"></div>
              <span>Đang tải danh sách dịch vụ...</span>
            </div>
          ) : (
            <>
              {error && (
                <div className="ssm-modal-error">
                  <span className="ssm-error-icon">⚠️</span>
                  {error}
                </div>
              )}

              {services.length === 0 ? (
                <div className="ssm-no-services">
                  <span>Không có dịch vụ nào khả dụng</span>
                </div>
              ) : (
                <div className="ssm-service-list">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`ssm-service-item ${
                        selectedServiceId === service.id ? "ssm-selected" : ""
                      }`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <div className="ssm-service-radio">
                        <input
                          type="radio"
                          name="selectedService"
                          value={service.id}
                          checked={selectedServiceId === service.id}
                          onChange={() => handleServiceSelect(service.id)}
                        />
                      </div>
                      <div className="ssm-service-info">
                        <span className="ssm-service-name">{service.serviceName}</span>
                        {service.description && (
                          <span className="ssm-service-description">{service.description}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="ssm-modal-footer">
          <button
            className="ssm-btn-cancel"
            onClick={onClose}
            disabled={creating}
          >
            Hủy
          </button>
          <button
            className="ssm-btn-confirm"
            onClick={handleConfirm}
            disabled={creating || !selectedServiceId || loading}
          >
            {creating ? (
              <>
                <div className="ssm-btn-loading-spinner"></div>
                Đang tạo...
              </>
            ) : (
              "Tạo phác đồ"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
