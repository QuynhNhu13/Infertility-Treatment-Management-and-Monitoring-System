import React, { useEffect, useState } from "react";
import { PROFILE } from "../../api/apiUrls";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import ModalProfileUpdate from "./ModalProfileUpdate";
import ModalChangePassword from "./ModalChangePassword";
import "../../styles/account-management/ProfileView.css";

export default function ProfileView() {
  const { getAuthHeader } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isChangePwModalOpen, setIsChangePwModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(PROFILE, { headers: getAuthHeader() });
      setProfile(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin hồ sơ:", err);
    }
  };

  return (
    <div className="profile-view">
      <h2>THÔNG TIN CÁ NHÂN</h2>
      {profile ? (
        <div className="profile-view__info">
          <p><strong>Họ tên:</strong> {profile.userName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Số điện thoại:</strong> {profile.phoneNumber}</p>
          <p><strong>Giới tính:</strong> {profile.gender === "MALE" ? "Nam" : "Nữ"}</p>
          <p><strong>Ngày sinh:</strong> {profile.dateOfBirth}</p>
          <p><strong>Số CCCD:</strong> {profile.identityNumber}</p>
          <p><strong>Quốc tịch:</strong> {profile.nationality}</p>
          <p><strong>Số BHYT:</strong> {profile.insuranceNumber}</p>
          <p><strong>Địa chỉ:</strong> {profile.address}</p>

          <div className="profile-view__actions">
            <button onClick={() => setIsUpdateModalOpen(true)}>
              Cập nhật thông tin
            </button>
            <button onClick={() => setIsChangePwModalOpen(true)}>
              Đổi mật khẩu
            </button>
          </div>
        </div>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}

      <ModalProfileUpdate
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={fetchProfile}
        initialData={profile}
      />

      <ModalChangePassword
        isOpen={isChangePwModalOpen}
        onClose={() => setIsChangePwModalOpen(false)}
      />
    </div>
  );
}
