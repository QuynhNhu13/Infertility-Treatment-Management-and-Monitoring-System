import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/account-management/ModalChangePassword.css";
import { CHANGE_PASSWORD } from "../../api/apiUrls";

export default function ModalChangePassword({ isOpen, onClose }) {
  const { getAuthHeader } = useAuth();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Reset form mỗi khi modal mở lại
  useEffect(() => {
    if (isOpen) {
      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    try {
      await axios.post(CHANGE_PASSWORD, form, {
        headers: getAuthHeader(),
      });
      toast.success("Đổi mật khẩu thành công");
      onClose(); // đóng modal
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" }); // reset form
    } catch (err) {
      toast.error("Đổi mật khẩu thất bại");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-change-password__container"
      overlayClassName="modal-change-password__overlay"
    >
      <h2 className="modal-change-password__title">Đổi mật khẩu</h2>
      <input
        className="modal-change-password__input"
        type="password"
        name="oldPassword"
        placeholder="Mật khẩu hiện tại"
        value={form.oldPassword}
        onChange={handleChange}
      />
      <input
        className="modal-change-password__input"
        type="password"
        name="newPassword"
        placeholder="Mật khẩu mới"
        value={form.newPassword}
        onChange={handleChange}
      />
      <input
        className="modal-change-password__input"
        type="password"
        name="confirmPassword"
        placeholder="Xác nhận mật khẩu mới"
        value={form.confirmPassword}
        onChange={handleChange}
      />
      <div className="modal-change-password__actions">
        <button
          className="modal-change-password__button modal-change-password__button--confirm"
          onClick={handleSubmit}
        >
          Đổi mật khẩu
        </button>
        <button
          className="modal-change-password__button modal-change-password__button--cancel"
          onClick={onClose}
        >
          Huỷ
        </button>
      </div>
    </Modal>
  );
}
