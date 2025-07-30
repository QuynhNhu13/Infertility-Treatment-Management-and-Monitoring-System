import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FollowUpDetail from "./FollowUpDetail";
import UpdateTreatmentSessionModal from "./UpdateTreatmentSessionModal";
import LabTestFollowUpRequestModal from "../../pages/lab-test-management/LabTestFollowUpRequestModal";
import FollowUpUltrasoundModal from "../../pages/ultrasound-management/FollowUpUltrasoundModal";
import PrescriptionSystem from "../../pages/prescription-management/PrescriptionSystem";
import { GET_LAB_TEST_FOLLOW, GET_FOLLOW_UP_ULTRASOUND, GET_TREATMENT_SESSION_RESULT } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import "../../styles/treatment-plan-management/TreatmentSessionPage.css";
import HeaderPage from "../../components/HeaderPage";


export default function TreatmentSessionPage() {
  const { recordId, progressId, sessionId } = useParams();
  const navigate = useNavigate();
  const { getJsonAuthHeader } = useAuth();

  const fetchSessionDetail = async () => {
    try {
      const res = await fetch(GET_TREATMENT_SESSION_RESULT(sessionId), {
        headers: getJsonAuthHeader(),
      });
      const json = await res.json();
      if (json.statusCode === 200 && json.data) {
        const session = json.data;
        const isUpdated = !!(session.diagnosis || session.symptoms || session.notes || session.status);
        setSessionData({
          updatedData: {
            diagnosis: session.diagnosis,
            symptoms: session.symptoms,
            notes: session.notes,
            status: session.status,
          }
        });

      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết buổi khám:", error);
    }
  };


  const [modals, setModals] = useState({
    update: false,
    labTest: false,
    ultrasound: false
  });

  const [sessionData, setSessionData] = useState({
    isUpdated: false,
    updatedData: null
  });

  const [labTests, setLabTests] = useState([]);
  const [ultrasoundData, setUltrasoundData] = useState({
    result: null,
    images: []
  });

  useEffect(() => {
    initializeData();
  }, [sessionId]);

  const initializeData = () => {
    fetchSessionDetail();
    fetchLabTests();
    fetchUltrasoundImages();
  };

  const fetchLabTests = async () => {
    try {
      const res = await fetch(GET_LAB_TEST_FOLLOW(sessionId), {
        headers: getJsonAuthHeader(),
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
        headers: getJsonAuthHeader(),
      });
      const json = await res.json();
      if (json.statusCode === 200) {
        setUltrasoundData(prev => ({
          ...prev,
          images: json.data || []
        }));
      }
    } catch (error) {
      console.error("Lỗi khi lấy kết quả siêu âm:", error);
    }
  };

  const handleModalToggle = (modalType, isOpen = false, data = null) => {
    setModals(prev => ({
      ...prev,
      [modalType]: isOpen
    }));

    if (modalType === 'ultrasound') {
      setUltrasoundData(prev => ({
        ...prev,
        result: data
      }));
    }
  };

  const handleUpdateSuccess = (updatedSession) => {
    setSessionData({
      isUpdated: true,
      updatedData: updatedSession
    });
    handleModalToggle('update');
  };

  const handleLabTestSuccess = () => {
    handleModalToggle('labTest');
    fetchLabTests();
  };

  const handleUltrasoundSuccess = () => {
    handleModalToggle('ultrasound');
    fetchUltrasoundImages();
  };

  const translateStatus = (status) => {
    const statusMap = {
      "PENDING": "Chờ xử lý",
      "IN_PROGRESS": "Đang xử lý",
      "COMPLETED": "Đã hoàn thành"
    };
    return statusMap[status] || status;
  };



  const renderLabTestSection = () => {
    return (
      <div className="treatment-session-page__section treatment-session-page__lab-section">
        {/* <div className="treatment-session-page__section-header">
          <h2 className="treatment-session-page__section-title">
            <span className="treatment-session-page__section-icon">🔬</span>
            Kết quả xét nghiệm
          </h2>
          {!sessionData.isUpdated && (
            <button
              onClick={() => handleModalToggle('labTest', true)}
              className="treatment-session-page__action-btn treatment-session-page__action-btn--lab"
            >
              + Yêu cầu xét nghiệm
            </button>
          )}
        </div> */}

        <div className="treatment-session-page__section-header">
          <h2 className="treatment-session-page__section-title">
            <span className="treatment-session-page__section-icon">🔬</span>
            Kết quả xét nghiệm
          </h2>
          {(
            <button
              onClick={() => handleModalToggle('labTest', true)}
              className="treatment-session-page__action-btn treatment-session-page__action-btn--lab"
            >
              + Yêu cầu xét nghiệm
            </button>
          )}
        </div>

        <div className="treatment-session-page__section-content">
          {labTests.length > 0 ? (
            <div className="treatment-session-page__lab-test-grid">
              {labTests.map((test) => (
                <div key={test.id} className="treatment-session-page__lab-test-card">
                  <div className="treatment-session-page__card-header">
                    <h4 className="treatment-session-page__card-title">{test.labTestName}</h4>
                    <span className={`treatment-session-page__status-badge treatment-session-page__status-badge--${test.status.toLowerCase()}`}>
                      {translateStatus(test.status)}
                    </span>
                  </div>

                  <div className="treatment-session-page__card-meta">
                    <div className="treatment-session-page__meta-item">
                      <span className="treatment-session-page__meta-icon">📅</span>
                      <span>{test.testDate}</span>
                    </div>
                    <div className="treatment-session-page__meta-item">
                      <span className="treatment-session-page__meta-icon">👨‍⚕️</span>
                      <span>{test.staffFullName}</span>
                    </div>
                  </div>

                  {test.status === "COMPLETED" && (
                    <div className="treatment-session-page__test-results">
                      <div className="treatment-session-page__result-item">
                        <strong>Kết luận:</strong> {test.resultSummary}
                      </div>
                      <div className="treatment-session-page__result-item">
                        <strong>Chi tiết:</strong> {test.resultDetails}
                      </div>
                      <div className="treatment-session-page__result-item">
                        <strong>Ghi chú:</strong> {test.notes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="treatment-session-page__empty-state">
              <span className="treatment-session-page__empty-icon">🔬</span>
              <p>Chưa có kết quả xét nghiệm</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderUltrasoundSection = () => {
    return (
      <div className="treatment-session-page__section treatment-session-page__ultrasound-section">
        <div className="treatment-session-page__section-header">
          <h2 className="treatment-session-page__section-title">
            <span className="treatment-session-page__section-icon">📡</span>
            Kết quả siêu âm
          </h2>
          <button
            onClick={() => handleModalToggle('ultrasound', true, null)}
            className="treatment-session-page__action-btn treatment-session-page__action-btn--lab"
          >
            + Cập nhật kết quả siêu âm
          </button>
        </div>


        <div className="treatment-session-page__section-content">
          {ultrasoundData.images.length > 0 ? (
            <div className="treatment-session-page__ultrasound-grid">
              {ultrasoundData.images.map((item, index) => (
                <div key={item.id} className="treatment-session-page__ultrasound-card">
                  <div className="treatment-session-page__card-header">
                    <h4 className="treatment-session-page__card-title">Kết quả siêu âm #{index + 1}</h4>
                    <span className="treatment-session-page__ultrasound-date">{item.date}</span>
                  </div>

                  <div className="treatment-session-page__ultrasound-result">
                    <p><strong>Kết quả:</strong> {item.result}</p>
                  </div>

                  {item.imgUrls?.length > 0 && (
                    <div className="treatment-session-page__ultrasound-images">
                      {item.imgUrls.map((url, idx) => (
                        <div key={idx} className="treatment-session-page__image-container">
                          <img
                            src={url}
                            alt={`Siêu âm ${idx + 1}`}
                            className="treatment-session-page__ultrasound-image"
                          />
                          <div className="treatment-session-page__image-overlay">
                            <span>Xem chi tiết</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="treatment-session-page__empty-state">
              <span className="treatment-session-page__empty-icon">📡</span>
              <p>Chưa có kết quả siêu âm</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPrescriptionSection = () => {
    return (
      <div className="treatment-session-page__section treatment-session-page__prescription-section">
        <div className="treatment-session-page__section-header">
          <h2 className="treatment-session-page__section-title">
            <span className="treatment-session-page__section-icon">💊</span>
            Đơn thuốc điều trị
          </h2>
        </div>

        <div className="treatment-session-page__section-content">
          <PrescriptionSystem
            sessionId={sessionId}
            recordId={recordId}
          />
        </div>
      </div>
    );
  };

  const renderUpdateSection = () => {
    if (sessionData.isUpdated) return null;

    return (
      <div className="treatment-session-page__section treatment-session-page__update-section">
        <div className="treatment-session-page__section-header">
          <h2 className="treatment-session-page__section-title">
            <span className="treatment-session-page__section-icon">✏️</span>
            Cập nhật thông tin
          </h2>
        </div>

        <div className="treatment-session-page__section-content">
          <div className="treatment-session-page__update-actions">
            {/* <div className="treatment-session-page__update-card">
              <div className="treatment-session-page__update-card-icon">📋</div>
              <h4>Cập nhật thông tin khám</h4>
              <p>Cập nhật chẩn đoán, triệu chứng và ghi chú của buổi khám</p>
              <button
                onClick={() => handleModalToggle('update', true)}
                className="treatment-session-page__update-btn treatment-session-page__update-btn--primary"
              >
                Cập nhật thông tin
              </button>
            </div> */}
            {sessionData.updatedData?.status !== "COMPLETED" && (
              <div className="treatment-session-page__update-card">
                <div className="treatment-session-page__update-card-icon">📋</div>
                <h4>Cập nhật thông tin khám</h4>
                <p>Cập nhật chẩn đoán, triệu chứng và ghi chú của buổi khám</p>
                <button
                  onClick={() => handleModalToggle('update', true)}
                  className="treatment-session-page__update-btn treatment-session-page__update-btn--primary"
                >
                  Cập nhật thông tin
                </button>
              </div>
            )}


          </div>
        </div>
      </div>
    );
  };
  const renderSessionInfo = () => {
    return (
      <>
        <FollowUpDetail sessionId={sessionId} />

        {sessionData.isUpdated && sessionData.updatedData && (
          <div className="treatment-session-page__updated-info">
            <h4 className="treatment-session-page__updated-info-title">
              Thông tin sau cập nhật:
            </h4>
            <div className="treatment-session-page__info-grid">
              <div className="treatment-session-page__info-item">
                <span className="treatment-session-page__info-label">Chẩn đoán:</span>
                <span className="treatment-session-page__info-value">{sessionData.updatedData.diagnosis}</span>
              </div>
              <div className="treatment-session-page__info-item">
                <span className="treatment-session-page__info-label">Triệu chứng:</span>
                <span className="treatment-session-page__info-value">{sessionData.updatedData.symptoms}</span>
              </div>
              <div className="treatment-session-page__info-item">
                <span className="treatment-session-page__info-label">Ghi chú:</span>
                <span className="treatment-session-page__info-value">{sessionData.updatedData.notes}</span>
              </div>
              <div className="treatment-session-page__info-item">
                <span className="treatment-session-page__info-label">Trạng thái:</span>
                <span className="treatment-session-page__info-value">{sessionData.updatedData.status}</span>
              </div>
            </div>
          </div>
        )}

      </>
    );
  };

  return (
    <div className="treatment-session-page">

      <HeaderPage />

      <div className="treatment-session-page__header">
        <button
          onClick={() => navigate(-1)}
          className="treatment-session-page__back-btn"
        >
          ←
        </button>
        <h1 className="treatment-session-page__page-title">Chi tiết buổi điều trị</h1>
      </div>

      {renderSessionInfo()}
      {renderLabTestSection()}
      {renderUltrasoundSection()}
      {renderPrescriptionSection()}
      {renderUpdateSection()}

      {modals.update && (
        <UpdateTreatmentSessionModal
          isOpen={modals.update}
          onClose={() => handleModalToggle('update')}
          progressId={progressId}
          sessionData={{ id: sessionId }}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {modals.labTest && (
        <LabTestFollowUpRequestModal
          recordId={recordId}
          sessionId={sessionId}
          onClose={() => handleModalToggle('labTest')}
          onSuccess={handleLabTestSuccess}
        />
      )}

      {modals.ultrasound && (
        <FollowUpUltrasoundModal
          isOpen={modals.ultrasound}
          onClose={() => handleModalToggle('ultrasound')}
          sessionId={sessionId}
          medicalRecordId={recordId}
          onSuccess={handleUltrasoundSuccess}
          data={ultrasoundData.result}
          mode={ultrasoundData.result ? "edit" : "create"}
        />
      )}
    </div>
  );
}