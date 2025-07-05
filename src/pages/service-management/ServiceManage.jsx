// src/pages/service-management/ServiceManage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LIST_SERVICE_MANAGE } from "../../api/apiUrls";
import "../../styles/service-management/ServiceManage.css";
import CreateService from "./CreateService";
import EditService from "./EditService"; // ✅ THÊM

const ServiceManage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false); // ✅ THÊM
  const [selectedService, setSelectedService] = useState(null); // ✅ THÊM

  const { getJsonAuthHeader } = useAuth();
  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(LIST_SERVICE_MANAGE, {
        method: "GET",
        headers: getJsonAuthHeader(),
      });
      const result = await res.json();

      if (res.ok && result.statusCode === 200) {
        const sortedServices = result.data.sort((a, b) => b.id - a.id);
        setServices(sortedServices);
      } else {
        setError(result.message || "Không thể tải danh sách dịch vụ.");
        setServices([]);
      }
    } catch (err) {
      console.error("Lỗi kết nối đến API:", err);
      setError("Lỗi kết nối mạng. Vui lòng thử lại.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [getJsonAuthHeader]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const toggleMenu = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const handleCloseCreateModal = () => {
    setShowCreatePopup(false);
    setActiveMenuId(null);
    fetchServices();
  };

  const handleOpenUpdateModal = (service) => { // ✅ THAY THẾ handleUpdate
    setSelectedService(service);
    setShowUpdatePopup(true);
    setActiveMenuId(null);
  };

  const handleCloseUpdateModal = () => { // ✅ THÊM
    setShowUpdatePopup(false);
    setSelectedService(null);
    fetchServices();
  };

  const handleAddDetails = (id) => {
    navigate(`/quan-ly-dich-vu/${id}/chi-tiet`);
    setActiveMenuId(null);
  };

  const handleAddStages = (id) => {
    navigate(`/quan-ly-dich-vu/${id}/giai-doan`);
    setActiveMenuId(null);
  };

  return (
    <div className="sm-container">
      <div className="sm-header">
        <h2>QUẢN LÝ PHƯƠNG PHÁP ĐIỀU TRỊ</h2>
        <button
          onClick={() => setShowCreatePopup(true)}
          className="sm-btn sm-btn-create"
        >
          Tạo dịch vụ mới
        </button>
      </div>

      {loading ? (
        <p className="sm-loading-message">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="sm-error-message">{error}</p>
      ) : services.length === 0 ? (
        <p className="sm-empty-message">
          Không tìm thấy dịch vụ nào. Hãy tạo dịch vụ mới!
        </p>
      ) : (
        <div className="sm-table-wrapper">
          <table className="sm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên dịch vụ</th>
                <th>Tiêu đề phụ</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.serviceName}</td>
                  <td>{service.subTitle}</td>
                  <td>{Number(service.price).toLocaleString("vi-VN")} đ</td>
                  <td>
                    {service.status === "AVAILABLE" && (
                      <span className="status-available">Đang hoạt động</span>
                    )}
                    {service.status === "UNAVAILABLE" && (
                      <span className="status-hidden">Tạm ngừng</span>
                    )}
                    {service.status === "DEPRECATED" && (
                      <span className="status-deprecated">Ngừng cung cấp</span>
                    )}
                    {service.status === "COMING_SOON" && (
                      <span className="status-upcoming">Sắp triển khai</span>
                    )}
                  </td>
                  <td style={{ position: "relative" }}>
                    <button
                      className="sm-btn sm-btn-action"
                      onClick={() => toggleMenu(service.id)}
                    >
                      ⋮
                    </button>
                    {activeMenuId === service.id && (
                      <div className="sm-action-menu">
                        <button onClick={() => handleOpenUpdateModal(service)}>Cập nhật</button>
                        <button onClick={() => handleAddDetails(service.id)}>Thêm chi tiết</button>
                        <button onClick={() => handleAddStages(service.id)}>Thêm giai đoạn</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal tạo mới dịch vụ */}
      {showCreatePopup && (
        <div className="create-service-modal-overlay" onClick={handleCloseCreateModal}>
          <div
            className="create-service-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="create-service-modal-close-btn"
              onClick={handleCloseCreateModal}
            >
              &times;
            </button>
            <CreateService onClose={handleCloseCreateModal} />
          </div>
        </div>
      )}

      {/* ✅ Modal cập nhật dịch vụ */}
      {showUpdatePopup && selectedService && (
        <div className="create-service-modal-overlay" onClick={handleCloseUpdateModal}>
          <div
            className="create-service-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="create-service-modal-close-btn"
              onClick={handleCloseUpdateModal}
            >
              &times;
            </button>
            <EditService
              serviceData={selectedService}
              onClose={handleCloseUpdateModal}
              onUpdate={fetchServices}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManage;
