import React, { useEffect, useState } from "react";
import "../../styles/blog-management/PublicBlogList.css";
import { LIST_BLOG } from "../../api/apiUrls";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";

const PublicBlogList = () => {
  const { getAuthHeader } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [expandedBlogs, setExpandedBlogs] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  const fetchApprovedBlogs = async () => {
    try {
      const headers = getAuthHeader();
      const res = await fetch(LIST_BLOG, { headers });

      const data = await res.json();
      if (res.ok) {
        const approved = (data.data || []).filter((blog) => blog.status === "APPROVED");

        const sorted = approved.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return timeB - timeA;
        });

        setBlogs(sorted);
        setFilteredBlogs(sorted);
      } else {
        console.error("Không thể lấy danh sách blog đã duyệt");
      }
    } catch (err) {
      console.error("Lỗi khi fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.createdBy?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
    setCurrentPage(1);
  }, [searchTerm, blogs]);

  const toggleExpanded = (blogId) => {
    const newExpanded = new Set(expandedBlogs);
    if (newExpanded.has(blogId)) {
      newExpanded.delete(blogId);
    } else {
      newExpanded.add(blogId);
    }
    setExpandedBlogs(newExpanded);
  };

  const truncateContent = (content, maxLength = 300) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return content;
    return textContent.substring(0, maxLength) + '...';
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const LoadingSkeleton = () => (
    <div className="public-blog-list-loading-skeleton">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="public-blog-list-skeleton-card">
          <div className="public-blog-list-skeleton-header">
            <div className="public-blog-list-skeleton-avatar"></div>
            <div className="public-blog-list-skeleton-info">
              <div className="public-blog-list-skeleton-line short"></div>
              <div className="public-blog-list-skeleton-line medium"></div>
            </div>
          </div>
          <div className="public-blog-list-skeleton-title"></div>
          <div className="public-blog-list-skeleton-content">
            <div className="public-blog-list-skeleton-line long"></div>
            <div className="public-blog-list-skeleton-line medium"></div>
            <div className="public-blog-list-skeleton-line short"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Header />
      <Navbar />
      <div className="public-blog-list">
        <div className="public-blog-list-header">
          <h2 className="public-blog-list-title">
            <span className="public-blog-list-icon">📝</span>
            Blog sức khỏe & chia sẻ
          </h2>
          <div className="public-blog-list-search-container">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm blog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="public-blog-list-search-input"
            />
          </div>
          <div className="public-blog-list-stats">
            <span className="public-blog-list-count">
              {filteredBlogs.length} bài viết được tìm thấy
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : filteredBlogs.length === 0 ? (
          <div className="public-blog-list-empty">
            <div className="public-blog-list-empty-icon">📚</div>
            <p>Không có bài blog nào được tìm thấy.</p>
          </div>
        ) : (
          <>
            <div className="public-blog-list-container">
              {currentBlogs.map((blog, index) => (
                <article 
                  key={blog.id} 
                  className="public-blog-list-blog-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="public-blog-list-blog-header">
                    <div className="public-blog-list-author-info">
                      <div className="public-blog-list-author-avatar">
                        {(blog.createdBy?.fullName || "Dr").charAt(0).toUpperCase()}
                      </div>
                      <div className="public-blog-list-author-details">
                        <p className="public-blog-list-author-name">
                          <strong>Bác sĩ:</strong> {blog.createdBy?.fullName || "Không rõ"}
                        </p>
                        <p className="public-blog-list-author-position">
                          <strong>Chức vụ:</strong> {blog.createdBy?.position || "Không rõ"}
                        </p>
                        <p className="public-blog-list-date">
                          <strong>Ngày đăng:</strong>{" "}
                          {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="public-blog-list-blog-badge">
                      ✅ Đã duyệt
                    </div>
                  </div>

                  <h3 className="public-blog-list-blog-title">{blog.title}</h3>
                  
                  <div className="public-blog-list-blog-content">
                    <div
                      dangerouslySetInnerHTML={{ 
                        __html: expandedBlogs.has(blog.id) 
                          ? blog.content 
                          : truncateContent(blog.content)
                      }}
                    />
                  </div>

                  <div className="public-blog-list-blog-actions">
                    <button
                      onClick={() => toggleExpanded(blog.id)}
                      className="public-blog-list-expand-btn"
                    >
                      {expandedBlogs.has(blog.id) ? (
                        <>📖 Thu gọn</>
                      ) : (
                        <>🔍 Đọc thêm</>
                      )}
                    </button>
                    <div className="public-blog-list-blog-tags">
                      <span className="public-blog-list-tag">Sức khỏe</span>
                      <span className="public-blog-list-tag">Y tế</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="public-blog-list-pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="public-blog-list-pagination-btn"
                >
                  ← Trước
                </button>
                
                <div className="public-blog-list-pagination-info">
                  <span className="public-blog-list-current-page">{currentPage}</span>
                  <span> / </span>
                  <span className="public-blog-list-total-pages">{totalPages}</span>
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="public-blog-list-pagination-btn"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PublicBlogList;