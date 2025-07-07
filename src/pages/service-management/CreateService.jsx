import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';
import { CREATE_SERVICE, UP_IMG } from '../../api/apiUrls';
import "../../styles/service-management/CreateService.css";

const statusOptions = [
  { value: 'AVAILABLE', label: 'Đang hoạt động' },
  { value: 'UNAVAILABLE', label: 'Tạm ngừng hoạt động' },
  { value: 'DEPRECATED', label: 'Ngừng cung cấp' },
  { value: 'COMING_SOON', label: 'Sắp triển khai' }
];

const CreateService = ({ onClose }) => {
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
    imgFileName: ''
  });

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

    if (!formData.serviceName || !formData.price || !formData.imgFile) {
      setError("Vui lòng điền đầy đủ Tên phương pháp, Giá và Tải ảnh lên!");
      setLoading(false);
      return;
    }

    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError("Giá tiền phải là một số dương hợp lệ.");
      setLoading(false);
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("image", formData.imgFile);

      const imgRes = await axios.post(UP_IMG, uploadData, {
        headers: {
          Authorization: getAuthHeader().Authorization
        }
      });

      const imgUrl = imgRes.data.data;

      const servicePayload = {
        serviceName: formData.serviceName,
        subTitle: formData.subTitle,
        price: parseFloat(formData.price),
        summary: formData.summary,
        status: formData.status,
        imgUrl,
        managerAccount: {
          fullName: user.fullName,
          email: user.email
        }
      };

      const res = await axios.post(CREATE_SERVICE, servicePayload, {
        headers: getAuthHeader()
      });

      if (res.status === 201 || res.data.statusCode === 201) {
        setSuccess(true);
        setFormData({
          serviceName: '',
          subTitle: '',
          price: '',
          summary: '',
          status: 'AVAILABLE',
          imgFile: null,
          imgFileName: ''
        });

        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError("Tạo mới phương pháp thất bại.");
      }

    } catch (err) {
      console.error("Lỗi khi tạo phương pháp:", err);
      setError("Lỗi kết nối hoặc dữ liệu không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-container">
      <h2>TẠO PHƯƠNG PHÁP MỚI</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên phương pháp <span className="required">*</span></label>
          <input
            type="text"
            name="serviceName"
            placeholder="Nhập tên phương pháp"
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
            placeholder="Nhập tiêu đề phụ"
            value={formData.subTitle}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Giá tiền <span className="required">*</span></label>
          <input
            type="text"
            name="price"
            placeholder="Nhập giá tiền"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tóm tắt</label>
          <textarea
            name="summary"
            placeholder="Nhập tóm tắt"
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
          <label>Chọn ảnh phương pháp <span className="required">*</span></label>
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
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo mới"}
        </button>

        {success ? (
          <p className="success-message-cs">Tạo mới phương pháp thành công!</p>
        ) : error && (
          <p className="error-message-cs">{error}</p>
        )}
      </form>
    </div>
  );
};

export default CreateService;
