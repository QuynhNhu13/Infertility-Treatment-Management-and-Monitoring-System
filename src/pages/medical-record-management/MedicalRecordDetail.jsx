import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  GET_MEDICAL_RECORD,
  UPDATE_MEDICAL_RECORD,
  DELETE_ULTRASOUND,
} from "../../api/apiUrls";
import LabTestRequestModal from "../lab-test-management/LabTestRequestModal";
import InitUltrasoundModal from "../ultrasound-management/InitUltrasoundModal";
import UltrasoundImageFetcher from "../ultrasound-management/UltrasoundImageFetcher";
import TreatmentPlan from "../treatment-plan/TreatmentPlan";


export default function MedicalRecordDetail() {
  const { getJsonAuthHeader, getAuthHeader } = useAuth();
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
  const [showLabModal, setShowLabModal] = useState(false);

  const [showUltrasoundModal, setShowUltrasoundModal] = useState(false);
  const [selectedUltrasound, setSelectedUltrasound] = useState(null);

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
      setUpdateMessage(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUltrasoundSuccess = useCallback((newData) => {
    setRecord((prev) => ({
      ...prev,
      initUltrasounds: [...(prev.initUltrasounds || []), newData],
    }));
    setShowUltrasoundModal(false);
    setSelectedUltrasound(null);
  }, []);

  const handleUltrasoundDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa kết quả siêu âm này?")) return;
    try {
      const res = await fetch(DELETE_ULTRASOUND(id), {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (res.ok) {
        setRecord((prev) => ({
          ...prev,
          initUltrasounds: prev.initUltrasounds.filter((us) => us.id !== id),
        }));
      }
    } catch (err) {
      console.error("Lỗi khi xóa siêu âm:", err);
    }
  };

  const renderUltrasoundResults = () => {
    const ultrasounds = record?.initUltrasounds || [];

    return (
      <div className="mr-card">
        <div className="mr-card-header">
          <h2>Kết quả siêu âm</h2>
          <button
            className="mr-create-btn"
            onClick={() => {
              setSelectedUltrasound(null);
              setShowUltrasoundModal(true);
            }}
          >
            Cập nhật kết quả siêu âm
          </button>
        </div>
        <div className="mr-card-body">
          {ultrasounds.length > 0 ? (
            <div className="mr-ultrasound-results">
              {ultrasounds.map((us) => (
                <div key={us.id} className="mr-ultrasound-item">
                  <div className="mr-ultrasound-header">
                    <div><strong>Ngày:</strong> {formatDate(us.date)}</div>
                    <div><strong>Kết quả:</strong> {us.result}</div>
                    <div className="mr-ultrasound-actions">
                      <button onClick={() => {
                        setSelectedUltrasound(us);
                        setShowUltrasoundModal(true);
                      }}>
                        Cập nhật
                      </button>
                      <button onClick={() => handleUltrasoundDelete(us.id)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                  <UltrasoundImageFetcher id={us.id} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mr-empty-msg">
              <span>Chưa có kết quả siêu âm</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLabTestResults = () => (
    <div className="mr-card">
      <div className="mr-card-header">
        <h2>Kết quả xét nghiệm</h2>
        <button className="mr-create-btn" onClick={() => setShowLabModal(true)}>
          Yêu cầu xét nghiệm
        </button>
      </div>
      <div className="mr-card-body">
        {labResults.length > 0 ? (
          <div className="mr-test-results">
            {labResults.map((test) => (
              <div key={test.id} className="mr-test-item">
                <div className="mr-test-header">
                  <span className="mr-test-name">{test.labTestName}</span>
                  <span className={`mr-test-status ${test.status.toLowerCase()}`}>
                    {translateStatus(test.status)}
                  </span>
                </div>
                <div className="mr-test-details">
                  <div><strong>Ngày:</strong> {formatDate(test.testDate)}</div>
                  <div><strong>Nhân viên:</strong> {test.staffFullName || "Chưa rõ"}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mr-empty-msg">
            <span>Chưa có kết quả xét nghiệm</span>
          </div>
        )}
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
        <div><strong>Ngày tạo:</strong> {formatDate(record.createdAt)}</div>
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

            {renderLabTestResults()}
            {renderUltrasoundResults()}
          </div>
        )}

        {activeTab === TABS.TREATMENT && (
  <TreatmentPlan medicalRecordId={recordId} />
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

      {showUltrasoundModal && (
        <InitUltrasoundModal
          isOpen={true}
          onClose={() => {
            setShowUltrasoundModal(false);
            setSelectedUltrasound(null);
          }}
          medicalRecordId={recordId}
          onSuccess={handleUltrasoundSuccess}
          initialData={selectedUltrasound}
        />
      )}
    </div>
  );
}
