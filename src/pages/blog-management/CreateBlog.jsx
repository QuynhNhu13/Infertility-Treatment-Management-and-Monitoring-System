import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CREATE_BLOG } from "../../api/apiUrls";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "../../styles/blog-management/CreateBlog.css";

const CreateBlog = ({ onClose, onBlogCreated }) => {
  const { getAuthHeader } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("create-blog__overlay")) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Tiêu đề không được để trống.";
    if (!formData.content.trim()) newErrors.content = "Nội dung không được để trống.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
      };

      await axios.post(CREATE_BLOG, payload, { headers: getAuthHeader() });
      onBlogCreated();
      onClose();
    } catch (err) {
      console.error("Lỗi khi tạo blog:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-blog__overlay" onClick={handleOverlayClick}>
      <div className="create-blog__modal">
        <div className="create-blog__header">
          <h2 className="create-blog__title">Tạo Blog Mới</h2>
          <button
            className="create-blog__close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-blog__form">
          <div className="create-blog__form-group">
            <label htmlFor="title" className="create-blog__label">
              Tiêu đề <span className="create-blog__required">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`create-blog__input ${errors.title ? "create-blog__input--error" : ""}`}
              placeholder="Nhập tiêu đề blog..."
              disabled={isSubmitting}
              maxLength={200}
            />
            <div className="create-blog__input-info">
              <span className="create-blog__char-count">
                {formData.title.length}/200
              </span>
              {errors.title && (
                <span className="create-blog__error-text">{errors.title}</span>
              )}
            </div>
          </div>

          <div className="create-blog__form-group">
            <label htmlFor="content" className="create-blog__label">
              Nội dung <span className="create-blog__required">*</span>
            </label>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              className={`create-blog__quill ${errors.content ? "create-blog__quill--error" : ""}`}
              placeholder="Nhập nội dung blog..."
              readOnly={isSubmitting}
            />
            {errors.content && (
              <span className="create-blog__error-text">{errors.content}</span>
            )}
          </div>

          <div className="create-blog__footer">
            <button
              type="submit"
              className="create-blog__submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
