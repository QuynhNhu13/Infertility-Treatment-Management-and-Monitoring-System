import React, { useState } from "react";
import { CREATE_DOCTOR, UP_IMG } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import RichTextEditor from "../../components/RichTextEditor"; 
import "../../styles/doctor-management/DoctorFormModal.css";

export default function DoctorFormCreateModal({ onClose }) {
  const { getAuthHeader } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    position: "",
    expertise: "",
    description: "",
    imgFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imgFile") {
      setFormData((prev) => ({ ...prev, imgFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let imgUrl = "";
    if (formData.imgFile) {
      const imageForm = new FormData();
      imageForm.append("image", formData.imgFile);

      try {
        const uploadRes = await fetch(UP_IMG, {
          method: "POST",
          body: imageForm,
          headers: {
            Authorization: getAuthHeader().Authorization,
          },
        });

        const imgData = await uploadRes.json();
        if (uploadRes.ok) {
          imgUrl = imgData.data;
        } else {
          setError("Lỗi khi upload ảnh.");
          setLoading(false);
          return;
        }
      } catch (err) {
        setError("Lỗi khi upload ảnh.");
        setLoading(false);
        return;
      }
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      position: formData.position,
      expertise: formData.expertise,
      description: formData.description,
      imgUrl: imgUrl || null,
      status: "ACTIVE",
    };

    try {
      const res = await fetch(CREATE_DOCTOR, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        onClose();
      } else {
        if (
          data.message &&
          data.message.includes("duplicate key") &&
          data.message.includes("UK")
        ) {
          setError("Tài khoản này đã được gán cho bác sĩ khác.");
        } else {
          setError(data.message || "Tạo bác sĩ thất bại.");
        }
      }
    } catch (err) {
      setError("Đã xảy ra lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dfm-overlay" onClick={onClose}>
      <div className="dfm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Thêm bác sĩ mới</h3>
        <form onSubmit={handleSubmit} className="dfm-form">
          {error && <div className="dfm-error">{error}</div>}

          <label>
            Họ tên:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Chức vụ:
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </label>

          <label>
            Chuyên khoa:
            <input
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
            />
          </label>

          <label>
            Mô tả:
            <RichTextEditor
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, description: value }))
              }
            />
          </label>

          <label>
            Ảnh đại diện:
            <input
              type="file"
              name="imgFile"
              accept="image/*"
              onChange={handleChange}
            />
          </label>

          <div className="dfm-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo"}
            </button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
