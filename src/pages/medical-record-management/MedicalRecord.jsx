import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { MEDICAL_RECORD, GET_LAB_TEST_RESULTS, DELETE_ULTRASOUND } from "../../api/apiUrls";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/medical-record-management/MedicalRecord.css";

import MedicalRecordCreate from "./MedicalRecordCreate";
import LabTestRequestModal from "./LabTestRequestModal";
import InitUltrasoundModal from "./InitUltrasoundModal";
import UltrasoundImageFetcher from "./UltrasoundImageFetcher";
import LabTestResultView from "./LabTestResultView";
import TreatmentPlan from "./TreatmentPlan";

const TABS = {
  INIT: "init",
  TREATMENT: "treatment",
  OVERVIEW: "overview"
};

const STATUS_TRANSLATIONS = {
  COMPLETED: "Đã hoàn thành",
  PROCESSING: "Đang xử lý"
};

export default function MedicalRecord() {
  const { accountId } = useParams();
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [labResults, setLabResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [showUltrasoundForm, setShowUltrasoundForm] = useState(false);
  const [selectedLabTestId, setSelectedLabTestId] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.INIT);
const [selectedUltrasound, setSelectedUltrasound] = useState(null); 


  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "Chưa có";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  }, []);

  const translateStatus = useCallback((status) => {
    return STATUS_TRANSLATIONS[status] || status;
  }, []);

  const fetchMedicalRecord = useCallback(async () => {
    const headers = getAuthHeader();
    const response = await fetch(MEDICAL_RECORD(accountId), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu hồ sơ bệnh án.");
    }

    const data = await response.json();
    return data.data;
  }, [accountId, getAuthHeader]);

  const fetchLabResults = useCallback(async (recordId) => {
    const headers = getAuthHeader();
    const response = await fetch(GET_LAB_TEST_RESULTS(recordId), {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu xét nghiệm.");
    }

    const data = await response.json();
    return data.data || [];
  }, [getAuthHeader]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const recordData = await fetchMedicalRecord();
      setRecord(recordData);

      if (recordData?.id) {
        const labData = await fetchLabResults(recordData.id);
        setLabResults(labData);
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [fetchMedicalRecord, fetchLabResults]);

  useEffect(() => {
    if (accountId) {
      fetchData();
    } else {
      setError("Không tìm thấy mã tài khoản");
      setLoading(false);
    }
  }, [accountId, fetchData]);

  const handleCreateFormToggle = useCallback(() => {
    setShowCreateForm(prev => !prev);
  }, []);

  const handleMedicalRecordSuccess = useCallback((updatedData) => {
    setRecord(prev => ({ ...prev, ...updatedData }));
    setShowCreateForm(false);
  }, []);

  const handleLabModalClose = useCallback(() => {
    setShowLabModal(false);
  }, []);

  const handleLabTestSuccess = useCallback(() => {
    window.location.reload();
  }, []);

const handleUltrasoundModalClose = useCallback(() => {
  setShowUltrasoundForm(false);
  setSelectedUltrasound(null); 
}, []);

  const handleUltrasoundSuccess = useCallback((newData) => {
    setRecord(prev => ({
      ...prev,
      initUltrasounds: [...(prev.initUltrasounds || []), newData],
    }));
    setShowUltrasoundForm(false);
  }, []);

  const handleLabTestResultClose = useCallback(() => {
    setSelectedLabTestId(null);
  }, []);

  const handleUltrasoundDelete = async (usId) => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa kết quả siêu âm này?")) return;
  try {
    const res = await fetch(DELETE_ULTRASOUND(usId), {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    if (res.ok) {
      setRecord((prev) => ({
        ...prev,
        initUltrasounds: prev.initUltrasounds.filter((u) => u.id !== usId),
      }));
    }
  } catch (err) {
    console.error("Lỗi khi xóa siêu âm:", err);
  }
};


  const renderPatientInfo = () => {
    if (!record) return null;

    const patientFields = [
      { label: "Họ và tên", value: record.fullName },
      { label: "Giới tính", value: record.gender },
      { label: "Ngày sinh", value: formatDate(record.dob) },
      { label: "SĐT", value: record.phoneNumber },
      { label: "CCCD", value: record.identityNumber },
      { label: "Quốc tịch", value: record.nationality },
      { label: "Số BHYT", value: record.insuranceNumber },
      { label: "Ngày tạo", value: formatDate(record.createdAt) },
    ];

    return (
      <div className="mr-card">
        <div className="mr-card-header">
          <h2>Thông tin bệnh nhân</h2>
        </div>
        <div className="mr-card-body">
          <div className="mr-grid">
            {patientFields.map((field, index) => (
              <div key={index} className="mr-item">
                <label>{field.label}:</label>
                <span>{field.value || "Chưa có"}</span>
              </div>
            ))}
            <div className="mr-item mr-full">
              <label>Địa chỉ:</label>
              <span>{record.address || "Chưa có"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMedicalInfo = () => {
    if (!record) return null;

    const hasExistingInfo = record.symptoms || record.diagnosis;
    const buttonText = showCreateForm 
      ? "Đóng" 
      : hasExistingInfo 
        ? "Cập nhật thông tin" 
        : "Thêm thông tin y tế";

    return (
      <div className="mr-card">
        <div className="mr-card-header">
          <h2>Thông tin y tế</h2>
          <button className="mr-create-btn" onClick={handleCreateFormToggle}>
            {buttonText}
          </button>
        </div>
        <div className="mr-card-body">
          {showCreateForm ? (
            <MedicalRecordCreate
              medicalRecordId={record.id}
              onSuccess={handleMedicalRecordSuccess}
            />
          ) : (
            <div className="mr-medical">
              <div className="mr-medical-item">
                <label>Triệu chứng:</label>
                <div className="mr-medical-content">
                  {record.symptoms || "Chưa có thông tin"}
                </div>
              </div>
              <div className="mr-medical-item">
                <label>Chẩn đoán ban đầu:</label>
                <div className="mr-medical-content">
                  {record.diagnosis || "Chưa có thông tin"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLabTestResults = () => {
    const sortedLabResults = [...labResults].sort(
      (a, b) => new Date(b.testDate) - new Date(a.testDate)
    );

    return (
      <div className="mr-card">
        <div className="mr-card-header">
          <h2>Kết quả xét nghiệm</h2>
          <button className="mr-create-btn" onClick={() => setShowLabModal(true)}>
            Yêu cầu xét nghiệm
          </button>
        </div>
        <div className="mr-card-body">
          {sortedLabResults.length > 0 ? (
            <div className="mr-test-results">
              {sortedLabResults.map((test) => (
                <div key={test.id} className="mr-test-item">
                  <div className="mr-test-header">
                    <span className="mr-test-name">{test.labTestName}</span>
                    <span className={`mr-test-status ${test.status.toLowerCase()}`}>
                      {translateStatus(test.status)}
                    </span>
                  </div>
                  <div className="mr-test-details">
                    <div><strong>Ngày:</strong> {formatDate(test.testDate)}</div>
                    <div><strong>Nhân viên:</strong> {test.staffFullName}</div>
                  </div>
                  {test.status === "COMPLETED" && (
                    <button 
                      className="mr-view-btn" 
                      onClick={() => setSelectedLabTestId(test.id)}
                    >
                      Xem kết quả
                    </button>
                  )}
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
  };

  const renderUltrasoundResults = () => {
  const ultrasounds = record?.initUltrasounds || [];

  return (
    <div className="mr-card">
      <div className="mr-card-header">
        <h2>Kết quả siêu âm</h2>
        <button 
          className="mr-create-btn" 
          onClick={() => setShowUltrasoundForm(true)}
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
  setShowUltrasoundForm(true);
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


  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.INIT:
        return (
          <div className="mr-tab-content">
            {renderMedicalInfo()}
            {renderLabTestResults()}
            {renderUltrasoundResults()}
          </div>
        );
      case TABS.TREATMENT:
        return (
          <div className="mr-tab-content">
<TreatmentPlan medicalRecordId={record.id} />
          </div>
        );
      case TABS.OVERVIEW:
        return (
          <div className="mr-tab-content">
            <div className="mr-card">
              <div className="mr-card-header">
                <h2>Tổng quan buổi khám</h2>
              </div>
              <div className="mr-card-body">
                <div className="mr-empty-msg">
                  <span>Chức năng đang được phát triển</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTabs = () => {
    const tabs = [
      { key: TABS.INIT, label: "Thông tin ban đầu" },
      { key: TABS.TREATMENT, label: "Phác đồ điều trị" },
      { key: TABS.OVERVIEW, label: "Tổng quan buổi khám" }
    ];

    return (
      <div className="mr-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`mr-tab-item ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mr-container">
        <div className="mr-loading">
          <div className="mr-spinner"></div>
          <p>Đang tải dữ liệu hồ sơ bệnh án...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mr-container">
        <div className="mr-error">
          <div className="mr-error-icon">!</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mr-container">
        <div className="mr-no-data">
          <p>Không có dữ liệu hồ sơ bệnh án</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mr-fullscreen-wrapper">
        <div className="mr-container">
          <div className="mr-back-btn" onClick={() => navigate(-1)}>
            ← Quay lại
          </div>

          <div className="mr-header">
            <h1>Hồ sơ bệnh án</h1>
            <div className="mr-record-id">Mã hồ sơ: {record.id}</div>
          </div>

          {renderPatientInfo()}
          {renderTabs()}
          {renderTabContent()}
        </div>
      </div>

      {selectedLabTestId && (
        <LabTestResultView
          labTestId={selectedLabTestId}
          onClose={handleLabTestResultClose}
        />
      )}

      {showLabModal && record?.id && (
        <LabTestRequestModal
          recordId={record.id}
          onClose={handleLabModalClose}
          onSuccess={handleLabTestSuccess}
        />
      )}

      {showUltrasoundForm && (
<InitUltrasoundModal
  isOpen={showUltrasoundForm}
  onClose={handleUltrasoundModalClose}
  medicalRecordId={record.id}
  onSuccess={handleUltrasoundSuccess}
  initialData={selectedUltrasound}
/>

      )}
    </>
  );
}