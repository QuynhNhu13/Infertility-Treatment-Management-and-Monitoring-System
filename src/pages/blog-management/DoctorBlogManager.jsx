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
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [error, setError] = useState(null);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
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
        setError("Không thể lấy danh sách blog.");
      }
    } catch (error) {
      setError("Lỗi khi tải dữ liệu blog.");
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
      case "DELETED":
        return { color: "#95a5a6" };
      default:
        return {};
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Bị từ chối";
      case "DELETED":
        return "Đã xóa";
      default:
        return "Không rõ";
    }
  };

  const handleCloseModal = () => {
    setSelectedBlog(null);
  };

  const handleRefresh = () => {
    fetchMyBlogs();
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="doctor-blog-manager">
      <div className="blog-header">
        <div className="header-content">
          <h2>Quản lý blog của tôi</h2>
          <p className="header-subtitle">Tạo và quản lý các bài viết y tế của bạn</p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
            <i className="refresh-icon">⟳</i>
            Làm mới
          </button>
          <button className="create-blog-btn" onClick={() => setShowCreateModal(true)}>
            <i className="plus-icon">+</i>
            Tạo blog mới
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <i className="error-icon">⚠</i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Chưa có blog nào</h3>
          <p>Bắt đầu tạo blog đầu tiên để chia sẻ kiến thức y tế</p>
          <button className="create-first-blog-btn" onClick={() => setShowCreateModal(true)}>
            Tạo blog đầu tiên
          </button>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card" onClick={() => setSelectedBlog(blog)}>
              <div className="blog-card-header">
                <h3 className="blog-title">{truncateText(blog.title, 60)}</h3>
                <span className={`blog-status status-${blog.status.toLowerCase()}`}>
                  {getStatusText(blog.status)}
                </span>
              </div>
              <div className="blog-card-content">
                <div 
                  className="blog-excerpt" 
                  dangerouslySetInnerHTML={{ 
                    __html: truncateText(blog.content.replace(/<[^>]*>/g, ''), 120) 
                  }}
                />
              </div>
              <div className="blog-card-footer">
                <span className="blog-date">
                  {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </span>
                <span className="read-more">Xem chi tiết →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBlog && (
        <div className="blog-modal-overlay" onClick={handleCloseModal}>
          <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="blog-modal-header">
              <h3>{selectedBlog.title}</h3>
              <button className="blog-modal-close" onClick={handleCloseModal}>
                <i className="close-icon">×</i>
              </button>
            </div>
            <div className="blog-modal-body">
              <div className="blog-meta">
                <span className="blog-date">
                  Ngày tạo: {new Date(selectedBlog.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <span className={`blog-status status-${selectedBlog.status.toLowerCase()}`}>
                  {getStatusText(selectedBlog.status)}
                </span>
              </div>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
              {selectedBlog.status === "REJECTED" && selectedBlog.note && (
                <div className="rejection-note">
                  <div className="rejection-header">
                    <i className="warning-icon">⚠</i>
                    <strong>Lý do bị từ chối:</strong>
                  </div>
                  <p>{selectedBlog.note}</p>
                </div>
              )}
            </div>
          </div>
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