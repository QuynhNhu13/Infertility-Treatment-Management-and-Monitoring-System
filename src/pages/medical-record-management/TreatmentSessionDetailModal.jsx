import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/medical-record-management/TreatmentSessionDetailModal.css";
import { GET_TREATMENT_DETAIL, DELETE_ULTRASOUND } from "../../api/apiUrls";
import LabTestFollowUpRequestModal from "./LabTestFollowUpRequestModal";
import FollowUpUltrasoundModal from "./FollowUpUltrasoundModal";
import {
  FileText,
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  TestTube,
  Stethoscope,
  Eye,
  Download,
  Edit2,
  Trash
} from "lucide-react";
import { toast } from "react-toastify";

export default function TreatmentSessionDetailModal({ session, onClose }) {
  const { getAuthHeader } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLabTestModal, setShowLabTestModal] = useState(false);
  const [showUltrasoundModal, setShowUltrasoundModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingUltrasound, setEditingUltrasound] = useState(null);

  const fetchSessionDetail = useCallback(async () => {
    if (!session?.id) {
      setError("Không có thông tin phiên điều trị");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(GET_TREATMENT_DETAIL(session.id), {
        method: "GET",
        headers: getAuthHeader(),
      });
      const result = await res.json();

      if (res.ok) {
        setDetails(result.data);
      } else {
        setError(result.message || "Không thể tải chi tiết buổi khám");
        setDetails(null);
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết buổi điều trị:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, [session?.id, getAuthHeader]);

  useEffect(() => {
    fetchSessionDetail();
  }, [fetchSessionDetail]);

  const handleLabTestSuccess = useCallback(() => {
    setShowLabTestModal(false);
    fetchSessionDetail();
  }, [fetchSessionDetail]);

  const handleUltrasoundSuccess = useCallback(() => {
    setShowUltrasoundModal(false);
    setEditingUltrasound(null);
    fetchSessionDetail();
  }, [fetchSessionDetail]);

  const translateStatus = (status) => {
    const statusMap = {
      "PROCESSING": { text: "Đang xử lý", icon: Clock, color: "warning" },
      "COMPLETED": { text: "Đã hoàn thành", icon: CheckCircle, color: "success" },
      "PENDING": { text: "Đang chờ", icon: AlertCircle, color: "info" },
    };
    return statusMap[status] || { text: "Không rõ", icon: AlertCircle, color: "default" };
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleImageDownload = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ultrasound_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteUltrasound = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá kết quả siêu âm này?")) return;

    try {
      const res = await fetch(DELETE_ULTRASOUND(id), {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Đã xoá kết quả siêu âm");
        fetchSessionDetail();
      } else {
        toast.error(data.message || "Xoá thất bại");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống khi xoá siêu âm");
    }
  };

  if (!session) return null;

  return (
    <>
      <div className="treatment-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="treatment-modal-content">
          <div className="treatment-modal-header">
            <div className="header-content">
              <div className="header-title">
                <FileText size={20} />
                <h3>Chi tiết buổi khám</h3>
              </div>
              <div className="session-info">
                <span className="session-date">
                  <Calendar size={16} />
                  {formatDate(session.createdAt || session.date)}
                </span>
              </div>
            </div>
            <button className="treatment-modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="treatment-modal-body">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải chi tiết...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <AlertCircle size={24} className="error-icon" />
                <p className="error-message">{error}</p>
                <button onClick={fetchSessionDetail} className="retry-btn">
                  <RefreshCw size={16} />
                  Thử lại
                </button>
              </div>
            ) : (
              <div className="results-container">
                {/* Kết quả xét nghiệm */}
                {details?.labTestResults?.length > 0 && (
                  <div className="results-section">
                    <div className="section-header">
                      <TestTube size={20} />
                      <h4>Kết quả xét nghiệm ({details.labTestResults.length})</h4>
                    </div>
                    <div className="results-list scrollable-section">
                      {details.labTestResults.map((item, index) => {
                        const statusInfo = translateStatus(item.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <div key={index} className="result-item lab-test-item">
                            <div className="result-header">
                              <h5>{item.labTestName || "Xét nghiệm không rõ"}</h5>
                              <div className={`status-badge ${statusInfo.color}`}>
                                <StatusIcon size={14} />
                                {statusInfo.text}
                              </div>
                            </div>
                            <div className="result-content">
                              <div className="result-row">
                                <span className="label">Kết quả tóm tắt:</span>
                                <span className="value">{item.resultSummary || "Chưa có"}</span>
                              </div>
                              <div className="result-row">
                                <span className="label">Chi tiết:</span>
                                <span className="value">{item.resultDetails || "Chưa có"}</span>
                              </div>
                              {item.notes && (
                                <div className="result-row">
                                  <span className="label">Ghi chú:</span>
                                  <span className="value">{item.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Kết quả siêu âm */}
                {details?.ultrasounds?.length > 0 && (
                  <div className="results-section">
                    <div className="section-header">
                      <Stethoscope size={20} />
                      <h4>Kết quả siêu âm ({details.ultrasounds.length})</h4>
                    </div>
                    <div className="results-list scrollable-section">
                      {details.ultrasounds.map((us, index) => (
                        <div key={index} className="result-item ultrasound-item">
                          <div className="result-header">
                            <h5>Siêu âm #{index + 1}</h5>
                            <div className="date-badge">
                              <Calendar size={14} /> {formatDate(us.date)}
                            </div>
                            <div className="action-group">
                              <button onClick={() => setEditingUltrasound(us)} title="Sửa">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteUltrasound(us.id)} title="Xoá">
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="result-content">
                            <div className="result-description">
                              <span className="label">Kết quả:</span>
                              <p className="description-text">{us.result || "Chưa có mô tả"}</p>
                            </div>
                            {us.imgUrls?.length > 0 && (
                              <div className="ultrasound-images">
                                <span className="label">Hình ảnh ({us.imgUrls.length}):</span>
                                <div className="us-image-grid">
                                  {us.imgUrls.map((url, i) => (
                                    <div key={i} className="us-image-item">
                                      <div className="us-image-wrapper">
                                        <img src={url} alt={`us-${i}`} className="us-thumbnail" onClick={() => handleImageClick(url)} />
                                        <div className="image-overlay">
                                          <button onClick={() => handleImageClick(url)}><Eye size={16} /></button>
                                          <button onClick={() => handleImageDownload(url, i)}><Download size={16} /></button>
                                        </div>
                                      </div>
                                      <span>Ảnh {i + 1}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!details?.labTestResults?.length && !details?.ultrasounds?.length) && (
                  <div className="no-results">
                    <Activity size={48} className="no-results-icon" />
                    <h4>Chưa có kết quả</h4>
                    <p>Buổi khám này chưa có kết quả xét nghiệm hoặc siêu âm nào.</p>
                  </div>
                )}

                <div className="action-buttons">
                  <button onClick={() => setShowLabTestModal(true)} className="primary-btn">
                    <TestTube size={16} /> Yêu cầu xét nghiệm
                  </button>
                  <button onClick={() => setShowUltrasoundModal(true)} className="secondary-btn">
                    <Stethoscope size={16} /> Tạo kết quả siêu âm
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="treatment-modal-footer">
            <button className="cancel-btn" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content">
            <button className="image-modal-close" onClick={() => setSelectedImage(null)}>
              <X size={24} />
            </button>
            <img src={selectedImage} alt="Ultrasound Full View" className="full-image" />
            <div className="image-actions">
              <button onClick={() => handleImageDownload(selectedImage, 0)} className="download-full-btn">
                <Download size={16} /> Tải xuống
              </button>
            </div>
          </div>
        </div>
      )}

      {showLabTestModal && (
        <LabTestFollowUpRequestModal
          recordId={session?.medicalRecordId}
          sessionId={session?.id}
          onClose={() => setShowLabTestModal(false)}
          onSuccess={handleLabTestSuccess}
        />
      )}

      {(showUltrasoundModal || editingUltrasound) && (
        <FollowUpUltrasoundModal
          isOpen={showUltrasoundModal || !!editingUltrasound}
          onClose={() => {
            setShowUltrasoundModal(false);
            setEditingUltrasound(null);
          }}
          sessionId={session?.id}
          medicalRecordId={session?.medicalRecordId}
          onSuccess={handleUltrasoundSuccess}
          mode={editingUltrasound ? "update" : "create"}
          initialData={editingUltrasound}
        />
      )}
    </>
  );
}