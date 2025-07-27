import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_TREATMENT_SESSION } from "../../api/apiUrls";
import {
  FaCalendarAlt,
  FaStethoscope,
  FaNotesMedical,
  FaExclamationCircle,
  FaSearch,
  FaCheckCircle,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/treatment-plan-management/TreatmentSessionView.css";

export default function TreatmentSessionView({ progressId }) {
  const { getAuthHeader } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { recordId } = useParams();

  useEffect(() => {
    if (!progressId) return;

    fetchSessions();
  }, [progressId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch(GET_TREATMENT_SESSION(progressId), {
        headers: {
          ...getAuthHeader(),
        },
      });

      const result = await res.json();
      setSessions(result.data || []);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (sessionId) => {
    navigate(`/ho-so-benh-nhan/${recordId}/tien-trinh-dieu-tri/${progressId}/buoi-kham/${sessionId}`);
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      "PENDING": {
        icon: FaSpinner,
        text: "Chờ khám",
        className: "pending"
      },
      "COMPLETED": {
        icon: FaCheckCircle,
        text: "Đã khám",
        className: "completed"
      },
      "CANCELLED": {
        icon: FaTimesCircle,
        text: "Đã hủy",
        className: "cancelled"
      }
    };

    return statusMap[status] || {
      icon: FaExclamationCircle,
      text: "Không rõ",
      className: "unknown"
    };
  };

  const renderSessionCard = (session) => {
    const statusConfig = getStatusConfig(session.status);
    const StatusIcon = statusConfig.icon;

    return (
      <li key={session.id} className="session-view__card">
        <div className="session-view__card-header">
          <div className="session-view__date">
            <FaCalendarAlt className="session-view__icon" />
            <span className="session-view__date-text">{session.date}</span>
          </div>
          <div className={`session-view__status session-view__status--${statusConfig.className}`}>
            <StatusIcon className="session-view__icon" />
            <span>{statusConfig.text}</span>
          </div>
        </div>

        <div className="session-view__card-content">
          <div className="session-view__info">
            <div className="session-view__info-item">
              <FaStethoscope className="session-view__icon" />
              <div className="session-view__info-content">
                <span className="session-view__info-label">Chẩn đoán:</span>
                <span className="session-view__info-value">{session.diagnosis || "Chưa có chẩn đoán"}</span>
              </div>
            </div>

            <div className="session-view__info-item">
              <FaNotesMedical className="session-view__icon" />
              <div className="session-view__info-content">
                <span className="session-view__info-label">Triệu chứng:</span>
                <span className="session-view__info-value">{session.symptoms || "Không có triệu chứng đặc biệt"}</span>
              </div>
            </div>
          </div>

          <div className="session-view__actions">
            <button
              className="session-view__detail-btn"
              onClick={() => handleViewDetail(session.id)}
              disabled={loading}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </li>
    );
  };

  if (loading) {
    return (
      <div className="session-view__state">
        <div className="session-view__loading">
          <FaSpinner className="session-view__loading-icon" />
          <p>Đang tải danh sách buổi khám...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="session-view__state">
        <div className="session-view__error">
          <FaExclamationCircle className="session-view__error-icon" />
          <p>{errorMsg}</p>
          <button
            onClick={fetchSessions}
            className="session-view__retry-btn"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="session-view__state">
        <div className="session-view__empty">
          <FaCalendarAlt className="session-view__empty-icon" />
          <p>Chưa có buổi khám nào trong tiến trình điều trị này</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="treatment-session-view-header">
        <h3 className="section-title-n">
          <FaCalendarAlt className="title-icon" />
          Danh sách buổi khám ({sessions.length})
        </h3>
      </div>

      <ul className="treatment-session-view-list">
        {sessions.map(renderSessionCard)}
      </ul>
    </>
  );
}