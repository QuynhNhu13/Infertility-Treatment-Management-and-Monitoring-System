import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { GET_NOTI, READ_NOTI } from "../api/apiUrls";
import { useAuth } from "../context/AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { getAuthHeader } = useAuth();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(GET_NOTI, {
        headers: getAuthHeader(),
      });
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(READ_NOTI, {}, {
        headers: getAuthHeader(),
      });
      await fetchNotifications(); 
    } catch (error) {
      console.error("Lỗi khi cập nhật thông báo:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, fetchNotifications, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
