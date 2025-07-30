import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Select from "react-select";
import { UPDATE_PROFILE } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/account-management/ModalProfileUpdate.css";

const genderOptions = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
];

export default function ModalProfileUpdate({ isOpen, onClose, initialData, onSuccess }) {
  const { getAuthHeader } = useAuth();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    gender: null,
    identityNumber: "",
    nationality: "",
    insuranceNumber: "",
    address: "",
  });
useEffect(() => {
  if (initialData) {
    setForm({
      userName: initialData.userName || "",
      email: initialData.email || "",
      phoneNumber: initialData.phoneNumber || "",
      dob: initialData.dob || initialData.dateOfBirth || "",
      gender: genderOptions.find(opt => opt.value === initialData.gender) || null,
      identityNumber: initialData.identityNumber || "",
      nationality: initialData.nationality || "",
      insuranceNumber: initialData.insuranceNumber || "",
      address: initialData.address || "",
    });
  }
}, [initialData]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (selectedOption) => {
    setForm({ ...form, gender: selectedOption });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        gender: form.gender ? form.gender.value : "",
      };
      await axios.put(UPDATE_PROFILE, payload, { headers: getAuthHeader() });
      toast.success("Cập nhật hồ sơ thành công");
      onClose();
      onSuccess();
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal-profile-update__modal">
      <h2 className="modal-profile-update__title">Cập nhật hồ sơ</h2>
      <div className="modal-profile-update__form">
        <input
          name="userName"
          value={form.userName}
          onChange={handleChange}
          placeholder="Họ tên"
          className="modal-profile-update__input"
        />
        <input
          name="email"
          value={form.email}
          disabled
          placeholder="Email"
          className="modal-profile-update__input"
        />
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Số điện thoại"
          className="modal-profile-update__input"
        />
        <input
          name="dob"
          value={form.dob}
          onChange={handleChange}
          placeholder="Ngày sinh (yyyy-mm-dd)"
          className="modal-profile-update__input"
        />
        <Select
          value={form.gender}
          onChange={handleGenderChange}
          options={genderOptions}
          placeholder="Chọn giới tính"
          className="modal-profile-update__input"
        />
        <input
          name="identityNumber"
          value={form.identityNumber}
          onChange={handleChange}
          placeholder="CCCD"
          className="modal-profile-update__input"
        />
        <input
          name="nationality"
          value={form.nationality}
          onChange={handleChange}
          placeholder="Quốc tịch"
          className="modal-profile-update__input"
        />
        <input
          name="insuranceNumber"
          value={form.insuranceNumber}
          onChange={handleChange}
          placeholder="BHYT"
          className="modal-profile-update__input"
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Địa chỉ"
          className="modal-profile-update__input"
        />
      </div>
      <div className="modal-profile-update__actions">
        <button onClick={handleSubmit} className="modal-profile-update__button modal-profile-update__button--save">
          Lưu
        </button>
        <button onClick={onClose} className="modal-profile-update__button modal-profile-update__button--cancel">
          Huỷ
        </button>
      </div>
    </Modal>
  );
}
