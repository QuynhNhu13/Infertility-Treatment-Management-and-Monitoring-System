import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LIST_SERVICE_MANAGE,
  LIST_SERVICE_DETAILS,
  LIST_SERVICE_STAGES,
  DELETE_SERVICE_STAGE
} from "../../api/apiUrls";
import ROUTES from "../../routes/RoutePath";
import '../../styles/service-management/ServiceManage.css';
import CreateService from "./CreateService";
import EditService from "./EditService";
import CreateServiceDetails from "./CreateServiceDetails";
import EditServiceDetails from "./EditServiceDetails";
import CreateServiceStage from "./CreateServiceStage";
import EditServiceStages from "./EditServiceStages";

const ServiceManage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [showAddDetailsPopup, setShowAddDetailsPopup] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [selectedDetailData, setSelectedDetailData] = useState(null);

  const [showDetailTable, setShowDetailTable] = useState(false);
  const [servicesWithDetails, setServicesWithDetails] = useState([]);

  const [showStagePopup, setShowStagePopup] = useState(false); 
  const [showStageTable, setShowStageTable] = useState(false); 
  const [servicesWithStages, setServicesWithStages] = useState([]); 

  const [showEditStagePopup, setShowEditStagePopup] = useState(false); 


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
        setError(result.message || "Không thể tải danh sách phương pháp.");
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

  const fetchServicesWithDetails = useCallback(async () => {
    const filtered = [];
    for (const service of services) {
      try {
        const res = await fetch(LIST_SERVICE_DETAILS(service.id), {
          headers: getJsonAuthHeader(),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.statusCode === 200 && result.data?.id) {
            filtered.push(service);
          }
        }
      } catch (err) {
        console.error(`Lỗi lấy chi tiết cho service ${service.id}`, err);
      }
    }
    setServicesWithDetails(filtered);
  }, [services, getJsonAuthHeader]);

  useEffect(() => {
    if (showDetailTable) {
      fetchServicesWithDetails();
    }
  }, [showDetailTable, fetchServicesWithDetails]);

  const fetchServicesWithStages = useCallback(async () => {
    const filtered = [];
    for (const service of services) {
      try {
        const res = await fetch(LIST_SERVICE_STAGES(service.id), {
          headers: getJsonAuthHeader(),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.statusCode === 200 && result.data?.length > 0) {
            filtered.push({
              ...service,
              stages: result.data,
            });
          }
        }
      } catch (err) {
        console.error(`Lỗi lấy stage cho service ${service.id}`, err);
      }
    }
    setServicesWithStages(filtered);
  }, [services, getJsonAuthHeader]);

  useEffect(() => {
    if (showStageTable) {
      fetchServicesWithStages();
    }
  }, [showStageTable, fetchServicesWithStages]);

  const handleDeleteStage = async (serviceId, stageId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa giai đoạn này không?")) return;

    try {
      const res = await fetch(DELETE_SERVICE_STAGE(serviceId, stageId), {
        method: "DELETE",
        headers: getJsonAuthHeader(),
      });

      if (res.status === 204) {
        alert("Đã xóa giai đoạn thành công");
        fetchServicesWithStages();
      } else {
        const result = await res.json();
        alert(`Không thể xóa: ${result.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi khi xóa stage:", err);
      alert("Xảy ra lỗi khi kết nối tới server.");
    }
  };


  const toggleMenu = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const handleCloseCreateModal = () => {
    setShowCreatePopup(false);
    setActiveMenuId(null);
    fetchServices();
  };

  const handleOpenUpdateModal = (service) => {
    setSelectedService(service);
    setShowUpdatePopup(true);
    setActiveMenuId(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdatePopup(false);
    setSelectedService(null);
    fetchServices();
  };

  const handleAddDetails = (id) => {
    setSelectedServiceId(id);
    setIsEditingDetails(false);
    setSelectedDetailData(null);
    setShowAddDetailsPopup(true);
    setActiveMenuId(null);
  };

  const handleEditDetails = async (id) => {
    setSelectedServiceId(id);
    try {
      const res = await fetch(LIST_SERVICE_DETAILS(id), {
        headers: getJsonAuthHeader(),
      });
      const result = await res.json();
      if (res.ok && result.statusCode === 200 && result.data?.id) {
        console.log("Chi tiết nhận được:", result.data);
        setSelectedDetailId(result.data.id);
        setSelectedDetailData(result.data);
        setIsEditingDetails(true);
        setShowAddDetailsPopup(true);
      } else {
        console.warn("Không tìm thấy chi tiết phương pháp!");
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết phương pháp:", err);
    }
  };

  const handleCloseAddDetailsModal = () => {
    setShowAddDetailsPopup(false);
    setSelectedServiceId(null);
    setSelectedDetailId(null);
    setSelectedDetailData(null);
    fetchServices();
  };

  const handleAddStages = (id) => {
    setSelectedServiceId(id);
    setShowStagePopup(true);
    setActiveMenuId(null);
  };

  const handleCloseStageModal = () => {
    setShowStagePopup(false);
    setSelectedServiceId(null);
    fetchServices();
  };

  const handleViewDetails = (id) => {
    navigate(ROUTES.SERVICE_DETAIL_PAGE(id));
  };

  return (
    <div className="sm-container">
      <div className="sm-header">
        <h2>QUẢN LÝ PHƯƠNG PHÁP ĐIỀU TRỊ</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowCreatePopup(true)}
            className="sm-btn sm-btn-create"
          >
            Tạo phương pháp mới
          </button>
        </div>
      </div>

      {loading ? (
        <p className="sm-loading-message">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="sm-error-message">{error}</p>
      ) : services.length === 0 ? (
        <p className="sm-empty-message">
          Không tìm thấy phương pháp nào. Hãy tạo phương pháp mới!
        </p>
      ) : (
        <div className="sm-table-wrapper">
          <table className="sm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên phương pháp</th>
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
                      <div className="sm-action-menu-1">
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

      <div className="sm-header">
        <h2>DANH SÁCH CHI TIẾT CÁC PHƯƠNG PHÁP</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowDetailTable(!showDetailTable)}
            className="sm-btn sm-btn-secondary"
          >
            {showDetailTable ? "Ẩn bảng chi tiết" : "Quản lý chi tiết"}
          </button>
        </div>
      </div>

      {showDetailTable && (
        <div className="sm-table-wrapper">
          <table className="sm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên phương pháp</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {servicesWithDetails.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.serviceName}</td>
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
                  <td>
                    <button onClick={() => handleViewDetails(service.id)}>Xem chi tiết</button>
                    <button onClick={() => handleEditDetails(service.id)}>Cập nhật</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="sm-header">
        <h2>DANH SÁCH GIAI ĐOẠN CÁC PHƯƠNG PHÁP</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowStageTable(!showStageTable)}
            className="sm-btn sm-btn-secondary"
          >
            {showStageTable ? "Ẩn bảng giai đoạn" : "Quản lý giai đoạn"}
          </button>
        </div>
      </div>

      {showStageTable && (
        <div className="sm-table-wrapper">
          <table className="sm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên phương pháp</th>
                <th>Danh sách giai đoạn</th>
                <th>Trạng thái</th>
                <th>Hành động</th> 
              </tr>
            </thead>
            <tbody>
              {servicesWithStages.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.serviceName}</td>
                  <td>
                    {service.stages.map((stage) => (
                      <div key={stage.id} style={{ marginBottom: "6px" }}>
                        <strong>{stage.name}</strong> - Thứ tự: {stage.stageOrder} - {stage.duration} ngày
                      </div>
                    ))}
                  </td>
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
                  <td>
                    <button
                      className="sm-btn sm-btn-edit"
                      style={{ fontSize: "12px", marginBottom: "6px" }}
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        setShowEditStagePopup(true);
                      }}
                    >
                      Cập nhật giai đoạn
                    </button>

                    <select
                      className="sm-stage-delete-select"
                      onChange={(e) => {
                        const stageId = e.target.value;
                        if (stageId && window.confirm("Xác nhận xóa giai đoạn này?")) {
                          handleDeleteStage(service.id, stageId);
                        }
                        e.target.selectedIndex = 0;
                      }}
                    >
                      <option>-- Chọn giai đoạn để xóa --</option>
                      {service.stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name} (Thứ tự {stage.stageOrder})
                        </option>
                      ))}
                    </select>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {showCreatePopup && (
        <div className="create-service-modal-overlay" onClick={handleCloseCreateModal}>
          <div className="create-service-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="create-service-modal-close-btn" onClick={handleCloseCreateModal}>
              &times;
            </button>
            <CreateService onClose={handleCloseCreateModal} />
          </div>
        </div>
      )}

      {showUpdatePopup && selectedService && (
        <div className="create-service-modal-overlay" onClick={handleCloseUpdateModal}>
          <div className="create-service-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="create-service-modal-close-btn" onClick={handleCloseUpdateModal}>
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

      {showAddDetailsPopup && selectedServiceId && (
        <div className="create-service-modal-overlay" onClick={handleCloseAddDetailsModal}>
          <div className="create-service-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="create-service-modal-close-btn" onClick={handleCloseAddDetailsModal}>
              &times;
            </button>
            {isEditingDetails ? (
              <EditServiceDetails
                serviceId={selectedServiceId}
                id={selectedDetailId}
                existingData={selectedDetailData}
                onClose={handleCloseAddDetailsModal}
              />
            ) : (
              <CreateServiceDetails
                serviceId={selectedServiceId}
                onClose={handleCloseAddDetailsModal}
              />
            )}
          </div>
        </div>
      )}

      {showStagePopup && selectedServiceId && (
        <div className="create-service-modal-overlay" onClick={handleCloseStageModal}>
          <div className="create-service-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="create-service-modal-close-btn" onClick={handleCloseStageModal}>
              &times;
            </button>
            <CreateServiceStage
              serviceId={selectedServiceId}
              onClose={handleCloseStageModal}
              onCreated={fetchServices}
            />
          </div>
        </div>
      )}
  {showEditStagePopup && selectedServiceId && (
  <div
    className="sm-modal-overlay-a"
    onClick={() => setShowEditStagePopup(false)}
  >
    <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "100%" }}>
      <button
        className="sm-modal-close-btn-a"
        onClick={() => setShowEditStagePopup(false)}
      >
        &times;
      </button>

      <EditServiceStages
        serviceId={selectedServiceId}
        onClose={() => setShowEditStagePopup(false)}
        onUpdated={() => {
          fetchServices();
          fetchServicesWithStages();
        }}
      />
    </div>
  </div>
)}




    </div>
  );
};

export default ServiceManage;
