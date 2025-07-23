import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GET_MEDICAL_RECORD, UPDATE_MEDICAL_RECORD } from "../../api/apiUrls";
import LabTestRequestModal from "../lab-test-management/LabTestRequestModal";
// Placeholder cho modal yêu cầu siêu âm
// import UltrasoundRequestModal from "../ultrasound-management/UltrasoundRequestModal";

export default function MedicalRecordDetail() {
  const { getJsonAuthHeader } = useAuth();
  const { recordId } = useParams();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const [labResults, setLabResults] = useState([]);
  const [ultrasoundResults, setUltrasoundResults] = useState([]);
  const [showLabModal, setShowLabModal] = useState(false);
  const [showUltrasoundModal, setShowUltrasoundModal] = useState(false); // ✅

  const TABS = {
    INIT: "init",
    TREATMENT: "treatment",
  };
  const [activeTab, setActiveTab] = useState(TABS.INIT);

  const tabs = [
    { key: TABS.INIT, label: "Thông tin ban đầu" },
    { key: TABS.TREATMENT, label: "Phác đồ điều trị" },
  ];

  const STATUS_TRANSLATIONS = {
    COMPLETED: "Đã hoàn thành",
    PROCESSING: "Đang xử lý",
  };

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "Chưa có";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  }, []);

  const translateStatus = useCallback(
    (status) => STATUS_TRANSLATIONS[status] || status,
    []
  );

  const fetchRecord = useCallback(async () => {
    try {
      const response = await fetch(GET_MEDICAL_RECORD(recordId), {
        headers: getJsonAuthHeader(),
      });

      const result = await response.json();
      if (response.ok && result.data) {
        setRecord(result.data);
        setDiagnosis(result.data.diagnosis || "");
        setSymptoms(result.data.symptoms || "");
        setLabResults(result.data.initLabTestResults || []);
        setUltrasoundResults(result.data.initUltrasounds || []);
      } else {
        throw new Error(result.message || "Không thể tải hồ sơ");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [recordId, getJsonAuthHeader]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  const handleUpdate = async () => {
    setUpdating(true);
    setUpdateMessage("");

    try {
      const response = await fetch(UPDATE_MEDICAL_RECORD(recordId), {
        method: "PUT",
        headers: getJsonAuthHeader(),
        body: JSON.stringify({ diagnosis, symptoms }),
      });

      const result = await response.json();

      if (response.ok) {
        setUpdateMessage("Cập nhật thành công!");
        setRecord(result.data);
        setIsEditing(false);
      } else {
        throw new Error(result.message || "Lỗi khi cập nhật");
      }
    } catch (err) {
      setUpdateMessage(`${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const renderResultSection = (title, results, onRequest) => (
  <div className="mr-card">
    <div className="mr-card-header">
      <h2>{title}</h2>
      {onRequest && (
        <button className="mr-create-btn" onClick={onRequest}>
          Yêu cầu {title.toLowerCase()}
        </button>
      )}
    </div>
    <div className="mr-card-body">
      {results.length > 0 ? (
        <div className="mr-test-results">
          {results.map((test) => (
            <div key={test.id} className="mr-test-item">
              <div className="mr-test-header">
                <span className="mr-test-name">{test.labTestName || test.ultrasoundName}</span>
                <span className={`mr-test-status ${test.status?.toLowerCase()}`}>
                  {translateStatus(test.status)}
                </span>
              </div>

              <div className="mr-test-details">
                <div><strong>Ngày:</strong> {formatDate(test.testDate)}</div>
                <div><strong>Nhân viên:</strong> {test.staffFullName || "Chưa rõ"}</div>

                {test.status === "COMPLETED" && (
                  <>
                    <div><strong>Tóm tắt kết quả:</strong> {test.resultSummary || "Không có"}</div>
                    <div><strong>Chi tiết:</strong> {test.resultDetails || "Không có"}</div>
                    <div><strong>Ghi chú:</strong> {test.notes || "Không có"}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mr-empty-msg">
          <span>Chưa có {title.toLowerCase()}</span>
        </div>
      )}
    </div>
  </div>
);


  const renderTreatmentPlan = () => (
    <div className="treatment-plan-section">
      <div className="mr-card">
        <div className="mr-card-header">
          <h2>Phác đồ điều trị</h2>
          <button className="mr-create-btn">Thêm phác đồ</button>
        </div>
        <div className="mr-card-body">
          <div className="mr-empty-msg">
            <span>Chưa có phác đồ điều trị nào</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <p>Đang tải hồ sơ...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!record) return <p>Không tìm thấy hồ sơ</p>;

  return (
    <div className="medical-record-detail">
      <h2>Chi tiết hồ sơ bệnh án</h2>

      <div className="patient-info">
        <div><strong>Họ tên:</strong> {record.fullName}</div>
        <div><strong>Ngày sinh:</strong> {record.dob}</div>
        <div><strong>Giới tính:</strong> {record.gender || "Chưa cập nhật"}</div>
        <div><strong>Số điện thoại:</strong> {record.phoneNumber || "Chưa cập nhật"}</div>
        <div><strong>Địa chỉ:</strong> {record.address}</div>
        <div><strong>CMND/CCCD:</strong> {record.identityNumber}</div>
        <div><strong>Quốc tịch:</strong> {record.nationality}</div>
        <div><strong>Số BHYT:</strong> {record.insuranceNumber}</div>
        <div><strong>Ngày tạo:</strong> {record.createdAt}</div>
      </div>

      <hr />

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === TABS.INIT && (
          <div className="init-tab">
            <div className="medical-section">
              <div className="section-header">
                <h3>Thông tin y tế</h3>
                <button onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Ẩn" : "Cập nhật thông tin"}
                </button>
              </div>

              {!isEditing ? (
                <>
                  <div><strong>Triệu chứng:</strong> {record.symptoms || "Chưa cập nhật"}</div>
                  <div><strong>Chẩn đoán ban đầu:</strong> {record.diagnosis || "Chưa cập nhật"}</div>
                </>
              ) : (
                <>
                  <div>
                    <label><strong>Triệu chứng:</strong></label><br />
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      rows={3}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div>
                    <label><strong>Chẩn đoán ban đầu:</strong></label><br />
                    <textarea
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      rows={3}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <button onClick={handleUpdate} disabled={updating}>
                    {updating ? "Đang cập nhật..." : "Lưu thông tin"}
                  </button>
                </>
              )}
              {updateMessage && <p style={{ marginTop: "10px" }}>{updateMessage}</p>}
            </div>

            {renderResultSection("Kết quả xét nghiệm", labResults, () => setShowLabModal(true))}
            {renderResultSection("Kết quả siêu âm", ultrasoundResults, () => setShowUltrasoundModal(true))}
          </div>
        )}

        {activeTab === TABS.TREATMENT && (
          <div className="treatment-tab">
            {renderTreatmentPlan()}
          </div>
        )}
      </div>

      {showLabModal && (
        <LabTestRequestModal
          recordId={recordId}
          onClose={() => setShowLabModal(false)}
          onSuccess={() => {
            setShowLabModal(false);
            fetchRecord();
          }}
        />
      )}

      {/* Tạm placeholder cho modal yêu cầu siêu âm */}
      {showUltrasoundModal && (
        <div className="modal-placeholder">
          <div className="modal-backdrop" onClick={() => setShowUltrasoundModal(false)} />
          <div className="modal-content">
            <h3>Yêu cầu siêu âm (tạm placeholder)</h3>
            <button onClick={() => setShowUltrasoundModal(false)}>Đóng</button>
          </div>
        </div>
        // <UltrasoundRequestModal
        //   recordId={recordId}
        //   onClose={() => setShowUltrasoundModal(false)}
        //   onSuccess={() => {
        //     setShowUltrasoundModal(false);
        //     fetchRecord();
        //   }}
        // />
      )}
    </div>
  );
}
