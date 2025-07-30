import React, { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/schedule-management/UpdateTemplateModal.css";

Modal.setAppElement("#root");

export default function UpdateTemplateModal({ template, onClose, onSuccess }) {
  const { getAuthHeader } = useAuth();
  const [formData, setFormData] = useState({
    maxDoctors: template.maxDoctors || 0,
    maxStaffs: template.maxStaffs || 0
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    if (numValue < 0) {
      toast.warning("Số lượng không thể âm!");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const validateForm = () => {
    if (formData.maxDoctors < 1 && formData.maxStaffs < 1) {
      toast.error("Phải có ít nhất 1 bác sĩ hoặc 1 nhân viên!");
      return false;
    }
    
    if (formData.maxDoctors > 50 || formData.maxStaffs > 100) {
      toast.error("Số lượng vượt quá giới hạn cho phép!");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/api/schedule-template?id=${template.id}`,
        {
          dayOfWeek: template.dayOfWeek,
          shiftId: template.shiftId,
          maxDoctors: formData.maxDoctors,
          maxStaffs: formData.maxStaffs,
        },
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Cập nhật mẫu lịch thành công!");
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Cập nhật mẫu lịch thất bại!";
      toast.error(errorMessage);
      console.error("Lỗi cập nhật:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="utm-modal"
      overlayClassName="utm-overlay"
      closeTimeoutMS={200}
    >
      <div className="utm-header">
        <h2 className="utm-title">Cập nhật mẫu lịch làm việc</h2>
        <button 
          className="utm-close-btn" 
          onClick={onClose}
          type="button"
          aria-label="Đóng modal"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="utm-form">
        {/* Thông tin không thể chỉnh sửa */}
        <div className="utm-info-section">
          <h3 className="utm-section-title">Thông tin ca trực</h3>
          
          <div className="utm-info-group">
            <div className="utm-info-item">
              <label className="utm-info-label">Ca trực:</label>
              <div className="utm-info-value">{template.shiftTime}</div>
            </div>
            
            <div className="utm-info-item">
              <label className="utm-info-label">Thứ:</label>
              <div className="utm-info-value utm-day-badge">{template.dayOfWeek}</div>
            </div>
          </div>
        </div>

        {/* Form chỉnh sửa */}
        <div className="utm-edit-section">
          <h3 className="utm-section-title">Điều chỉnh nhân sự</h3>
          
          <div className="utm-form-row">
            <div className="utm-form-group">
              <label htmlFor="maxDoctors" className="utm-label">
                Số bác sĩ <span className="utm-required">*</span>
              </label>
              <input
                id="maxDoctors"
                name="maxDoctors"
                type="number"
                min="0"
                max="50"
                value={formData.maxDoctors}
                onChange={handleInputChange}
                className="utm-input utm-input-number"
                required
              />
              <span className="utm-input-hint">Tối đa 50 bác sĩ</span>
            </div>

            <div className="utm-form-group">
              <label htmlFor="maxStaffs" className="utm-label">
                Số nhân viên <span className="utm-required">*</span>
              </label>
              <input
                id="maxStaffs"
                name="maxStaffs"
                type="number"
                min="0"
                max="100"
                value={formData.maxStaffs}
                onChange={handleInputChange}
                className="utm-input utm-input-number"
                required
              />
              <span className="utm-input-hint">Tối đa 100 nhân viên</span>
            </div>
          </div>
        </div>

        <div className="utm-summary">
          <div className="utm-summary-content">
            <strong>Tổng nhân sự:</strong> {formData.maxDoctors + formData.maxStaffs} người
            <span className="utm-summary-breakdown">
              ({formData.maxDoctors} bác sĩ + {formData.maxStaffs} nhân viên)
            </span>
          </div>
        </div>

        <div className="utm-buttons">
          <button 
            type="submit" 
            disabled={loading}
            className="utm-btn utm-btn-primary"
          >
            {loading ? (
              <>
                <span className="utm-spinner"></span>
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật"
            )}
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="utm-btn utm-btn-secondary"
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
}