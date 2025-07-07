// EditServiceDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { UP_IMG, EDIT_SERVICE_DETAILS } from '../../api/apiUrls';
import RichTextEditor from '../../components/RichTextEditor';
import '../../styles/service-management/CreateService.css';

const EditServiceDetails = ({ serviceId, id, existingData, onClose }) => {
  const { getAuthHeader } = useAuth();

  const [formData, setFormData] = useState({
    concept: '',
    conceptImgFile: null,
    conceptImgPreview: '',
    conceptImgUrl: '',
    condition: '',
    assignment: '',
    unAssignment: '',
    procedureDetails: '',
    procedureDetailsImgFile: null,
    procedureDetailsImgPreview: '',
    procedureDetailsImgUrl: '',
    successRate: '',
    experience: '',
    risk: '',
    hospitalProcedure: '',
    hospitalProcedureImgFile: null,
    hospitalProcedureImgPreview: '',
    hospitalProcedureImgUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (existingData) {
      setFormData(prev => ({
        ...prev,
        ...existingData,
        conceptImgFile: null,
        conceptImgPreview: existingData.conceptImgUrl || '',
        procedureDetailsImgFile: null,
        procedureDetailsImgPreview: existingData.procedureDetailsImgUrl || '',
        hospitalProcedureImgFile: null,
        hospitalProcedureImgPreview: existingData.hospitalProcedureImgUrl || ''
      }));
    }
  }, [existingData]);

  const handleRichTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e, fieldPrefix) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        [`${fieldPrefix}File`]: file,
        [`${fieldPrefix}Preview`]: previewURL
      }));
    }
  };

  const uploadImage = async (file) => {
    const uploadData = new FormData();
    uploadData.append('image', file);
    const res = await axios.post(UP_IMG, uploadData, {
      headers: { Authorization: getAuthHeader().Authorization },
    });
    return res.data.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!serviceId || !id) {
        setError('Thiếu ID phương pháp hoặc ID chi tiết!');
        setLoading(false);
        return;
      }

       console.log("→ serviceId:", serviceId);
    console.log("→ detailId:", id);
    console.log("→ API URL:", EDIT_SERVICE_DETAILS(serviceId, id));

      const conceptImgUrl = formData.conceptImgFile
        ? await uploadImage(formData.conceptImgFile)
        : formData.conceptImgUrl || '';

      const procedureDetailsImgUrl = formData.procedureDetailsImgFile
        ? await uploadImage(formData.procedureDetailsImgFile)
        : formData.procedureDetailsImgUrl || '';

      const hospitalProcedureImgUrl = formData.hospitalProcedureImgFile
        ? await uploadImage(formData.hospitalProcedureImgFile)
        : formData.hospitalProcedureImgUrl || '';

      const payload = {
        concept: formData.concept || '',
        conceptImgUrl,
        condition: formData.condition || '',
        assignment: formData.assignment || '',
        unAssignment: formData.unAssignment || '',
        procedureDetails: formData.procedureDetails || '',
        procedureDetailsImgUrl,
        successRate: formData.successRate || '',
        experience: formData.experience || '',
        risk: formData.risk || '',
        hospitalProcedure: formData.hospitalProcedure || '',
        hospitalProcedureImgUrl
      };

      const res = await axios.put(
        EDIT_SERVICE_DETAILS(serviceId, id),
        payload,
        { headers: getAuthHeader() }
      );

      if (res.status === 200 || res.data.statusCode === 200) {
        setSuccess(true);
        setTimeout(() => onClose(), 2000);
      } else {
        setError("Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Lỗi cập nhật chi tiết dịch vụ:", err);
      setError("Lỗi kết nối hoặc dữ liệu không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-service-container">
      <h2>CẬP NHẬT CHI TIẾT DỊCH VỤ</h2>
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
          <label>Phân công</label>
          <RichTextEditor value={formData.assignment} onChange={(val) => handleRichTextChange('assignment', val)} />
        </div>
        <div className="form-group">
          <label>Không áp dụng cho</label>
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
          <input type="text" name="successRate" value={formData.successRate} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Kinh nghiệm</label>
          <RichTextEditor value={formData.experience} onChange={(val) => handleRichTextChange('experience', val)} />
        </div>
        <div className="form-group">
          <label>Rủi ro</label>
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
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>

        {success && <p className="success-message-cs">Cập nhật thành công!</p>}
        {error && <p className="error-message-cs">{error}</p>}
      </form>
    </div>
  );
};

export default EditServiceDetails;