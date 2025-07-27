import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { UPDATE_STAGE_PROGRESS } from "../../api/apiUrls";
import "../../styles/treatment-plan-management/UpdateStageProgressModal.css"; 

Modal.setAppElement("#root");

export default function UpdateStageProgressModal({ isOpen, onClose, stageId, onUpdateSuccess }) {
  const { getAuthHeader } = useAuth();
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.put(
        UPDATE_STAGE_PROGRESS(stageId),
        { notes },
        { headers: getAuthHeader() }
      );
      toast.success("Cập nhật giai đoạn thành công");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật tiến trình:", error);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="stage-progress-modal-content"
      overlayClassName="stage-progress-modal-overlay"
    >
      <h2 className="stage-progress-modal-title">Cập nhật giai đoạn điều trị</h2>
      <textarea
        className="stage-progress-modal-textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Nhập ghi chú"
        rows={5}
      />
      <div className="stage-progress-modal-actions">
        <button onClick={onClose} className="stage-progress-btn-cancel">Hủy</button>
        <button onClick={handleSubmit} className="stage-progress-btn-save">Lưu</button>
      </div>
    </Modal>
  );
}
