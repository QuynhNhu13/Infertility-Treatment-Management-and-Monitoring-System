import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UploadImg = ({ onUploadSuccess }) => {
  const { getAuthHeader } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile); // khớp @RequestParam("image")

      const response = await axios.post(
        'http://localhost:8080/api/upload-image',
        formData,
        {
          headers: {
            ...getAuthHeader(), // KHÔNG có Content-Type ở đây
          },
        }
      );

      const imageUrl = response.data.data;
      onUploadSuccess(imageUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Tải ảnh lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '300px' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: '10px' }}
      />

      {previewUrl && (
        <div style={{ marginBottom: '10px' }}>
          <img
            src={previewUrl}
            alt="Xem trước"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </div>
      )}

      <button onClick={handleUpload} disabled={isUploading || !selectedFile}>
        {isUploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
      </button>

      {error && (
        <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>
      )}
    </div>
  );
};

export default UploadImg;
