import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_ALL_BLOGS } from "../../api/apiUrls";
import "../../styles/blog-management/ListBlogMana.css";

const ListBlogMana = () => {
  const { getAuthHeader } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isActionDone, setIsActionDone] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(GET_ALL_BLOGS, {
        method: "GET",
        headers: getAuthHeader(),
      });
      const data = await res.json();
      const sortedBlogs = (data.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlogs(sortedBlogs);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const updateBlogStatus = async (id, status) => {
    try {
      const url = `${GET_ALL_BLOGS}?id=${id}&status=${status}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: getAuthHeader(),
      });

      if (res.ok) {
        setIsActionDone(true);
        await fetchBlogs();
        setTimeout(() => {
          setSelectedBlog(null);
          setIsActionDone(false);
        }, 3000);
      } else {
        console.error("Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái blog:", err);
    }
  };

  const handleApprove = (id) => updateBlogStatus(id, "APPROVED");
  const handleReject = (id) => updateBlogStatus(id, "REJECTED");

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

  const handleCloseModal = () => {
    setSelectedBlog(null);
    setIsActionDone(false);
  };

  return (
    <div className="lbm-container">
      <h2 className="lbm-title">Quản lý tất cả blog</h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : blogs.length === 0 ? (
        <p>Không có blog nào.</p>
      ) : (
        <table className="lbm-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Người viết</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>{blog.createdBy?.fullName || "Không rõ"}</td>
                <td>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</td>
                <td style={getStatusStyle(blog.status)}>{blog.status}</td>
                <td>
                  <button onClick={() => setSelectedBlog(blog)}>Xem</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedBlog && (
        <div className="lbm-modal-overlay" onClick={handleCloseModal}>
          <div className="lbm-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="lbm-modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <h3>{selectedBlog.title}</h3>
            <div
              className="lbm-modal-body"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
            {selectedBlog.status === "PENDING" && !isActionDone && (
              <div className="lbm-modal-actions">
                <button className="approve" onClick={() => handleApprove(selectedBlog.id)}>
                  Duyệt
                </button>
                <button className="reject" onClick={() => handleReject(selectedBlog.id)}>
                  Từ chối
                </button>
              </div>
            )}
            {isActionDone && (
              <p style={{ marginTop: "10px", color: "#2ecc71", fontWeight: "bold" }}>
                Đã cập nhật trạng thái. Hộp thoại sẽ đóng sau vài giây...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBlogMana;
