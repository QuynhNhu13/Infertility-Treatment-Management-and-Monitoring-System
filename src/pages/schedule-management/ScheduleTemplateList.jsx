import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_ALL_SCHEDULE_TEMPLATE } from "../../api/apiUrls";
import ScheduleTemplateFormModal from "./ScheduleTemplateFormModal";
import CreateSchedule from "./CreateSchedule"; 
import "../../styles/schedule-management/ScheduleTemplateList.css";

export default function ScheduleTemplateList() {
  const { getAuthHeader } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [groupedTemplates, setGroupedTemplates] = useState({});
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);
  const [selectedDayGroup, setSelectedDayGroup] = useState(null);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(GET_ALL_SCHEDULE_TEMPLATE, {
        method: "GET",
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (res.ok) {
        setTemplates(data.data || []);
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
      <h2 className="stl-title">QUẢN LÝ MẪU LÀM VIỆC</h2>

      <button
        className="stl-add-button"
        onClick={() => {
          setSelectedDayGroup(null);
          setShowTemplateModal(true);
        }}
      >
        + Thêm mẫu mới
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
                    <td className="stl-action-cell">
                      <button
                        className="stl-edit-button"
                        onClick={() => {
                          setSelectedDayGroup(shift);
                          setShowTemplateModal(true);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="stl-generate-button"
                        onClick={() => {
                          setShowCreateScheduleModal(true);
                        }}
                      >
                        Tạo lịch làm việc
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {showTemplateModal && (
        <ScheduleTemplateFormModal
          initialData={selectedDayGroup}
          mode={selectedDayGroup ? "edit" : "create"}
          onClose={() => {
            setShowTemplateModal(false);
            fetchTemplates();
          }}
          onSuccess={() => {
            setShowTemplateModal(false);
            fetchTemplates();
          }}
        />
      )}

      {showCreateScheduleModal && (
        <CreateSchedule
          onClose={() => setShowCreateScheduleModal(false)}
          onSuccess={() => {
            setShowCreateScheduleModal(false);
          }}
        />
      )}
    </div>
  );
}
