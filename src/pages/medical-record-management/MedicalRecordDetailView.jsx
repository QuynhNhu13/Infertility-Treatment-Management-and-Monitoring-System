import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GET_MEDICAL_RECORD } from "../../api/apiUrls";
import UltrasoundImageFetcher from "../ultrasound-management/UltrasoundImageFetcher";
import TreatmentPlan from "../treatment-plan-management/TreatmentPlan";
import "../../styles/medical-record-management/MedicalRecordDetail.css";
import HeaderPage from "../../components/HeaderPage";

export default function MedicalRecordDetailView() {
  const { getJsonAuthHeader } = useAuth();
  const { recordId } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const renderUltrasoundResults = () => {
    const ultrasounds = record?.initUltrasounds || [];

    return (
      <div className="mr-detail-card">
        <div className="mr-detail-card-header">
          <h2>Kết quả siêu âm</h2>
        </div>
        <div className="mr-detail-card-body">
          {ultrasounds.length > 0 ? (
            <div className="mr-detail-ultrasound-results">
              {ultrasounds.map((us) => (
                <div key={us.id} className="mr-detail-ultrasound-item">
                  <div className="mr-detail-ultrasound-header">
                    <div><strong>Ngày:</strong> {formatDate(us.date)}</div>
                    <div><strong>Kết quả:</strong> {us.result}</div>
                  </div>
                  <UltrasoundImageFetcher id={us.id} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mr-detail-empty-msg">
              <span>Chưa có kết quả siêu âm</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLabTestResults = () => {
    const labResults = record?.initLabTestResults || [];

    return (
      <div className="mr-detail-card">
        <div className="mr-detail-card-header">
          <h2>Kết quả xét nghiệm</h2>
        </div>
        <div className="mr-detail-card-body">
          {labResults.length > 0 ? (
            <div className="mr-detail-test-results">
              {labResults.map((test) => (
                <div key={test.id} className="mr-detail-test-item">
                  <div className="mr-detail-test-header">
                    <span className="mr-detail-test-name">{test.labTestName}</span>
                    <span className={`mr-detail-test-status ${test.status.toLowerCase()}`}>
                      {translateStatus(test.status)}
                    </span>
                  </div>

                  <div className="mr-detail-test-details">
                    <div><strong>Ngày:</strong> {formatDate(test.testDate)}</div>
                    <div><strong>Nhân viên:</strong> {test.staffFullName || "Chưa rõ"}</div>
                  </div>

                  {test.status === "COMPLETED" && (
                    <div className="mr-detail-test-result">
                      <div><strong>Kết quả tóm tắt:</strong> {test.resultSummary || "Không có"}</div>
                      <div><strong>Chi tiết kết quả:</strong> {test.resultDetails || "Không có"}</div>
                      <div><strong>Ghi chú:</strong> {test.notes || "Không có"}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mr-detail-empty-msg">
              <span>Chưa có kết quả xét nghiệm</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <p>Đang tải hồ sơ...</p>;
  if (error) return <p className="mr-detail-error">{error}</p>;
  if (!record) return <p>Không tìm thấy hồ sơ</p>;

  return (
    <div className="medical-record-detail">
      <HeaderPage />
      <button
        onClick={() => navigate(-1)}
        className="treatment-session-page__back-btn"
      >
        ←
      </button>
      <h2>Chi tiết hồ sơ bệnh án</h2>

      <div className="mr-detail-patient-info">
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

      <div className="mr-detail-tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`mr-detail-tab-button ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mr-detail-tab-content">
        {activeTab === TABS.INIT && (
          <div className="mr-detail-init-tab">
            <div className="mr-detail-medical-section">
              <h3>Thông tin y tế</h3>
              <div><strong>Triệu chứng:</strong> {record.symptoms || "Chưa cập nhật"}</div>
              <div><strong>Chẩn đoán ban đầu:</strong> {record.diagnosis || "Chưa cập nhật"}</div>
            </div>

            {renderLabTestResults()}
            {renderUltrasoundResults()}
          </div>
        )}

        {activeTab === TABS.TREATMENT && (
          <TreatmentPlan medicalRecordId={recordId} />
        )}
      </div>
    </div>
  );
}
