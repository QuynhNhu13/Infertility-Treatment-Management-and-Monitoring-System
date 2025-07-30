import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_ALL_SCHEDULE_TEMPLATE } from "../../api/apiUrls";
import "../../styles/schedule-management/ScheduleTemplateList.css";
import UpdateTemplateModal from "./UpdateTemplateModal";
import CreateScheduleModal from "./CreateScheduleModal"; // ✅ import modal mới

export default function ScheduleTemplateList() {
  const { getAuthHeader } = useAuth();
  const [groupedTemplates, setGroupedTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false); // ✅ modal toggle

  const fetchTemplates = async () => {
    try {
      const res = await fetch(GET_ALL_SCHEDULE_TEMPLATE, {
        method: "GET",
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (res.ok) {
        groupByDay(data.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách mẫu lịch làm việc:", error);
    }
  };

  const groupByDay = (data) => {
    const grouped = data.reduce((acc, item) => {
      const day = item.dayOfWeek;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});
    setGroupedTemplates(grouped);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="stl-container">
      <h2 className="stl-title">DANH SÁCH MẪU LỊCH</h2>

      <button
        className="stl-add-button"
        onClick={() => setShowCreateModal(true)}
      >
        + Tạo lịch làm việc theo mẫu
      </button>

      {Object.entries(groupedTemplates).length === 0 ? (
        <p className="stl-empty">Chưa có mẫu lịch nào.</p>
      ) : (
        Object.entries(groupedTemplates).map(([day, shifts]) => (
          <div key={day} className="stl-day-group">
            <h3>{day}</h3>
            <table className="stl-table">
              <thead>
                <tr>
                  <th>Thời gian ca</th>
                  <th>Số bác sĩ</th>
                  <th>Số nhân viên</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td>{shift.shiftTime}</td>
                    <td>{shift.maxDoctors}</td>
                    <td>{shift.maxStaffs}</td>
                    <td>
                      <button
                        className="stl-edit-button"
                        onClick={() => setSelectedTemplate(shift)}
                      >
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {selectedTemplate && (
        <UpdateTemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onSuccess={() => {
            setSelectedTemplate(null);
            fetchTemplates();
          }}
        />
      )}

      {showCreateModal && (
        <CreateScheduleModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
