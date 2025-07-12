import React, { useState, useEffect } from "react";
import { LIST_SERVICE } from "../../api/apiUrls";
import "../../styles/medical-record-management/ServiceSelectionModal.css";

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Chọn dịch vụ điều trị</h3>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="loading-spinner"></div>
              <span>Đang tải danh sách dịch vụ...</span>
            </div>
          ) : (
            <>
              {error && (
                <div className="modal-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              {services.length === 0 ? (
                <div className="no-services">
                  <span>Không có dịch vụ nào khả dụng</span>
                </div>
              ) : (
                <div className="service-list">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`service-item ${
                        selectedServiceId === service.id ? "selected" : ""
                      }`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <div className="service-radio">
                        <input
                          type="radio"
                          name="selectedService"
                          value={service.id}
                          checked={selectedServiceId === service.id}
                          onChange={() => handleServiceSelect(service.id)}
                        />
                      </div>
                      <div className="service-info">
                        <span className="service-name">{service.serviceName}</span>
                        {service.description && (
                          <span className="service-description">{service.description}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={creating}
          >
            Hủy
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={creating || !selectedServiceId || loading}
          >
            {creating ? (
              <>
                <div className="btn-loading-spinner"></div>
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