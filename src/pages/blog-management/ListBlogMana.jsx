import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_ALL_BLOGS } from "../../api/apiUrls";
import "../../styles/blog-management/ListBlogMana.css";
import { useNavigate } from "react-router-dom";

const ListBlogMana = () => {
  const { getAuthHeader } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isActionDone, setIsActionDone] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteMode, setNoteMode] = useState("REJECT");
  const navigate = useNavigate();

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

  const updateBlogStatus = async (id, status, note) => {
    try {
      const url = `${GET_ALL_BLOGS}?id=${id}&status=${status}&note=${encodeURIComponent(note || "")}`;
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
          setNote("");
          setShowNoteInput(false);
        }, 3000);
      } else {
        console.error("Cập nhật trạng thái thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái blog:", err);
    }
  };

  const handleApprove = (id) => {
    updateBlogStatus(id, "APPROVED", "Bài viết đã được duyệt");
  };

  const handleReject = (id) => {
    if (!note.trim()) {
      alert("Vui lòng nhập lý do từ chối.");
      return;
    }
    updateBlogStatus(id, "REJECTED", note);
  };

  const handleDelete = (id) => {
    if (!note.trim()) {
      alert("Vui lòng nhập lý do xóa.");
      return;
    }
    updateBlogStatus(id, "DELETED", note);
  };

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
    setIsActionDone(false);
    setNote("");
    setShowNoteInput(false);
  };

  return (
    <div className="list-blog-mana-container">
      <div className="list-blog-mana-header">
        <h2 className="list-blog-mana-title">Quản lý tất cả blog</h2>
        <div className="list-blog-mana-stats">
          <span className="blog-count">Tổng cộng: {blogs.length} bài viết</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <p>Không có blog nào.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="list-blog-mana-table">
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
                  <td className="blog-title-h1">{blog.title}</td>
                  <td>{blog.createdBy?.fullName || "Không rõ"}</td>
                  <td>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <span className={`status-badge ${blog.status.toLowerCase()}`}>
                      {getStatusText(blog.status)}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-btn" 
                      onClick={() => setSelectedBlog(blog)}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBlog && (
        <div className="list-blog-mana-modal-overlay" onClick={handleCloseModal}>
          <div className="list-blog-mana-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedBlog.title}</h3>
              <button className="list-blog-mana-modal-close" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            
            <div className="modal-info">
              <span>Người viết: {selectedBlog.createdBy?.fullName || "Không rõ"}</span>
              <span>Ngày tạo: {new Date(selectedBlog.createdAt).toLocaleDateString("vi-VN")}</span>
              <span className={`status-badge ${selectedBlog.status.toLowerCase()}`}>
                {getStatusText(selectedBlog.status)}
              </span>
            </div>

            <div
              className="list-blog-mana-modal-body"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />

            {!isActionDone && selectedBlog.status === "PENDING" && (
              <div className="list-blog-mana-modal-actions">
                <button className="approve" onClick={() => handleApprove(selectedBlog.id)}>
                  Duyệt
                </button>
                <button
                  className="reject"
                  onClick={() => {
                    setNoteMode("REJECT");
                    setShowNoteInput(true);
                  }}
                >
                  Từ chối
                </button>
                <button
                  className="delete"
                  onClick={() => {
                    setNoteMode("DELETE");
                    setShowNoteInput(true);
                  }}
                >
                  Xóa
                </button>
              </div>
            )}

            {!isActionDone && selectedBlog.status === "APPROVED" && (
              <div className="list-blog-mana-modal-actions">
                <button
                  className="view-detail"
                  onClick={() => navigate("/goc-chia-se", { state: { selectedBlog } })}
                >
                  Xem chi tiết
                </button>
                <button
                  className="delete"
                  onClick={() => {
                    setNoteMode("DELETE");
                    setShowNoteInput(true);
                  }}
                >
                  Xóa
                </button>
              </div>
            )}

            {!isActionDone && selectedBlog.status === "REJECTED" && (
              <div className="reject-reason">
                <p><strong>Lý do từ chối:</strong> {selectedBlog.note || "Không rõ"}</p>
              </div>
            )}

            {showNoteInput && (
              <div className="list-blog-mana-note-input">
                <textarea
                  placeholder={
                    noteMode === "REJECT" ? "Nhập lý do từ chối..." : "Nhập lý do xóa..."
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <div className="note-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowNoteInput(false);
                      setNote("");
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    className="submit-btn"
                    onClick={() =>
                      noteMode === "REJECT"
                        ? handleReject(selectedBlog.id)
                        : handleDelete(selectedBlog.id)
                    }
                  >
                    {noteMode === "REJECT" ? "Từ chối" : "Xóa"}
                  </button>
                </div>
              </div>
            )}

            {isActionDone && (
              <div className="success-message">
                <p>Đã cập nhật thành công! Hộp thoại sẽ đóng sau vài giây...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBlogMana;