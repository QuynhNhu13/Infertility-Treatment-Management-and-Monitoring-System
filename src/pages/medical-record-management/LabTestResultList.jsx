// src/pages/medical-record-management/LabTestResultList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEARCH_LAB_TEST_RESULT } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import LabTestResultForm from "./LabTestResultForm";
import LabTestResultView from "./LabTestResultView";
import "../../styles/medical-record-management/LabTestResultList.css";
import { FiSearch } from "react-icons/fi";

export default function LabTestResultList() {
  const { getAuthHeader } = useAuth();
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchResults();
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchResults = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      const isPhone = /^\d{8,15}$/.test(searchTerm);

      if (searchTerm.trim() !== "") {
        if (isPhone) {
          params.phoneNumber = searchTerm;
        } else {
          params.fullName = searchTerm;
        }
      }

      const res = await fetch(SEARCH_LAB_TEST_RESULT(params), {
        method: "GET",
        headers: getAuthHeader(),
      });

      const data = await res.json();

      if (res.ok) {
        setLabResults(data.data || []);
      } else {
        throw new Error(data.message || "Không thể tải danh sách xét nghiệm.");
      }
    } catch (err) {
      console.error("Lỗi khi tải lab test:", err);
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleClearSearch = () => setSearchTerm("");
  const handleCloseModal = () => setSelectedTestId(null);
  const handleFormSuccess = () => {
    setSelectedTestId(null);
    fetchResults();
  };

  const handleOpenModal = (testId, status) => {
    setSelectedTestId(testId);
    setModalMode(status === "COMPLETED" ? "view" : "create");
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    } catch {
      return dateStr || "Không rõ";
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "PROCESSING":
        return "Đang xử lý";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "PENDING":
        return "Chờ xử lý";
      default:
        return status || "Không rõ";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PROCESSING":
        return "status-processing";
      case "COMPLETED":
        return "status-completed";
      case "PENDING":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  return (
    <>
      <div className="ltr-container">
        <div className="ltr-header">
          <h2 className="ltr-title">Danh sách kết quả xét nghiệm</h2>
          <p className="ltr-subtitle">Tìm kiếm và quản lý kết quả xét nghiệm</p>
        </div>

        <div className="ltr-search-section">
          <div className="ltr-search-wrapper">
            <div className="ltr-search-input-container">
              <FiSearch className="ltr-search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm theo họ tên bệnh nhân hoặc số điện thoại..."
                className="ltr-search-input"
              />
              {searchTerm && (
                <button type="button" onClick={handleClearSearch} className="ltr-clear-search">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="ltr-error">
            <i className="ltr-error-icon">⚠️</i>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="ltr-loading">
            <div className="ltr-spinner"></div>
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="ltr-results-section">
            <div className="ltr-results-header">
              <h3>Kết quả xét nghiệm</h3>
              <span className="ltr-results-count">
                {labResults.length > 0
                  ? `Tìm thấy ${labResults.length} kết quả`
                  : "Không có kết quả"}
              </span>
            </div>

            <div className="ltr-table-container">
              <table className="ltr-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên xét nghiệm</th>
                    <th>Họ tên bệnh nhân</th>
                    <th>Số điện thoại</th>
                    <th>Ngày xét nghiệm</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {[...labResults]
                    .sort((a, b) => new Date(b.testDate) - new Date(a.testDate))
                    .map((test) => (
                      <tr key={test.id}>
                        <td>{test.id}</td>
                        <td>{test.labTestName}</td>
                        <td>{test.patientFullName || "Không rõ"}</td>
                        <td>{test.patientPhoneNumber || "Không có"}</td>
                        <td>{formatDate(test.testDate)}</td>
                        <td>
                          <span className={`ltr-status ${getStatusClass(test.status)}`}>
                            {translateStatus(test.status)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="ltr-action-btn"
                            onClick={() => handleOpenModal(test.id, test.status)}
                          >
                            {test.status === "COMPLETED" ? "Xem kết quả" : "Gửi kết quả"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  {labResults.length === 0 && (
                    <tr>
                      <td colSpan="7" className="ltr-no-data">
                        <div className="ltr-no-data-content">
                          <i className="ltr-no-data-icon">📋</i>
                          <p>Không tìm thấy kết quả</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedTestId && modalMode === "view" && (
        <LabTestResultView labTestId={selectedTestId} onClose={handleCloseModal} />
      )}

      {selectedTestId && modalMode === "create" && (
        <div className="ltr-modal-overlay" onClick={handleCloseModal}>
          <div className="ltr-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ltr-modal-header">
              <h3>Gửi kết quả xét nghiệm</h3>
              <button className="ltr-modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            <div className="ltr-modal-body">
              <LabTestResultForm
                labTestId={selectedTestId}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
