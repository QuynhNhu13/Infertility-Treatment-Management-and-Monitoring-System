import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; 
import { SCHEDULE_TEMPLATE_FORM } from '../../api/apiUrls';


const ScheduleTemplateForm = () => {
  const { getJsonAuthHeader } = useAuth(); 

  const [formData, setFormData] = useState({
    accountId: "",
    shiftId: "",
    dayOfWeek: "MONDAY",
    roomNumber: "",
    maxCapacity: 0,
  });

  const [message, setMessage] = useState(null);

  const dayOptions = [
    "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxCapacity" ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = getJsonAuthHeader(); 
      const res = await axios.post(
        SCHEDULE_TEMPLATE_FORM,
        formData,
        { headers }
      );
      setMessage(res.data.message || "Tạo mẫu lịch thành công!");
      setFormData({
        accountId: "",
        shiftId: "",
        dayOfWeek: "MONDAY",
        roomNumber: "",
        maxCapacity: 0
      });
    } catch (error) {
      const msg = error?.response?.data?.message || "Lỗi khi tạo mẫu lịch";
      setMessage(msg);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Tạo mẫu lịch làm việc</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Account ID</label>
          <input
            type="number"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Shift ID</label>
          <input
            type="number"
            name="shiftId"
            value={formData.shiftId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Thứ trong tuần</label>
          <select
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {dayOptions.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Số phòng</label>
          <input
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Sức chứa tối đa</label>
          <input
            type="number"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Tạo mẫu lịch
        </button>

        {message && (
          <p className="text-sm text-center mt-2 text-green-700 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ScheduleTemplateForm;
