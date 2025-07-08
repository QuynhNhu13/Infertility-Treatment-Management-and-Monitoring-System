import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/blog-management/CreateBlog.css";
import { CREATE_BLOG } from '../../api/apiUrls';
import RichTextEditor from "../../components/RichTextEditor"; // 👈 Thêm dòng này

const CreateBlog = ({ onClose, onBlogCreated }) => {
  const { getJsonAuthHeader } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Tiêu đề không được để trống.";
    if (!formData.content.trim() || formData.content === "<p><br></p>") newErrors.content = "Nội dung không được để trống.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
    setErrors({ ...errors, content: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(CREATE_BLOG, {
        method: "POST",
        headers: {
          ...getJsonAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Gửi blog thành công!");
        setFormData({ title: "", content: "" });

        if (onBlogCreated) onBlogCreated();
        if (onClose) setTimeout(onClose, 1000);
      } else {
        const errorData = await response.json();
        setSuccessMessage("");
        setErrors({ server: errorData.message || "Đã xảy ra lỗi!" });
      }
    } catch (error) {
      console.error("Lỗi khi gửi blog:", error);
      setErrors({ server: "Lỗi kết nối đến máy chủ." });
    }
  };

  return (
    <div className="cb-modal-overlay" onClick={onClose}>
      <div className="cb-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="cb-modal-close-btn" onClick={onClose}>&times;</button>

        <h2 className="cb-title">Tạo Blog Mới</h2>
        <form onSubmit={handleSubmit} className="cb-form">
          <div className="cb-form-group">
            <label>Tiêu đề:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="cb-input"
            />
            {errors.title && <p className="cb-error">{errors.title}</p>}
          </div>

          <div className="cb-form-group">
            <label>Nội dung:</label>
            <RichTextEditor value={formData.content} onChange={handleContentChange} />
            {errors.content && <p className="cb-error">{errors.content}</p>}
          </div>

          {errors.server && <p className="cb-error">{errors.server}</p>}
          {successMessage && <p className="cb-success">{successMessage}</p>}

          <button type="submit" className="cb-submit-btn">Gửi Blog</button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
