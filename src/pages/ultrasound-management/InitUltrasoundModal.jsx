import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  INIT_ULTRASOUND_FORM,
  UP_IMG,
  UPDATE_ULTRASOUND,
} from "../../api/apiUrls";
import axios from "axios";
import "../../styles/ultrasound-management/InitUltrasoundModal.css";
import { Upload, XCircle, Trash2, Loader2, Image, X } from "lucide-react";

export default function InitUltrasoundModal({
  isOpen,
  onClose,
  medicalRecordId,
  onSuccess,
  initialData = null,
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
        toast.success(
          isUpdate ? "Cập nhật siêu âm thành công!" : "Tạo siêu âm thành công!"
        );
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
    <div className="init-ultrasound-modal-overlay" onClick={handleBackdropClick}>
      <div className="init-ultrasound-modal-container">
        <div className="init-ultrasound-modal-header">
          <h3>
            <Image size={20} style={{ marginRight: 6, verticalAlign: "middle" }} />
            {initialData ? "Cập nhật kết quả siêu âm" : "Nhập kết quả siêu âm"}
          </h3>
          <button
            type="button"
            className="init-ultrasound-modal-close-btn"
            onClick={handleClose}
            disabled={loading || uploadingImages}
          >
            <X size={20} />
          </button>
        </div>

        <div className="init-ultrasound-modal-body">
          <p className="init-ultrasound-form-description">
            Vui lòng nhập kết quả và tải ảnh siêu âm để hoàn tất hồ sơ bệnh án.
          </p>

          <form onSubmit={handleSubmit} className="init-ultrasound-form">
            <div className="init-ultrasound-form-group">
              <label className="init-ultrasound-label">
                <span>Kết quả siêu âm *</span>
                <span>{result.length}/1000 ký tự</span>
              </label>
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Mô tả chi tiết kết quả siêu âm..."
                className="init-ultrasound-textarea"
                required
              />
            </div>

            <div className="init-ultrasound-form-group">
              <label className="init-ultrasound-label">
                <span>Ảnh siêu âm *</span>
                <span>{imageUrls.length} ảnh đã tải</span>
              </label>

              <div className="init-ultrasound-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="init-ultrasound-file-input"
                  id="image-upload"
                  disabled={uploadingImages}
                />
                <label htmlFor="image-upload" className="init-ultrasound-upload-label">
                  {uploadingImages ? (
                    <div className="init-ultrasound-upload-loading">
                      <Loader2 className="init-ultrasound-spinner" size={20} />
                      <span>Đang tải ảnh...</span>
                    </div>
                  ) : (
                    <div className="init-ultrasound-upload-content">
                      <Upload size={24} />
                      <p>Chọn ảnh để tải lên (JPG, PNG, GIF, max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>

              {imageUrls.length > 0 && (
                <div className="init-ultrasound-image-section">
                  <div className="init-ultrasound-image-header">
                    <h4>Ảnh đã tải ({imageUrls.length})</h4>
                    <button
                      type="button"
                      className="init-ultrasound-remove-all-btn"
                      onClick={removeAllImages}
                    >
                      <Trash2 size={16} /> Xóa tất cả
                    </button>
                  </div>

                  <div className="init-ultrasound-image-grid">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="init-ultrasound-image-item">
                        <div className="init-ultrasound-image-wrapper">
                          <img src={url} alt={`ultrasound-${index}`} />
                          <button
                            type="button"
                            className="init-ultrasound-remove-btn"
                            onClick={() => removeImage(index)}
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                        <span className="init-ultrasound-image-number">Ảnh {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="init-ultrasound-form-actions">
              <button
                type="button"
                className="init-ultrasound-cancel-btn"
                onClick={handleClose}
                disabled={loading || uploadingImages}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="init-ultrasound-submit-btn"
                disabled={loading || uploadingImages}
              >
                {loading ? (
                  <span className="init-ultrasound-btn-loading">
                    <Loader2 className="init-ultrasound-spinner" size={16} /> Đang gửi...
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
