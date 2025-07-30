import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FollowUpDetailView from "./FollowUpDetailView";
import PrescriptionSystemView from "../../pages/prescription-management/PrescriptionSystemView";
import {
  GET_LAB_TEST_FOLLOW,
  GET_FOLLOW_UP_ULTRASOUND,
  GET_TREATMENT_SESSION_RESULT
} from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import "../../styles/treatment-plan-management/TreatmentSessionPageView.css";
import HeaderPage from "../../components/HeaderPage";

export default function TreatmentSessionPageView() {
  const { recordId, sessionId } = useParams();
  const navigate = useNavigate();
  const { getJsonAuthHeader } = useAuth();

  const [labTests, setLabTests] = useState([]);
  const [ultrasoundData, setUltrasoundData] = useState({ result: null, images: [] });
  const [sessionData, setSessionData] = useState({
    isUpdated: false,
    updatedData: null
  });

  useEffect(() => {
    fetchLabTests();
    fetchUltrasoundImages();
    fetchSessionDetail();
  }, [sessionId]);

  const fetchLabTests = async () => {
    try {
      const res = await fetch(GET_LAB_TEST_FOLLOW(sessionId), {
        headers: getJsonAuthHeader()
      });
      const json = await res.json();
      if (json.statusCode === 200) {
        setLabTests(json.data || []);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách xét nghiệm:", error);
    }
  };

  const fetchUltrasoundImages = async () => {
    try {
      const res = await fetch(GET_FOLLOW_UP_ULTRASOUND(sessionId), {
        headers: getJsonAuthHeader()
      });
      const json = await res.json();
      if (json.statusCode === 200) {
        setUltrasoundData((prev) => ({ ...prev, images: json.data || [] }));
      }
    } catch (error) {
      console.error("Lỗi khi lấy kết quả siêu âm:", error);
    }
  };

  const fetchSessionDetail = async () => {
    try {
      const res = await fetch(GET_TREATMENT_SESSION_RESULT(sessionId), {
        headers: getJsonAuthHeader()
      });
      const json = await res.json();
      if (json.statusCode === 200 && json.data) {
        const session = json.data;
        const isUpdated = !!(session.diagnosis || session.symptoms || session.notes || session.status);
        setSessionData({
          isUpdated,
          updatedData: {
            diagnosis: session.diagnosis,
            symptoms: session.symptoms,
            notes: session.notes,
            status: session.status
          }
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin cập nhật của buổi khám:", error);
    }
  };

  const translateStatus = (status) => {
    const statusMap = {
      PENDING: "Chờ xử lý",
      IN_PROGRESS: "Đang xử lý",
      COMPLETED: "Đã hoàn thành"
    };
    return statusMap[status] || status;
  };

  return (
    <div className="treatment-session-page-view">
      <HeaderPage />

      <div className="treatment-session-page-view__header">
        <button
          onClick={() => navigate(-1)}
          className="treatment-session-page-view__back-btn"
        >
          ←
        </button>
        <h1 className="treatment-session-page-view__page-title">Chi tiết buổi điều trị</h1>
      </div>

      <FollowUpDetailView sessionId={sessionId} />

      {sessionData.isUpdated && sessionData.updatedData && (
        <div className="treatment-session-page-view__updated-info">
          <h4 className="treatment-session-page-view__updated-info-title">
            Thông tin sau cập nhật:
          </h4>
          <div className="treatment-session-page-view__info-grid">
            <div className="treatment-session-page-view__info-item">
              <span className="treatment-session-page-view__info-label">Chẩn đoán:</span>
              <span className="treatment-session-page-view__info-value">{sessionData.updatedData.diagnosis}</span>
            </div>
            <div className="treatment-session-page-view__info-item">
              <span className="treatment-session-page-view__info-label">Triệu chứng:</span>
              <span className="treatment-session-page-view__info-value">{sessionData.updatedData.symptoms}</span>
            </div>
            <div className="treatment-session-page-view__info-item">
              <span className="treatment-session-page-view__info-label">Ghi chú:</span>
              <span className="treatment-session-page-view__info-value">{sessionData.updatedData.notes}</span>
            </div>
            <div className="treatment-session-page-view__info-item">
              <span className="treatment-session-page-view__info-label">Trạng thái:</span>
              <span className="treatment-session-page-view__info-value">{translateStatus(sessionData.updatedData.status)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="treatment-session-page-view__section">
        <h2 className="treatment-session-page-view__section-title">🔬 Kết quả xét nghiệm</h2>
        {labTests.length > 0 ? (
          <div className="treatment-session-page-view__lab-test-grid">
            {labTests.map((test) => (
              <div key={test.id} className="treatment-session-page-view__lab-test-card">
                <div className="treatment-session-page-view__card-header">
                  <h4>{test.labTestName}</h4>
                  <span
                    className={`treatment-session-page-view__status-badge treatment-session-page-view__status-badge--${test.status.toLowerCase()}`}
                  >
                    {translateStatus(test.status)}
                  </span>
                </div>
                <div className="treatment-session-page-view__card-meta">
                  <span>📅 {test.testDate}</span> |{" "}
                  <span>👨‍⚕️ {test.staffFullName}</span>
                </div>
                {test.status === "COMPLETED" && (
                  <div>
                    <p><strong>Kết luận:</strong> {test.resultSummary}</p>
                    <p><strong>Chi tiết:</strong> {test.resultDetails}</p>
                    <p><strong>Ghi chú:</strong> {test.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Chưa có kết quả xét nghiệm</p>
        )}
      </div>

      <div className="treatment-session-page-view__section">
        <h2 className="treatment-session-page-view__section-title">📡 Kết quả siêu âm</h2>
        {ultrasoundData.images.length > 0 ? (
          <div className="treatment-session-page-view__ultrasound-grid">
            {ultrasoundData.images.map((item, index) => (
              <div key={item.id} className="treatment-session-page-view__ultrasound-card">
                <h4>Kết quả #{index + 1}</h4>
                <p><strong>Kết quả:</strong> {item.result}</p>
                {item.imgUrls?.length > 0 && (
                  <div className="treatment-session-page-view__ultrasound-images">
                    {item.imgUrls.map((url, idx) => (
                      <img key={idx} src={url} alt={`Siêu âm ${idx + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Chưa có kết quả siêu âm</p>
        )}
      </div>

      <div className="treatment-session-page-view__section">
        <h2 className="treatment-session-page-view__section-title">💊 Đơn thuốc điều trị</h2>
        <PrescriptionSystemView sessionId={sessionId} recordId={recordId} />
      </div>
    </div>
  );
}
