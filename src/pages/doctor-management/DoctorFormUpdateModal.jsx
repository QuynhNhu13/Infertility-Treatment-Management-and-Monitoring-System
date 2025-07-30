import React, { useEffect, useState } from "react";
import {
  GET_DOCTOR_DETAIL_BY_ID,
  UPDATE_DOCTOR,
  UP_IMG,
} from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import "../../styles/doctor-management/DoctorFormModal.css";

export default function DoctorFormUpdateModal({ id, onClose }) {
  const { getAuthHeader } = useAuth();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const fetchDoctor = async () => {
    try {
      const res = await fetch(GET_DOCTOR_DETAIL_BY_ID(id), {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(data.data);
      } else {
        setErrors("Không thể tải dữ liệu bác sĩ");
      }
    } catch (err) {
      setErrors("Lỗi khi gọi API");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

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
    setLoading(true);

    let imgUrl = formData.imgUrl;
    if (formData.imgFile) {
      const imgForm = new FormData();
      imgForm.append("image", formData.imgFile);

      try {
        const uploadRes = await fetch(UP_IMG, {
          method: "POST",
          body: imgForm,
          headers: {
            Authorization: getAuthHeader().Authorization,
          },
        });

        const imgData = await uploadRes.json();
        if (uploadRes.ok) {
          imgUrl = imgData.data;
        } else {
          setErrors("Lỗi upload ảnh");
          setLoading(false);
          return;
        }
      } catch (err) {
        setErrors("Lỗi upload ảnh");
        setLoading(false);
        return;
      }
    }

    const payload = {
      fullName: formData.fullName,
      position: formData.position,
      expertise: formData.expertise,
      description: formData.description,
      slug: null,
      imgUrl: imgUrl,
      status: "ACTIVE",
    };

    try {
      const res = await fetch(UPDATE_DOCTOR(id), {
        method: "PUT",
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
        setErrors(data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      setErrors("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <div className="dfm-overlay" onClick={onClose}>
      <div className="dfm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Cập nhật bác sĩ</h3>
        {errors && <p className="dfm-error">{errors}</p>}
        <form onSubmit={handleSubmit} className="dfm-form">
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
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
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
              {loading ? "Đang cập nhật..." : "Cập nhật"}
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
