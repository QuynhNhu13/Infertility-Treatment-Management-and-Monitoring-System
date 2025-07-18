import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { UP_IMG, CREATE_SERVICE_DETAILS } from '../../api/apiUrls';
import RichTextEditor from '../../components/RichTextEditor';
import '../../styles/service-management/CreateService.css';

const CreateServiceDetails = ({ serviceId, onClose }) => {
  const { getAuthHeader } = useAuth();

  const [formData, setFormData] = useState({
    concept: '',
    conceptImgFile: null,
    conceptImgPreview: '',
    condition: '',
    assignment: '',
    unAssignment: '',
    procedureDetails: '',
    procedureDetailsImgFile: null,
    procedureDetailsImgPreview: '',
    successRate: '',
    experience: '',
    risk: '',
    hospitalProcedure: '',
    hospitalProcedureImgFile: null,
    hospitalProcedureImgPreview: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRichTextChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [field + 'File']: file,
        [field + 'Preview']: previewURL
      }));
    }
  };

  const uploadImage = async (file) => {
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await axios.post(UP_IMG, uploadData, {
        headers: {
          Authorization: getAuthHeader().Authorization,
        },
      });

      return res.data.data;
    } catch (err) {
      console.error('Lỗi upload ảnh:', err);
      throw new Error('Không thể upload ảnh.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const conceptImgUrl = formData.conceptImgFile
        ? await uploadImage(formData.conceptImgFile)
        : '';

      const procedureDetailsImgUrl = formData.procedureDetailsImgFile
        ? await uploadImage(formData.procedureDetailsImgFile)
        : '';

      const hospitalProcedureImgUrl = formData.hospitalProcedureImgFile
        ? await uploadImage(formData.hospitalProcedureImgFile)
        : '';

      const payload = {
        concept: formData.concept,
        conceptImgUrl,
        condition: formData.condition,
        assignment: formData.assignment,
        unAssignment: formData.unAssignment,
        procedureDetails: formData.procedureDetails,
        procedureDetailsImgUrl,
        successRate: formData.successRate,
        experience: formData.experience,
        risk: formData.risk,
        hospitalProcedure: formData.hospitalProcedure,
        hospitalProcedureImgUrl,
      };

      const res = await axios.post(
        CREATE_SERVICE_DETAILS(serviceId),
        payload,
        { headers: getAuthHeader() }
      );

      if (res.status === 201 || res.data.statusCode === 201) {
        setSuccess(true);
        setTimeout(() => onClose(), 2000);
      } else {
        setError('Tạo mới chi tiết phương pháp thất bại.');
      }
    } catch (err) {
      console.error('Lỗi khi tạo chi tiết phương pháp', err);
      setError('Lỗi kết nối hoặc dữ liệu không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-container">
      <h2>TẠO CHI TIẾT PHƯƠNG PHÁP</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Khái niệm</label>
          <RichTextEditor value={formData.concept} onChange={(val) => handleRichTextChange('concept', val)} />
        </div>
        <div className="form-group">
          <label>Ảnh khái niệm</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, 'conceptImg')} />
          {formData.conceptImgPreview && <img src={formData.conceptImgPreview} alt="preview" className="img-preview" />}
        </div>

        <div className="form-group">
          <label>Điều kiện áp dụng</label>
          <RichTextEditor value={formData.condition} onChange={(val) => handleRichTextChange('condition', val)} />
        </div>
        <div className="form-group">
          <label>Nhiệm vụ của bác sĩ</label>
          <RichTextEditor value={formData.assignment} onChange={(val) => handleRichTextChange('assignment', val)} />
        </div>
        <div className="form-group">
          <label>Trường hợp không nên sử dụng</label>
          <RichTextEditor value={formData.unAssignment} onChange={(val) => handleRichTextChange('unAssignment', val)} />
        </div>

        <div className="form-group">
          <label>Chi tiết quy trình</label>
          <RichTextEditor value={formData.procedureDetails} onChange={(val) => handleRichTextChange('procedureDetails', val)} />
        </div>
        <div className="form-group">
          <label>Ảnh quy trình</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, 'procedureDetailsImg')} />
          {formData.procedureDetailsImgPreview && <img src={formData.procedureDetailsImgPreview} alt="preview" className="img-preview" />}
        </div>
        <div className="form-group">
          <label>Tỉ lệ thành công</label>
          <RichTextEditor value={formData.successRate} onChange={(val) => handleRichTextChange('successRate', val)} />
        </div>
        <div className="form-group">
          <label>Kinh nghiệm giúp tăng tỉ lệ thành công</label>
          <RichTextEditor value={formData.experience} onChange={(val) => handleRichTextChange('experience', val)} />
        </div>
        <div className="form-group">
          <label>Các yếu tố rủi ro</label>
          <RichTextEditor value={formData.risk} onChange={(val) => handleRichTextChange('risk', val)} />
        </div>

        <div className="form-group">
          <label>Quy trình tại bệnh viện</label>
          <RichTextEditor value={formData.hospitalProcedure} onChange={(val) => handleRichTextChange('hospitalProcedure', val)} />
        </div>
        <div className="form-group">
          <label>Ảnh quy trình tại bệnh viện</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, 'hospitalProcedureImg')} />
          {formData.hospitalProcedureImgPreview && <img src={formData.hospitalProcedureImgPreview} alt="preview" className="img-preview" />}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo chi tiết'}
        </button>

        {success && <p className="success-message-cs">Tạo mới chi tiết phương pháp thành công!</p>}
        {error && <p className="error-message-cs">{error}</p>}
      </form>
    </div>
  );
};

export default CreateServiceDetails;
