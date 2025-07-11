import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MEDICAL_RECORD, GET_LAB_TEST_RESULTS } from "../../api/apiUrls";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/medical-record-management/MedicalRecord.css";
import MedicalRecordCreate from "./MedicalRecordCreate";
import LabTestRequestModal from "./LabTestRequestModal";
import InitUltrasoundModal from "./InitUltrasoundModal";
import UltrasoundImageFetcher from "./UltrasoundImageFetcher";
import LabTestResultView from "./LabTestResultView";

export default function MedicalRecord() {
  const { accountId } = useParams();
  const { getAuthHeader } = useAuth();
  const [record, setRecord] = useState(null);
  const [labResults, setLabResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [showUltrasoundForm, setShowUltrasoundForm] = useState(false);
  const [selectedLabTestId, setSelectedLabTestId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeader();

        const recordRes = await fetch(MEDICAL_RECORD(accountId), {
          method: "GET",
          headers,
        });

        if (!recordRes.ok) throw new Error("Không thể lấy dữ liệu hồ sơ bệnh án.");
        const recordData = await recordRes.json();
        setRecord(recordData.data);

        const recordId = recordData.data?.id;
        if (recordId) {
          const labRes = await fetch(GET_LAB_TEST_RESULTS(recordId), {
            method: "GET",
            headers,
          });

          if (!labRes.ok) throw new Error("Không thể lấy dữ liệu xét nghiệm.");
          const labData = await labRes.json();
          setLabResults(labData.data || []);
        }
      } catch (err) {
        console.error("Lỗi:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchData();
    } else {
      setError("Không tìm thấy mã tài khoản");
      setLoading(false);
    }
  }, [accountId, getAuthHeader]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa có";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Đã hoàn thành";
      case "PROCESSING":
        return "Đang xử lý";
      default:
        return status;
    }
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
          <div className="mr-back-btn" onClick={() => navigate(-1)}>← Quay lại</div>

          <div className="mr-header">
            <h1>Hồ sơ bệnh án</h1>
            <div className="mr-record-id">Mã hồ sơ: {accountId}</div>
          </div>

          <div className="mr-content">
            {/* Thông tin bệnh nhân */}
            <div className="mr-card">
              <div className="mr-card-header"><h2>Thông tin bệnh nhân</h2></div>
              <div className="mr-card-body">
                <div className="mr-grid">
                  <div className="mr-item"><label>Họ và tên:</label><span>{record.fullName || "Chưa có"}</span></div>
                  <div className="mr-item"><label>Giới tính:</label><span>{record.gender || "Chưa có"}</span></div>
                  <div className="mr-item"><label>Ngày sinh:</label><span>{formatDate(record.dob)}</span></div>
                  <div className="mr-item"><label>SĐT:</label><span>{record.phoneNumber || "Chưa có"}</span></div>
                  <div className="mr-item"><label>CCCD:</label><span>{record.identityNumber || "Chưa có"}</span></div>
                  <div className="mr-item"><label>Quốc tịch:</label><span>{record.nationality || "Chưa có"}</span></div>
                  <div className="mr-item mr-full"><label>Địa chỉ:</label><span>{record.address || "Chưa có"}</span></div>
                  <div className="mr-item"><label>Số BHYT:</label><span>{record.insuranceNumber || "Chưa có"}</span></div>
                  <div className="mr-item"><label>Ngày tạo:</label><span>{formatDate(record.createdAt)}</span></div>
                </div>
              </div>
            </div>

            {/* Thông tin y tế */}
            <div className="mr-card">
              <div className="mr-card-header">
                <h2>Thông tin y tế</h2>
                <button className="mr-create-btn" onClick={() => setShowCreateForm((prev) => !prev)}>
                  {showCreateForm ? "Đóng" : (record.symptoms || record.diagnosis ? "Cập nhật thông tin" : "Thêm thông tin y tế")}
                </button>
              </div>
              <div className="mr-card-body">
                {showCreateForm ? (
                  <MedicalRecordCreate
                    medicalRecordId={record.id}
                    onSuccess={(updatedData) => {
                      setRecord({ ...record, ...updatedData });
                      setShowCreateForm(false);
                    }}
                  />
                ) : (
                  <div className="mr-medical">
                    <div className="mr-medical-item">
                      <label>Triệu chứng:</label>
                      <div className="mr-medical-content">{record.symptoms || "Chưa có thông tin"}</div>
                    </div>
                    <div className="mr-medical-item">
                      <label>Chẩn đoán ban đầu:</label>
                      <div className="mr-medical-content">{record.diagnosis || "Chưa có thông tin"}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Kết quả xét nghiệm */}
            <div className="mr-card">
              <div className="mr-card-header">
                <h2>Kết quả xét nghiệm</h2>
                <button className="mr-create-btn" onClick={() => setShowLabModal(true)}>Yêu cầu xét nghiệm</button>
              </div>
              <div className="mr-card-body">
                {labResults.length > 0 ? (
                  <div className="mr-test-results">
                    {labResults
                      .sort((a, b) => new Date(b.testDate) - new Date(a.testDate))
                      .map((test) => (
                        <div key={test.id} className="mr-test-item">
                          <div className="mr-test-header">
                            <span className="mr-test-name">{test.labTestName}</span>
                            <span className={`mr-test-status ${test.status === "COMPLETED" ? "completed" : "processing"}`}>
                              {translateStatus(test.status)}
                            </span>
                          </div>
                          <div className="mr-test-details">
                            <div><strong>Ngày:</strong> {formatDate(test.testDate)}</div>
                            <div><strong>Nhân viên:</strong> {test.staffFullName}</div>
                          </div>
                          {test.status === "COMPLETED" && (
                            <button className="mr-view-btn" onClick={() => setSelectedLabTestId(test.id)}>
                              Xem kết quả
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="mr-empty-msg"><span>Chưa có kết quả xét nghiệm</span></div>
                )}
              </div>
            </div>

            {/* Kết quả siêu âm */}
            <div className="mr-card">
              <div className="mr-card-header">
                <h2>Kết quả siêu âm</h2>
                <button className="mr-create-btn" onClick={() => setShowUltrasoundForm(true)}>Cập nhật kết quả siêu âm</button>
              </div>
              <div className="mr-card-body">
                {record.initUltrasounds?.length > 0 ? (
                  <div className="mr-ultrasound-results">
                    {record.initUltrasounds.map((us, idx) => (
                      <div key={idx} className="mr-ultrasound-item">
                        <div className="mr-ultrasound-header">
                          <div><strong>Ngày:</strong> {formatDate(us.date)}</div>
                          <div><strong>Kết quả:</strong> {us.result}</div>
                        </div>
                        <UltrasoundImageFetcher id={us.id} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mr-empty-msg"><span>Chưa có kết quả siêu âm</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {selectedLabTestId && (
        <LabTestResultView
          labTestId={selectedLabTestId}
          onClose={() => setSelectedLabTestId(null)}
        />
      )}

      {showLabModal && record?.id && (
        <LabTestRequestModal
          recordId={record.id}
          onClose={() => setShowLabModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {showUltrasoundForm && (
        <InitUltrasoundModal
          isOpen={showUltrasoundForm}
          onClose={() => setShowUltrasoundForm(false)}
          medicalRecordId={record.id}
          onSuccess={(newData) => {
            setRecord((prev) => ({
              ...prev,
              initUltrasounds: [...(prev.initUltrasounds || []), newData],
            }));
            setShowUltrasoundForm(false);
          }}
        />
      )}
    </>
  );
}
