import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { INIT_ULTRASOUND_FORM, UP_IMG, UPDATE_ULTRASOUND } from "../../api/apiUrls";
import axios from "axios";
import "../../styles/medical-record-management/InitUltrasoundModal.css";
import { Upload, XCircle, Trash2, Loader2, Image, X } from "lucide-react";

export default function InitUltrasoundModal({
  isOpen,
  onClose,
  medicalRecordId,
  onSuccess,
  initialData = null 
}) {
  const { getAuthHeader } = useAuth();
  const [result, setResult] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (initialData) {
      setResult(initialData.result || "");
      setImageUrls(initialData.imgUrls || []);
    } else {
      setResult("");
      setImageUrls([]);
    }
  }, [initialData]);

  const handleClose = () => {
    if (loading || uploadingImages) return;
    setResult("");
    setImageUrls([]);
    onClose();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const newUrls = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} quá lớn. Tối đa 5MB.`);
        continue;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} không phải là ảnh hợp lệ.`);
        continue;
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios.post(UP_IMG, formData, {
          headers: getAuthHeader(),
        });
        newUrls.push(res.data.data);
        toast.success(`Tải ${file.name} thành công`);
      } catch {
        toast.error(`Tải ${file.name} thất bại`);
      }
    }

    setImageUrls((prev) => [...prev, ...newUrls]);
    setUploadingImages(false);
    e.target.value = "";
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
    if (!result.trim()) return toast.warn("Nhập kết quả siêu âm.");
    if (imageUrls.length === 0) return toast.warn("Tải ít nhất 1 ảnh.");

    const payload = {
      result: result.trim(),
      imageUrls,
      medicalRecordId,
    };

    const isUpdate = !!initialData?.id;

    try {
      setLoading(true);
      const res = await fetch(
        isUpdate ? UPDATE_ULTRASOUND(initialData.id) : INIT_ULTRASOUND_FORM,
        {
          method: isUpdate ? "PUT" : "POST",
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(isUpdate ? "Cập nhật siêu âm thành công!" : "Tạo siêu âm thành công!");
        onSuccess?.(data.data);
        handleClose();
      } else {
        toast.error(data.message || "Thao tác thất bại.");
      }
    } catch {
      toast.error("Lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="us-modal-overlay" onClick={handleBackdropClick}>
      <div className="us-modal-container">
        <div className="us-modal-header">
          <h3>
            <Image size={20} style={{ marginRight: 6, verticalAlign: "middle" }} />
            {initialData ? "Cập nhật kết quả siêu âm" : "Nhập kết quả siêu âm"}
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
          <p className="us-form-description">
            Vui lòng nhập kết quả và tải ảnh siêu âm để hoàn tất hồ sơ bệnh án.
          </p>

          <form onSubmit={handleSubmit} className="us-form">
            <div className="us-form-group">
              <label className="us-label">
                <span>Kết quả siêu âm *</span>
                <span>{result.length}/1000 ký tự</span>
              </label>
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Mô tả chi tiết kết quả siêu âm..."
                className="us-textarea"
                required
              />
            </div>

            <div className="us-form-group">
              <label className="us-label">
                <span>Ảnh siêu âm *</span>
                <span>{imageUrls.length} ảnh đã tải</span>
              </label>

              <div className="us-upload-area">
                <input
                  type="file"
                  accept="image/*"
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
                      <p>Chọn ảnh để tải lên (JPG, PNG, GIF, max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>

              {imageUrls.length > 0 && (
                <div className="us-image-section">
                  <div className="us-image-header">
                    <h4>Ảnh đã tải ({imageUrls.length})</h4>
                    <button
                      type="button"
                      className="us-remove-all-btn"
                      onClick={removeAllImages}
                    >
                      <Trash2 size={16} /> Xóa tất cả
                    </button>
                  </div>

                  <div className="us-image-grid">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="us-image-item">
                        <div className="us-image-wrapper">
                          <img src={url} alt={`ultrasound-${index}`} />
                          <button
                            type="button"
                            className="us-remove-btn"
                            onClick={() => removeImage(index)}
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
                disabled={loading || uploadingImages}
              >
                {loading ? (
                  <span className="us-btn-loading">
                    <Loader2 className="us-spinner" size={16} /> Đang gửi...
                  </span>
                ) : (
                  initialData ? "Cập nhật" : "Tạo kết quả siêu âm"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
