// src/pages/medical-record-management/LabTestResultView.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_LAB_TEST_RESULT_VIEW } from "../../api/apiUrls";
import "../../styles/medical-record-management/LabTestResultView.css";

export default function LabTestResultView({ labTestId, onClose }) {
  const { getAuthHeader } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!labTestId) return;
    fetchData();
  }, [labTestId]);

  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle ESC key
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(GET_LAB_TEST_RESULT_VIEW(labTestId), {
        method: "GET",
        headers: getAuthHeader(),
      });

      const result = await res.json();
      if (res.ok) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Không thể lấy kết quả xét nghiệm.");
      }
    } catch (err) {
      setError(err.message || "Lỗi khi gọi API.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    } catch {
      return dateStr || "Không rõ";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return <span className="ltf-status-badge completed">Đã hoàn thành</span>;
      case "PROCESSING":
        return <span className="ltf-status-badge processing">Đang xử lý</span>;
      default:
        return <span className="ltf-status-badge unknown">Không rõ</span>;
    }
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case "MALE":
        return "Nam";
      case "FEMALE":
        return "Nữ";
      default:
        return "Không rõ";
    }
  };

  if (!labTestId) return null;

  return (
    <div className="ltf-modal-overlay" onClick={onClose}>
      <div className="ltf-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="ltf-modal-header">
          <div className="ltf-modal-title">
            <svg className="ltf-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <h1>Kết quả xét nghiệm</h1>
          </div>
          <button className="ltf-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="ltf-modal-body">
          {loading ? (
            <div className="ltf-loading-container">
              <div className="ltf-loading-spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="ltf-error-container">
              <svg className="ltf-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <p>{error}</p>
            </div>
          ) : !data ? (
            <div className="ltf-error-container">
              <svg className="ltf-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p>Không có dữ liệu.</p>
            </div>
          ) : (
            <div className="ltf-content">
              {/* Patient Information Section */}
              <div className="ltf-section">
                <div className="ltf-section-header">
                  <svg className="ltf-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <h2>Thông tin bệnh nhân</h2>
                </div>
                <div className="ltf-info-grid">
                  <div className="ltf-info-item">
                    <label>Họ tên</label>
                    <span className="ltf-info-value highlight">{data.patientFullName || "Không rõ"}</span>
                  </div>
                  <div className="ltf-info-item">
                    <label>Ngày sinh</label>
                    <span className="ltf-info-value">{formatDate(data.patientDob)}</span>
                  </div>
                  <div className="ltf-info-item">
                    <label>Giới tính</label>
                    <span className="ltf-info-value">{getGenderText(data.patientGender)}</span>
                  </div>
                  <div className="ltf-info-item">
                    <label>Số điện thoại</label>
                    <span className="ltf-info-value">{data.patientPhoneNumber || "Không rõ"}</span>
                  </div>
                </div>
              </div>

              {/* Test Information Section */}
              <div className="ltf-section">
                <div className="ltf-section-header">
                  <svg className="ltf-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 11H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z"/>
                    <path d="M13 11h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z"/>
                    <path d="M7 3L5 2v6l2-1 2 1V2l-2 1z"/>
                    <path d="M17 3l-2-1v6l2-1 2 1V2l-2 1z"/>
                  </svg>
                  <h2>Chi tiết xét nghiệm</h2>
                </div>
                
                <div className="ltf-info-grid">
                  <div className="ltf-info-item">
                    <label>Tên xét nghiệm</label>
                    <span className="ltf-info-value highlight">{data.labTestName || "Không rõ"}</span>
                  </div>
                  <div className="ltf-info-item">
                    <label>Ngày xét nghiệm</label>
                    <span className="ltf-info-value">{formatDate(data.testDate)}</span>
                  </div>
                  <div className="ltf-info-item">
                    <label>Trạng thái</label>
                    <div className="ltf-info-value">{getStatusBadge(data.status)}</div>
                  </div>
                </div>

                <div className="ltf-results-section">
                  <div className="ltf-result-item">
                    <label>
                      <svg className="ltf-result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                      Tóm tắt kết quả
                    </label>
                    <div className="ltf-result-summary">
                      {data.resultSummary || "Không có thông tin"}
                    </div>
                  </div>

                  <div className="ltf-result-item">
                    <label>
                      <svg className="ltf-result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      Chi tiết kết quả
                    </label>
                    <div className="ltf-result-details">
                      {data.resultDetails || "Không có thông tin"}
                    </div>
                  </div>

                  {data.notes && (
                    <div className="ltf-result-item">
                      <label>
                        <svg className="ltf-result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10,9 9,9 8,9"/>
                        </svg>
                        Ghi chú
                      </label>
                      <div className="ltf-result-notes">
                        {data.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ltf-modal-footer">
          <button className="ltf-footer-btn secondary" onClick={onClose}>
            Đóng
          </button>
          {data && (
            <button className="ltf-footer-btn primary" onClick={() => window.print()}>
              <svg className="ltf-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6,9 6,2 18,2 18,9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              In kết quả
            </button>
          )}
        </div>
      </div>
    </div>
  );
}