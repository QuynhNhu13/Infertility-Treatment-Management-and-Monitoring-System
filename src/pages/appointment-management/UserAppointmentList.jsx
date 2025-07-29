import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/appointment-management/UserAppointmentList.css";
import { USER_GET_APPOINTMENT } from "../../api/apiUrls";

export default function UserAppointmentList() {
  const { getAuthHeader } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(USER_GET_APPOINTMENT, {
        headers: getAuthHeader(),
      });
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử cuộc hẹn:", error);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  const formatTime = (time) => time?.slice(0, 5);

  const translateStatus = (status) => {
    switch (status) {
      case "UNPAID":
        return "Chưa thanh toán";
      case "NOT_PAID":
        return "Đã hủy thanh toán";
      case "UNCHECKED_IN":
        return "Chưa check-in";
      case "CHECKED_IN":
        return "Đã check-in";
      case "CANCELLED":
        return "Đã hủy cuộc hẹn";
      default:
        return "Không xác định";
    }
  };

  return (
    <div className="user-appointment-list-container">
      <h2>Lịch sử cuộc hẹn của bạn</h2>
      {appointments.length === 0 ? (
        <p>Không có cuộc hẹn nào.</p>
      ) : (
        <table className="user-appointment-list-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Thời gian</th>
              <th>Bác sĩ</th>
              <th>Tên bệnh nhân</th>
              <th>SĐT</th>
              <th>Ghi chú</th>
              <th>Tin nhắn</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td data-label="Ngày">{formatDate(appt.time)}</td>
                <td data-label="Thời gian">
                  {formatTime(appt.startTime)} - {formatTime(appt.endTime)}
                </td>
                <td data-label="Bác sĩ">{appt.doctorName}</td>
                <td data-label="Tên bệnh nhân">{appt.patientName}</td>
                <td data-label="SĐT">{appt.phoneNumber}</td>
                <td data-label="Ghi chú">{appt.note}</td>
                <td data-label="Tin nhắn">{appt.message}</td>
                <td data-label="Trạng thái">{translateStatus(appt.status)}</td>
                <td data-label="Ngày tạo">{formatDate(appt.createAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}