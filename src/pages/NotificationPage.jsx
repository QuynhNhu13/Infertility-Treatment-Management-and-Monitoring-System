import React, { useEffect } from "react";
import { useNotification } from "../components/NotificationContext";
import "../styles/NotificationPage.css";
import { useNavigate } from "react-router-dom";
import HeaderPage from "../components/HeaderPage";

const NotificationPage = () => {
  const { notifications, fetchNotifications, markAllAsRead } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications(); 
    markAllAsRead(); 
  }, []);

  return (
<>
<HeaderPage />
    <div className="notification-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>
      <h2>Thông báo của bạn</h2>
      {notifications.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        notifications.map((n, i) => (
          <div key={i} className={`notification-item ${n.read ? "read" : "unread"}`}>
            <p>{n.content}</p>
            <small>{new Date(n.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
</>
  );
};

export default NotificationPage;
