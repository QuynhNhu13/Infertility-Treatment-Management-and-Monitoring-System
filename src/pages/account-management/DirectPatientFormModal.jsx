import React, { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { CREATE_STAFF_ACC } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/account-management/DirectPatientFormModal.css";

Modal.setAppElement("#root");

const genderOptions = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
];

const statusOptions = [
  { value: "ENABLED", label: "Hoạt động" },
  { value: "DISABLED", label: "Vô hiệu hóa" },
];

export default function DirectPatientFormModal({ isOpen, onClose, onSuccess }) {
  const { getAuthHeader } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "MALE",
    status: "ENABLED",
    roles: "ROLE_USER", 
    address: "",
    dob: null,
    identityNumber: "",
    nationality: "",
    insuranceNumber: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selected, { name }) => {
    setForm({ ...form, [name]: selected.value });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, dob: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        dob: form.dob ? form.dob.toISOString().split("T")[0] : null,
      };

      await axios.post(CREATE_STAFF_ACC, payload, {
        headers: getAuthHeader(),
      });

      toast.success("Tạo tài khoản thành công!");
      onSuccess();
    } catch (err) {
      toast.error("Tạo tài khoản thất bại!");
      console.error(err);
    }
  };

  const label = (text, isRequired = false) => (
    <label className="direct-patient-form__label">
      {text}
      {isRequired && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Tạo bệnh nhân trực tiếp"
      className="direct-patient-form__modal"
      overlayClassName="direct-patient-form__overlay"
    >
      <h2 className="direct-patient-form__title">Tạo tài khoản bệnh nhân</h2>

      <form onSubmit={handleSubmit} className="direct-patient-form__form">
        <div>
          {label("Họ tên", true)}
          <input
            name="fullName"
            placeholder="Họ tên"
            required
            onChange={handleChange}
            className="direct-patient-form__input"
          />
        </div>

        <div>
          {label("Email", true)}
          <input
            name="email"
            placeholder="Email"
            type="email"
            required
            onChange={handleChange}
            className="direct-patient-form__input"
          />
        </div>

        <div>
          {label("Mật khẩu", true)}
          <input
            name="password"
            placeholder="Mật khẩu (ít nhất 8 ký tự)"
            type="password"
            minLength={8}
            required
            onChange={handleChange}
            className="direct-patient-form__input"
          />
        </div>

        <div>
          {label("Số điện thoại", true)}
          <input
            name="phoneNumber"
            placeholder="SĐT (VD: 08412345678)"
            required
            onChange={handleChange}
            className="direct-patient-form__input"
          />
        </div>

        <div>
          {label("Giới tính", true)}
          <Select
            name="gender"
            options={genderOptions}
            defaultValue={genderOptions[0]}
            onChange={handleSelectChange}
            classNamePrefix="direct-patient-form__select"
          />
        </div>

        <div>
          {label("Trạng thái tài khoản", true)}
          <Select
            name="status"
            options={statusOptions}
            defaultValue={statusOptions[0]}
            onChange={handleSelectChange}
            classNamePrefix="direct-patient-form__select"
          />
        </div>

        <div>
          {label("Địa chỉ")}
          <input
            name="address"
            placeholder="Địa chỉ"
            onChange={handleChange}
            className="direct-patient-form__input"
          />
        </div>

        <div>
          {label("Ngày sinh")}
          <DatePicker
            selected={form.dob}
            onChange={handleDateChange}
            placeholderText="Chọn ngày sinh"
            className="direct-patient-form__input"
            dateFormat="yyyy-MM-dd"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        <div>
          {label("CMND/CCCD")}
          <input
            name="identityNumber"
            placeholder="CMND/CCCD"
            pattern="\d{9,15}"
            onChange={handleChange}
            className="direct-patient-form__input"
          />
        </div>

        <div>
          {label("Quốc tịch")}
          <input
            name="nationality"
            placeholder="Quốc tịch"
            onChange={handleChange}
            className="direct-patient-form__input"
          />
        </div>

        <div>
          {label("Số BHYT")}
          <input
            name="insuranceNumber"
            placeholder="Số bảo hiểm y tế"
            pattern="\d{0,20}"
            onChange={handleChange}
            className="direct-patient-form__input"
          />
        </div>

        <div className="direct-patient-form__footer">
          <button
            type="button"
            onClick={onClose}
            className="direct-patient-form__cancel-btn"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="direct-patient-form__submit-btn"
          >
            Tạo
          </button>
        </div>
      </form>
    </Modal>
  );
}
