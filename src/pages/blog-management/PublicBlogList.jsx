import React, { useEffect, useState } from "react";
import "../../styles/blog-management/PublicBlogList.css";
import { LIST_BLOG } from "../../api/apiUrls";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const PublicBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedBlogs = async () => {
    try {
      const res = await fetch(LIST_BLOG);
      const data = await res.json();
      if (res.ok) {
        const approved = (data.data || []).filter((blog) => blog.status === "APPROVED");
        const sorted = approved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBlogs(sorted);
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

  return (
    <>
      <Header />
      <Navbar />
      <div className="public-blog-list">
        <h2>Blog sức khỏe & chia sẻ</h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : blogs.length === 0 ? (
          <p>Không có bài blog nào được duyệt.</p>
        ) : (
          blogs.map((blog) => (
            <form key={blog.id} className="blog-card">
              <div className="blog-meta">
                <p><strong>Chức vụ:</strong> {blog.createdBy?.position || "Không rõ"}</p>
                <p><strong>Bác sĩ:</strong> {blog.createdBy?.fullName || "Không rõ"}</p>
              </div>
              <h3 className="blog-title">{blog.title}</h3>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </form>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default PublicBlogList;
