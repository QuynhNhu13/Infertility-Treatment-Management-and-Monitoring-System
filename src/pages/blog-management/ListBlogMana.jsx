import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_ALL_BLOGS } from "../../api/apiUrls";
import "../../styles/blog-management/ListBlogMana.css";
import { useNavigate } from "react-router-dom";
import Select from "react-select";



const ListBlogMana = () => {
  const { getAuthHeader } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isActionDone, setIsActionDone] = useState(false);
  const [note, setNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteMode, setNoteMode] = useState("REJECT");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const blogsPerPage = 10;
  const navigate = useNavigate();

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Bị từ chối" },
  ];


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
      setFilteredBlogs(sortedBlogs);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs.filter(blog => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.createdBy?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "" || blog.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    // Sort blogs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return (a.createdBy?.fullName || "").localeCompare(b.createdBy?.fullName || "");
        default:
          return 0;
      }
    });

    setFilteredBlogs(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, blogs, sortBy]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "APPROVED":
        return "✅";
      case "REJECTED":
        return "❌";
      case "DELETED":
        return "🗑️";
      default:
        return "❓";
    }
  };

  const getStatusCounts = () => {
    return {
      total: blogs.length,
      pending: blogs.filter(b => b.status === "PENDING").length,
      approved: blogs.filter(b => b.status === "APPROVED").length,
      rejected: blogs.filter(b => b.status === "REJECTED").length,
    };
  };

  const handleCloseModal = () => {
    setSelectedBlog(null);
    setIsActionDone(false);
    setNote("");
    setShowNoteInput(false);
  };

  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const statusCounts = getStatusCounts();

  const LoadingSkeleton = () => (
    <div className="blog-mana-loading-skeleton">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="blog-mana-skeleton-row">
          <div className="blog-mana-skeleton-cell long"></div>
          <div className="blog-mana-skeleton-cell medium"></div>
          <div className="blog-mana-skeleton-cell short"></div>
          <div className="blog-mana-skeleton-cell short"></div>
          <div className="blog-mana-skeleton-cell short"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="blog-mana-container">
      <div className="blog-mana-header">
        <h2 className="blog-mana-title">
          QUẢN LÝ BLOG
        </h2>

        <div className="blog-mana-stats">
          <div className="blog-mana-stat-card total">
            <span className="blog-mana-stat-number">{statusCounts.total}</span>
            <span className="blog-mana-stat-label">Tổng cộng</span>
          </div>
          <div className="blog-mana-stat-card pending">
            <span className="blog-mana-stat-number">{statusCounts.pending}</span>
            <span className="blog-mana-stat-label">Chờ duyệt</span>
          </div>
          <div className="blog-mana-stat-card approved">
            <span className="blog-mana-stat-number">{statusCounts.approved}</span>
            <span className="blog-mana-stat-label">Đã duyệt</span>
          </div>
          <div className="blog-mana-stat-card rejected">
            <span className="blog-mana-stat-number">{statusCounts.rejected}</span>
            <span className="blog-mana-stat-label">Từ chối</span>
          </div>
        </div>
      </div>

      <div className="blog-mana-controls">
        <div className="blog-mana-search-section">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm blog hoặc tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="blog-mana-search-input"
          />

          {/* <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="blog-mana-filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Bị từ chối</option>
          </select> */}
          <Select
            options={statusOptions}
            value={statusOptions.find(option => option.value === filterStatus)}
            onChange={(selectedOption) => setFilterStatus(selectedOption.value)}
            className="blog-mana-filter-select"
            classNamePrefix="react-select"
          />


          {/* <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="blog-mana-sort-select"
          >
            <option value="newest">📅 Mới nhất</option>
            <option value="oldest">📅 Cũ nhất</option>
            <option value="title">🔤 Theo tiêu đề</option>
            <option value="author">👤 Theo tác giả</option>
          </select> */}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : filteredBlogs.length === 0 ? (
        <div className="blog-mana-empty">
          <div className="blog-mana-empty-icon">📝</div>
          <p>Không tìm thấy blog nào.</p>
        </div>
      ) : (
        <>
          <div className="blog-mana-table-container">
            <table className="blog-mana-table">
              <thead>
                <tr>
                  <th>Nội dung</th>
                  <th>Người viết</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map((blog, index) => (
                  <tr
                    key={blog.id}
                    className="blog-mana-table-row"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="blog-title-cell">
                      <div className="blog-title-content">
                        <h4>{truncateText(blog.title, 60)}</h4>
                        <p>{truncateText(blog.content?.replace(/<[^>]*>/g, '') || '', 100)}</p>
                      </div>
                    </td>
                    <td>
                      <div className="author-cell">
                        <div className="author-avatar">
                          {(blog.createdBy?.fullName || "?").charAt(0).toUpperCase()}
                        </div>
                        <span>{blog.createdBy?.fullName || "Không rõ"}</span>
                      </div>
                    </td>
                    <td className="date-cell">{formatDate(blog.createdAt)}</td>
                    <td>
                      <span className={`blog-status-badge ${blog.status.toLowerCase()}`}>
                        {getStatusIcon(blog.status)} {getStatusText(blog.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="blog-view-btn"
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

          {totalPages > 1 && (
            <div className="blog-mana-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="blog-mana-pagination-btn"
              >
                ← Trước
              </button>

              <div className="blog-mana-pagination-info">
                <span className="blog-mana-current-page">{currentPage}</span>
                <span> / </span>
                <span className="blog-mana-total-pages">{totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="blog-mana-pagination-btn"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}

      {selectedBlog && (
        <div className="blog-mana-modal-overlay" onClick={handleCloseModal}>
          <div className="blog-mana-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="blog-modal-header">
              <h3>{selectedBlog.title}</h3>
              <button className="blog-modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <div className="blog-modal-info">
              <div className="blog-modal-info-item">
                <span className="blog-info-label">👤 Người viết:</span>
                <span>{selectedBlog.createdBy?.fullName || "Không rõ"}</span>
              </div>
              <div className="blog-modal-info-item">
                <span className="blog-info-label">📅 Ngày tạo:</span>
                <span>{formatDate(selectedBlog.createdAt)}</span>
              </div>
              <div className="blog-modal-info-item">
                <span className="blog-info-label">📊 Trạng thái:</span>
                <span className={`blog-status-badge ${selectedBlog.status.toLowerCase()}`}>
                  {getStatusIcon(selectedBlog.status)} {getStatusText(selectedBlog.status)}
                </span>
              </div>
            </div>

            <div className="blog-modal-body">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>

            {!isActionDone && selectedBlog.status === "PENDING" && (
              <div className="blog-modal-actions">
                <button
                  className="blog-approve-btn"
                  onClick={() => handleApprove(selectedBlog.id)}
                >
                  Duyệt bài
                </button>
                <button
                  className="blog-reject-btn"
                  onClick={() => {
                    setNoteMode("REJECT");
                    setShowNoteInput(true);
                  }}
                >
                  Từ chối
                </button>
              </div>
            )}

            {!isActionDone && selectedBlog.status === "APPROVED" && (
              <div className="blog-modal-actions">
                <button
                  className="blog-detail-btn"
                  onClick={() => navigate("/goc-chia-se", { state: { selectedBlog } })}
                >
                  🔗 Xem chi tiết
                </button>
              </div>
            )}

            {!isActionDone && selectedBlog.status === "REJECTED" && (
              <div className="blog-reject-reason">
                <h4>Lý do từ chối:</h4>
                <p>{selectedBlog.note || "Không có lý do cụ thể"}</p>
              </div>
            )}

            {showNoteInput && (
              <div className="blog-note-input">
                <h4>Nhập lý do từ chối:</h4>
                <textarea
                  placeholder="Vui lòng nhập lý do từ chối bài viết này..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
                <div className="blog-note-actions">
                  <button
                    className="blog-cancel-btn"
                    onClick={() => {
                      setShowNoteInput(false);
                      setNote("");
                    }}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    className="blog-submit-btn"
                    onClick={() => handleReject(selectedBlog.id)}
                  >
                    Xác nhận từ chối
                  </button>
                </div>
              </div>
            )}

            {isActionDone && (
              <div className="blog-success-message">
                <div className="success-icon"></div>
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