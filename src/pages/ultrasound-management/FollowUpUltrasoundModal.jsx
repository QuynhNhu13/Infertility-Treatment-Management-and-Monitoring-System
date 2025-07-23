import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { INIT_ULTRASOUND_FORM, UPDATE_ULTRASOUND, UP_IMG } from "../../api/apiUrls";
import "../../styles/medical-record-management/InitUltrasoundModal.css";
import { Upload, XCircle, Trash2, Loader2, Image, X } from "lucide-react";
import axios from "axios";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_RESULT_LENGTH = 1000;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export default function InitUltrasoundModal({
  isOpen,
  onClose,
  medicalRecordId,
  onSuccess,
  mode = "create",
  initialData = null,
}) {
  const { getAuthHeader } = useAuth();
  const [result, setResult] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "update" && initialData) {
      setResult(initialData.result || "");
      setImageUrls(initialData.imgUrls || []);
    }
  }, [mode, initialData]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!result.trim()) newErrors.result = "Vui lòng nhập kết quả siêu âm";
    if (imageUrls.length === 0) newErrors.images = "Vui lòng tải lên ít nhất 1 ảnh";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [result, imageUrls]);

  const handleClose = useCallback(() => {
    if (loading || uploadingImages) {
      toast.warn("Vui lòng đợi quá trình tải lên hoàn tất");
      return;
    }
    setResult("");
    setImageUrls([]);
    setErrors({});
    onClose();
  }, [loading, uploadingImages, onClose]);

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) return `File ${file.name} quá lớn. Tối đa 5MB.`;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return `File ${file.name} không hợp lệ.`;
    return null;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = [];
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    setUploadingImages(true);
    const newUrls = [];
    let successCount = 0;

    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(UP_IMG, formData, {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data?.data) {
          newUrls.push(res.data.data);
          successCount++;
        }
      }
      if (newUrls.length > 0) {
        setImageUrls((prev) => [...prev, ...newUrls]);
        toast.success(`Tải thành công ${successCount} ảnh`);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải ảnh");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    toast.info("Đã xóa ảnh.");
  };

  const removeAllImages = () => {
    setImageUrls([]);
    toast.info("Đã xóa tất cả ảnh.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      result: result.trim(),
      imageUrls,
      medicalRecordId,
    };

    try {
      setLoading(true);
      const url = mode === "update" ? UPDATE_ULTRASOUND(initialData.id) : INIT_ULTRASOUND_FORM;
      const method = mode === "update" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`${mode === "update" ? "Cập nhật" : "Tạo"} kết quả siêu âm thành công!`);
        onSuccess?.(data.data);
        handleClose();
      } else {
        toast.error(data.message || `${mode === "update" ? "Cập nhật" : "Tạo"} thất bại`);
      }
    } catch (error) {
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) handleClose();
  }, [handleClose]);

  const handleResultChange = (e) => {
    const value = e.target.value;
    setResult(value);
    if (value.trim() && errors.result) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.result;
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="us-modal-overlay" onClick={handleBackdropClick}>
      <div className="us-modal-container">
        <div className="us-modal-header">
          <h3>
            <Image size={20} />
            {mode === "update" ? "Cập nhật" : "Nhập"} kết quả siêu âm
          </h3>
          <button
            type="button"
            className="us-modal-close-btn"
            onClick={handleClose}
            disabled={loading || uploadingImages}
          >
            <X size={20} />
          </button>
        </div>

        <div className="us-modal-body">
          <form onSubmit={handleSubmit} className="us-form">
            <div className="us-form-group">
              <label className="us-label">
                <span>Kết quả siêu âm *</span>
                <span className="us-char-count">{result.length}/{MAX_RESULT_LENGTH}</span>
              </label>
              <textarea
                value={result}
                onChange={handleResultChange}
                rows={5}
                maxLength={MAX_RESULT_LENGTH}
                placeholder="Mô tả chi tiết kết quả siêu âm..."
                className={`us-textarea ${errors.result ? 'us-textarea-error' : ''}`}
                required
              />
              {errors.result && (
                <span className="us-error-message">{errors.result}</span>
              )}
            </div>

            <div className="us-form-group">
              <label className="us-label">
                <span>Ảnh siêu âm *</span>
                <span className="us-image-count">{imageUrls.length} ảnh đã tải</span>
              </label>
              <div className="us-upload-area">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  multiple
                  onChange={handleFileChange}
                  className="us-file-input"
                  id="image-upload"
                  disabled={uploadingImages}
                />
                <label htmlFor="image-upload" className="us-upload-label">
                  {uploadingImages ? (
                    <div className="us-upload-loading">
                      <Loader2 className="us-spinner" size={20} />
                      <span>Đang tải ảnh...</span>
                    </div>
                  ) : (
                    <div className="us-upload-content">
                      <Upload size={24} />
                      <p>Chọn ảnh để tải lên</p>
                      <span className="us-upload-hint">JPG, PNG, GIF - Tối đa 5MB mỗi ảnh</span>
                    </div>
                  )}
                </label>
              </div>
              {errors.images && (
                <span className="us-error-message">{errors.images}</span>
              )}

              {imageUrls.length > 0 && (
                <div className="us-image-section">
                  <div className="us-image-header">
                    <h4>Ảnh đã tải ({imageUrls.length})</h4>
                    <button
                      type="button"
                      className="us-remove-all-btn"
                      onClick={removeAllImages}
                      disabled={uploadingImages}
                    >
                      <Trash2 size={16} /> Xóa tất cả
                    </button>
                  </div>
                  <div className="us-image-grid">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="us-image-item">
                        <div className="us-image-wrapper">
                          <img src={url} alt={`ultrasound-${index + 1}`} />
                          <button
                            type="button"
                            className="us-remove-btn"
                            onClick={() => removeImage(index)}
                            disabled={uploadingImages}
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                        <span className="us-image-number">Ảnh {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="us-form-actions">
              <button
                type="button"
                className="us-cancel-btn"
                onClick={handleClose}
                disabled={loading || uploadingImages}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="us-submit-btn"
                disabled={
                  loading ||
                  uploadingImages ||
                  !result.trim() ||
                  imageUrls.length === 0
                }
              >
                {loading ? (
                  <span className="us-btn-loading">
                    <Loader2 className="us-spinner" size={16} /> Đang gửi...
                  </span>
                ) : (
                  mode === "update" ? "Cập nhật" : "Tạo kết quả siêu âm"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}