import React from "react";
import Modal from "react-modal";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "../../styles/appointment-management/UpdateAppointmentStatusModal.css";

Modal.setAppElement("#root");

export default function UpdateAppointmentStatusModal({
  isOpen,
  onClose,
  appointmentId,
  onSuccess,
}) {
  const { getAuthHeader } = useAuth();

  const handleUpdateStatus = async () => {
    try {
      const headers = {
        ...getAuthHeader(),
      };

      const url = `http://localhost:8080/api/appointments/update-status?id=${appointmentId}`;

      const response = await axios.put(url, {}, { headers });

      if (response.status === 200) {
        toast.success("Cập nhật trạng thái cuộc hẹn thành công");
        onSuccess();
        onClose();
      } else {
        toast.error("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Cập nhật trạng thái cuộc hẹn"
      className="update-appointment-status-modal__modal"
      overlayClassName="update-appointment-status-modal__overlay"
    >
      <h2 className="update-appointment-status-modal__title">
        Xác nhận cập nhật trạng thái
      </h2>
      <p className="update-appointment-status-modal__text">
        Bạn có chắc muốn cập nhật trạng thái cuộc hẹn ID:{" "}
        <strong>{appointmentId}</strong> thành <strong>Đã đến</strong>?
      </p>
      <div className="update-appointment-status-modal__buttons">
        <button
          className="update-appointment-status-modal__confirm-button"
          onClick={handleUpdateStatus}
        >
          Xác nhận
        </button>
        <button
          className="update-appointment-status-modal__cancel-button"
          onClick={onClose}
        >
          Hủy
        </button>
      </div>
    </Modal>
  );
}
