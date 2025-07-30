//chưa xong cái hàm xóa
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminCreateAccModal from "./AdminCreateAccModal";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "../../styles/account-management/AdminManageAcc.css";
import { GET_ALL_ACCOUNT } from "../../api/apiUrls";

const ROLE_MAP = {
  ROLE_GUEST: "Khách",
  ROLE_USER: "Người dùng",
  ROLE_STAFF: "Nhân viên",
  ROLE_ADMIN: "Quản trị viên",
  ROLE_MANAGER: "Quản lý",
  ROLE_DOCTOR: "Bác sĩ",
};

const STATUS_MAP = {
  ENABLED: "Hoạt động",
  DISABLED: "Vô hiệu hóa",
  LOCKED: "Bị khóa",
  DELETED: "Đã xóa",
};

export default function AdminManageAcc() {
  const [accountList, setAccountList] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { getAuthHeader } = useAuth();

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(GET_ALL_ACCOUNT, {
        headers: getAuthHeader(),
      });
      setAccountList(response.data.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách tài khoản");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Bạn có chắc muốn xóa tài khoản này?");
      if (!confirmed) return;

      await axios.patch(`http://localhost:8080/api/accounts/manage/delete?id=${id}`, null, {
        headers: getAuthHeader(),
      });
      toast.success("Xóa tài khoản thành công");
      fetchAccounts();
    } catch (err) {
      toast.error("Xóa tài khoản thất bại");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="admin-manage-acc-container">
      <h2 className="admin-manage-acc-title">QUẢN LÝ TÀI KHOẢN</h2>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="admin-manage-acc-btn-create"
      >
        Tạo tài khoản mới
      </button>

      <table className="admin-manage-acc-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accountList.map((acc) => (
            <tr key={acc.id}>
              <td>{acc.id}</td>
              <td>{acc.fullName}</td>
              <td>{acc.email}</td>
              <td>{ROLE_MAP[acc.role] || acc.role}</td>
              <td>{STATUS_MAP[acc.status] || acc.status}</td>
              <td>
                <button
                  className="admin-manage-acc-btn-delete"
                  onClick={() => handleDelete(acc.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isCreateModalOpen && (
        <AdminCreateAccModal
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  onCreated={fetchAccounts}
/>

      )}
    </div>
  );
}
