import React, { useEffect, useState } from "react";
import { GET_DOCTOR_BLOGS } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import "../../styles/blog-management/DoctorBlogManager.css";
import CreateBlog from "../../pages/blog-management/CreateBlog";

const DoctorBlogManager = () => {
  const { getAuthHeader } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchMyBlogs = async () => {
    try {
      const response = await fetch(GET_DOCTOR_BLOGS, {
        method: "GET",
        headers: getAuthHeader(),
      });

      if (response.ok) {
        const data = await response.json();
        const sortedBlogs = (data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogs(sortedBlogs);
      } else {
        console.error("Không thể lấy danh sách blog.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return { color: "#f39c12" };
      case "APPROVED":
        return { color: "#2ecc71" };
      case "REJECTED":
        return { color: "#e74c3c" };
      default:
        return {};
    }
  };

  return (
    <div className="doctor-blog-manager">
      <h2>Quản lý blog của tôi</h2>
      <button className="create-blog-btn" onClick={() => setShowCreateModal(true)}>
        Tạo blog mới
      </button>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : blogs.length === 0 ? (
        <p>Chưa có blog nào.</p>
      ) : (
        <div className="blog-table-wrapper">
          <table className="blog-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td>{blog.title}</td>
                  <td>{blog.createdAt}</td>
                  <td style={getStatusStyle(blog.status)}>{blog.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateBlog
          onClose={() => setShowCreateModal(false)}
          onBlogCreated={fetchMyBlogs}
        />
      )}
    </div>
  );
};

export default DoctorBlogManager;
