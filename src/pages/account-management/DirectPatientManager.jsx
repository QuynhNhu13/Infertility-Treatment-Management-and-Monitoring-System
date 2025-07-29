import React, { useEffect, useState } from "react";
import { GET_STAFF_ACC } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import DirectPatientFormModal from "./DirectPatientFormModal";
import "../../styles/account-management/DirectPatientManager.css"

export default function DirectPatientManager() {
  const { getAuthHeader } = useAuth();
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(GET_STAFF_ACC, {
        headers: getAuthHeader(),
      });
      setPatients(res.data.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bệnh nhân:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "ENABLED":
        return "Hoạt động";
      case "DISABLED":
        return "Không hoạt động";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="direct-patient-manager__container p-5">
      <h2 className="direct-patient-manager__title text-xl font-bold mb-4">
        QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
      </h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="direct-patient-manager__create-btn bg-[#077BF6] text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Tạo mới bệnh nhân
      </button>

      <table className="direct-patient-manager__table mt-4 w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Họ tên</th>
            <th className="p-2">Email</th>
            <th className="p-2">SĐT</th>
            <th className="p-2">Giới tính</th>
            <th className="p-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{p.fullName}</td>
              <td className="p-2">{p.email}</td>
              <td className="p-2">{p.phoneNumber}</td>
              <td className="p-2">{p.gender === "MALE" ? "Nam" : "Nữ"}</td>
              <td className="p-2">{getStatusText(p.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <DirectPatientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchPatients();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
