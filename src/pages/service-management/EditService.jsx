import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';
import { UP_IMG, EDIT_SERVICE } from '../../api/apiUrls';
import "../../styles/service-management/CreateService.css";

const statusOptions = [
  { value: 'AVAILABLE', label: 'Đang hoạt động' },
  { value: 'UNAVAILABLE', label: 'Tạm ngừng hoạt động' },
  { value: 'DEPRECATED', label: 'Ngừng cung cấp' },
  { value: 'COMING_SOON', label: 'Sắp triển khai' }
];

const EditService = ({ serviceData, onClose, onUpdate }) => {
  const { getAuthHeader, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    serviceName: '',
    subTitle: '',
    price: '',
    summary: '',
    status: 'AVAILABLE',
    imgFile: null,
    imgFileName: '',
    imgUrl: ''
  });

  useEffect(() => {
    if (serviceData) {
      setFormData({
        serviceName: serviceData.serviceName || '',
        subTitle: serviceData.subTitle || '',
        price: serviceData.price?.toString() || '',
        summary: serviceData.summary || '',
        status: serviceData.status || 'AVAILABLE',
        imgFile: null,
        imgFileName: '',
        imgUrl: serviceData.imgUrl || ''
      });
    }
  }, [serviceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const re = /^[0-9]*\.?[0-9]*$/;
      if (value === '' || re.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      status: selectedOption.value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imgFile: file,
        imgFileName: file.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.serviceName || !formData.price) {
      setError("Vui lòng điền đầy đủ Tên dịch vụ và Giá.");
      setLoading(false);
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError("Giá tiền phải là một số dương hợp lệ.");
      setLoading(false);
      return;
    }

    try {
      let updatedImgUrl = formData.imgUrl;

      if (formData.imgFile) {
        const uploadData = new FormData();
        uploadData.append("image", formData.imgFile);

        const imgRes = await axios.post(UP_IMG, uploadData, {
          headers: {
            Authorization: getAuthHeader().Authorization
          }
        });

        updatedImgUrl = imgRes.data.data;
      }

      const payload = {
        serviceName: formData.serviceName,
        subTitle: formData.subTitle,
        price: parseFloat(formData.price),
        summary: formData.summary,
        status: formData.status,
        imgUrl: updatedImgUrl,
        managerAccount: {
          fullName: user.fullName,
          email: user.email
        }
      };

      const res = await axios.put(
        EDIT_SERVICE(serviceData.id),
        payload,
        { headers: getAuthHeader() }
      );

      if (res.status === 200) {
        setSuccess(true);
        if (onUpdate) onUpdate();
        setTimeout(() => onClose(), 3000);
      } else {
        setError("Cập nhật dịch vụ thất bại.");
      }

    } catch (err) {
      console.error("Lỗi khi cập nhật dịch vụ:", err);
      setError("Lỗi kết nối hoặc dữ liệu không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-container">
      <h2>CẬP NHẬT DỊCH VỤ</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên dịch vụ <span className="required">*</span></label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tiêu đề phụ</label>
          <input
            type="text"
            name="subTitle"
            value={formData.subTitle}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Giá tiền <span className="required">*</span></label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tóm tắt</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Trạng thái</label>
          <Select
            options={statusOptions}
            value={statusOptions.find(opt => opt.value === formData.status)}
            onChange={handleStatusChange}
            className="react-select-container"
            classNamePrefix="react-select"
            isSearchable={false}
          />
        </div>

        <div className="form-group">
  <label>Ảnh dịch vụ</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleImageSelect}
  />
  {formData.imgFileName && (
    <p style={{ fontStyle: "italic", marginTop: "6px" }}>
      Đã chọn: {formData.imgFileName}
    </p>
  )}
  {!formData.imgFile && formData.imgUrl && (
    <div style={{ marginTop: "10px" }}>
      <p style={{ fontStyle: "italic" }}>Ảnh hiện tại:</p>
      <img
        src={formData.imgUrl}
        alt="Ảnh hiện tại"
        style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "6px", border: "1px solid #ccc" }}
      />
    </div>
  )}
</div>

        <button type="submit" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>

        {success ? (
          <p className="success-message-cs">Cập nhật dịch vụ thành công!</p>
        ) : error && (
          <p className="error-message-cs">{error}</p>
        )}
      </form>
    </div>
  );
};

export default EditService;
