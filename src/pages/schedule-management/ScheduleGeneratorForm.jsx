import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { SCHEDULE_GENERATOR_FORM } from "../../api/apiUrls"; // ✅ Import đúng endpoint

const ScheduleGeneratorForm = () => {
  const { getJsonAuthHeader } = useAuth();

  const [templateId, setTemplateId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!templateId || !startDate || !endDate) {
      setMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const headers = getJsonAuthHeader();
      const url = SCHEDULE_GENERATOR_FORM(templateId); // ✅ Sử dụng API chuẩn
      const response = await axios.post(
        url,
        { startDate, endDate },
        { headers }
      );
      setMessage(response.data.message || "Tạo lịch thành công!");
      setTemplateId("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      const msg = error?.response?.data?.message || "Lỗi khi tạo lịch làm việc";
      setMessage(msg);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Tạo lịch làm việc từ mẫu</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Mã Template (ID)</label>
          <input
            type="number"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Ngày bắt đầu</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Ngày kết thúc</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Tạo lịch làm việc
        </button>

        {message && (
          <p className="text-sm text-center mt-2 text-green-700 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ScheduleGeneratorForm;
