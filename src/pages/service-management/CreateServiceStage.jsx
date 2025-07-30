import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CREATE_SERVICE_STAGE } from '../../api/apiUrls';
import "../../styles/service-management/CreateService.css";

const CreateServiceStage = ({ serviceId, onClose, onCreated }) => {
  const { getAuthHeader } = useAuth();

  const [stages, setStages] = useState([
    { name: '', description: '', duration: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedStages = [...stages];
    updatedStages[index][field] = value;
    setStages(updatedStages);
  };

  const addStage = () => {
    setStages([...stages, { name: '', description: '', duration: '' }]);
  };

  const removeStage = (index) => {
    const updatedStages = stages.filter((_, i) => i !== index);
    setStages(updatedStages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const isValid = stages.every(stage =>
      stage.name && stage.duration
    );

    if (!isValid) {
      setError("Vui lòng điền đầy đủ thông tin cho tất cả các giai đoạn.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        CREATE_SERVICE_STAGE(serviceId),
        stages,
        { headers: getAuthHeader() }
      );

      if (response.status === 201) {
        setSuccess(true);
        if (onCreated) onCreated();
        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setError("Tạo giai đoạn thất bại.");
      }
    } catch (err) {
      console.error("Lỗi tạo giai đoạn:", err);
      setError("Lỗi kết nối hoặc dữ liệu không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-container">
      <h2>TẠO GIAI ĐOẠN PHƯƠNG PHÁP</h2>

      <form onSubmit={handleSubmit}>
        {stages.map((stage, index) => (
          <div key={index} className="form-group">
            <label>Tên giai đoạn <span className="required">*</span></label>
            <input
              type="text"
              value={stage.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              required
            />

            <label>Mô tả</label>
            <textarea
              value={stage.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
            />

            <label>Thời lượng (ngày) <span className="required">*</span></label>
            <input
              type="number"
              min="1"
              value={stage.duration}
              onChange={(e) => handleChange(index, 'duration', e.target.value)}
              required
            />

            {stages.length > 1 && (
              <button
                type="button"
                onClick={() => removeStage(index)}
                style={{
                  backgroundColor: '#E53935',
                  color: 'white',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  marginTop: '10px',
                  marginBottom: '10px'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C62828'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E53935'}
              >
                Xoá giai đoạn
              </button>

            )}

            <hr />
          </div>
        ))}

        <button
          type="button"
          onClick={addStage}
          style={{
            backgroundColor: '#077BF6',
            color: 'white',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 500,
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            marginBottom: '15px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005fcc'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#077BF6'}
        >
          + Thêm giai đoạn
        </button>


        <button type="submit" disabled={loading} style={{ marginLeft: '10px' }}>
          {loading ? "Đang tạo..." : "Tạo các giai đoạn"}
        </button>

        {success ? (
          <p className="success-message-cs">Tạo giai đoạn thành công!</p>
        ) : error && (
          <p className="error-message-cs">{error}</p>
        )}
      </form>
    </div>
  );
};

export default CreateServiceStage;