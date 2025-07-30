import React, { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/account-management/AdminCreateAccModal.css";
import { ADMIN_CREATE_ACC } from "../../api/apiUrls";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UploadImg from "../../components/UploadImg";

Modal.setAppElement("#root");

export default function AdminCreateAccModal({ onClose }) {
  const { getAuthHeader } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "FEMALE",
    status: "ENABLED",
    role: "ROLE_DOCTOR",
    dateOfBirth: null,
    startDate: null,
    expertise: "",
    position: "",
    description: "",
    slug: "",
    imgUrl: ""
  });

  const genderOptions = [
    { value: "FEMALE", label: "Nữ" },
    { value: "MALE", label: "Nam" },
    { value: "OTHER", label: "Khác" },
  ];

  const statusOptions = [
    { value: "ENABLED", label: "Hoạt động" },
    { value: "DISABLED", label: "Bị khóa" },
  ];

  const roleOptions = [
    { value: "ROLE_DOCTOR", label: "Bác sĩ" },
    { value: "ROLE_STAFF", label: "Nhân viên" },
    { value: "ROLE_MANAGER", label: "Quản lý" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      status: formData.status,
      roles: formData.role,
      dateOfBirth: formData.dateOfBirth
        ? formData.dateOfBirth.toISOString().split("T")[0]
        : null,
      ...(formData.role === "ROLE_DOCTOR" && {
        expertise: formData.expertise,
        position: formData.position,
        description: formData.description,
        slug: formData.slug,
        imgUrl: formData.imgUrl,
      }),
      ...(formData.role === "ROLE_STAFF" && formData.startDate && {
        startDate: formData.startDate.toISOString().split("T")[0],
      }),
    };

    try {
      await axios.post(ADMIN_CREATE_ACC, payload, {
        headers: getAuthHeader(),
      });
      toast.success("Tạo tài khoản thành công!");
      onClose();
    } catch (err) {
      toast.error("Tạo tài khoản thất bại!");
      console.error(err);
    }
  };

  return (
    <Modal isOpen onRequestClose={onClose} className="admin-create-acc-modal__container">
      <h2 className="admin-create-acc-modal__title">Tạo tài khoản mới</h2>
      <form onSubmit={handleSubmit} className="admin-create-acc-modal__form">
        <label className="admin-create-acc-modal__label">Họ tên</label>
        <input
          className="admin-create-acc-modal__input"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />

        <label className="admin-create-acc-modal__label">Email</label>
        <input
          className="admin-create-acc-modal__input"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <label className="admin-create-acc-modal__label">Mật khẩu</label>
        <input
          className="admin-create-acc-modal__input"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <label className="admin-create-acc-modal__label">Số điện thoại</label>
        <input
          className="admin-create-acc-modal__input"
          type="text"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />

        <label className="admin-create-acc-modal__label">Giới tính</label>
        <Select
          className="admin-create-acc-modal__select"
          options={genderOptions}
          value={genderOptions.find((opt) => opt.value === formData.gender)}
          onChange={(selected) => setFormData({ ...formData, gender: selected.value })}
        />

        <label className="admin-create-acc-modal__label">Trạng thái tài khoản</label>
        <Select
          className="admin-create-acc-modal__select"
          options={statusOptions}
          value={statusOptions.find((opt) => opt.value === formData.status)}
          onChange={(selected) => setFormData({ ...formData, status: selected.value })}
        />

        <label className="admin-create-acc-modal__label">Vai trò</label>
        <Select
          className="admin-create-acc-modal__select"
          options={roleOptions}
          value={roleOptions.find((opt) => opt.value === formData.role)}
          onChange={(selected) => setFormData({ ...formData, role: selected.value })}
        />

        <label className="admin-create-acc-modal__label">Ngày sinh</label>
        <DatePicker
          selected={formData.dateOfBirth}
          onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
          dateFormat="dd/MM/yyyy"
          placeholderText="Chọn ngày sinh"
          className="admin-create-acc-modal__datepicker"
        />

        {formData.role === "ROLE_STAFF" && (
          <>
            <label className="admin-create-acc-modal__label">Ngày bắt đầu làm việc</label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              className="admin-create-acc-modal__datepicker"
            />
          </>
        )}

        {formData.role === "ROLE_DOCTOR" && (
          <>
            <label className="admin-create-acc-modal__label">Chuyên môn</label>
            <input
              className="admin-create-acc-modal__input"
              type="text"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              required
            />

            <label className="admin-create-acc-modal__label">Chức vụ</label>
            <input
              className="admin-create-acc-modal__input"
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              required
            />

            <label className="admin-create-acc-modal__label">Mô tả</label>
            <textarea
              className="admin-create-acc-modal__textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <label className="admin-create-acc-modal__label">Định danh</label>
            <input
              className="admin-create-acc-modal__input"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />

            <label className="admin-create-acc-modal__label">Ảnh đại diện</label>
            <UploadImg
              onUploadSuccess={(url) =>
                setFormData({ ...formData, imgUrl: url })
              }
            />

            {formData.imgUrl && (
              <img
                src={formData.imgUrl}
                alt="Xem trước"
                className="admin-create-acc-modal__preview-img"
              />
            )}
          </>
        )}

        <div className="admin-create-acc-modal__actions">
          <button type="submit" className="admin-create-acc-modal__btn admin-create-acc-modal__btn--submit">
            Tạo
          </button>
          <button type="button" onClick={onClose} className="admin-create-acc-modal__btn admin-create-acc-modal__btn--cancel">
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
}
