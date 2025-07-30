// CreateScheduleModal.jsx
import React, { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/schedule-management/CreateScheduleModal.css";

Modal.setAppElement("#root");

export default function CreateScheduleModal({ onClose, onSuccess }) {
  const { getAuthHeader } = useAuth();
  const [formData, setFormData] = useState({
    startDate: "2025-07-01",
    endDate: "2025-07-31"
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDates = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (start >= end) {
      toast.error("Ngày bắt đầu phải nhỏ hơn ngày kết thúc!");
      return false;
    }
    
    if (start < new Date()) {
      toast.error("Ngày bắt đầu không thể là ngày trong quá khứ!");
      return false;
    }
    
    return true;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!validateDates()) return;
    
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8080/api/schedules",
        formData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Tạo lịch làm việc thành công!");
      onSuccess();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Tạo lịch làm việc thất bại!";
      toast.error(errorMessage);
      console.error("Lỗi tạo lịch:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="csm-modal"
      overlayClassName="csm-overlay"
      closeTimeoutMS={200}
    >
      <div className="csm-header">
        <h2 className="csm-title">Tạo lịch làm việc theo mẫu</h2>
        <button 
          className="csm-close-btn" 
          onClick={onClose}
          type="button"
          aria-label="Đóng modal"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleCreate} className="csm-form">
        <div className="csm-form-group">
          <label htmlFor="startDate" className="csm-label">
            Từ ngày <span className="csm-required">*</span>
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            className="csm-input"
            required
          />
        </div>

        <div className="csm-form-group">
          <label htmlFor="endDate" className="csm-label">
            Đến ngày <span className="csm-required">*</span>
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            className="csm-input"
            required
          />
        </div>

        <div className="csm-info">
          <p>💡 Lịch làm việc sẽ được tạo dựa trên các mẫu lịch đã có.</p>
        </div>

        <div className="csm-buttons">
          <button 
            type="submit" 
            disabled={loading}
            className="csm-btn csm-btn-primary"
          >
            {loading ? (
              <>
                <span className="csm-spinner"></span>
                Đang tạo...
              </>
            ) : (
              "Tạo lịch"
            )}
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="csm-btn csm-btn-secondary"
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
}