import React, { useEffect, useState } from "react";
import axios from "axios";
import { PROFILE, UPDATE_PROFILE } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "../../styles/account-management/UserProfileForm.css";

export default function UserProfileForm() {
  const { getAuthHeader } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "MALE",
    identityNumber: "",
    nationality: "",
    insuranceNumber: "",
    address: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await axios.get(PROFILE, {
        headers: getAuthHeader(),
      });
      if (res.data && res.data.data) {
        const data = res.data.data;
        setProfile({
          userName: data.userName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          dateOfBirth: data.dateOfBirth || data.dob || "",
          gender: data.gender || "MALE",
          identityNumber: data.identityNumber || "",
          nationality: data.nationality || "",
          insuranceNumber: data.insuranceNumber || "",
          address: data.address || "",
        });
      }
    } catch (error) {
      toast.error("Không thể tải thông tin người dùng");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userName: profile.userName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      dob: profile.dateOfBirth,
      gender: profile.gender,
      identityNumber: profile.identityNumber,
      nationality: profile.nationality,
      insuranceNumber: profile.insuranceNumber,
      address: profile.address,
    };

    try {
      const res = await axios.put(UPDATE_PROFILE, payload, {
        headers: getAuthHeader(),
      });
      if (res.data.statusCode === 200) {
        toast.success("Cập nhật thành công!");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const renderField = (label, name, type = "text") => (
    <div className="user-profile-form__row">
      <label>{label}</label>
      {isEditing ? (
        type === "select" ? (
          <select name={name} value={profile[name]} onChange={handleChange}>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={profile[name]}
            onChange={handleChange}
          />
        )
      ) : (
        <p className="user-profile-form__value">{profile[name] || "-"}</p>
      )}
    </div>
  );

  return (
    <form className="user-profile-form" onSubmit={handleSubmit}>
      <h2>Thông tin cá nhân</h2>

      {renderField("Họ và tên:", "userName")}
      {renderField("Email:", "email", "email")}
      {renderField("Số điện thoại:", "phoneNumber")}
      {renderField("Ngày sinh:", "dateOfBirth", "date")}
      {renderField("Giới tính:", "gender", "select")}
      {renderField("Số CCCD:", "identityNumber")}
      {renderField("Quốc tịch:", "nationality")}
      {renderField("Số BHYT:", "insuranceNumber")}
      {renderField("Địa chỉ:", "address")}

      <div className="user-profile-form__actions">
        {isEditing ? (
          <>
            <button type="submit" className="user-profile-form__button">
              Lưu
            </button>
            <button
              type="button"
              className="user-profile-form__button user-profile-form__button--cancel"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>
          </>
        ) : (
          <button
            type="button"
            className="user-profile-form__button"
            onClick={() => setIsEditing(true)}
          >
            Cập nhật
          </button>
        )}
      </div>
    </form>
  );
}
