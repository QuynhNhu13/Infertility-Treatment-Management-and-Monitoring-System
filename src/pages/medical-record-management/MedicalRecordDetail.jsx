import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GET_MEDICAL_RECORD, UPDATE_MEDICAL_RECORD } from "../../api/apiUrls";

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

  const STATUS_TRANSLATIONS = {
    COMPLETED: "Đã hoàn thành",
    PROCESSING: "Đang xử lý"
  };

  const [labResults] = useState([]);
  const [ultrasoundResults] = useState([]); 
  const [selectedLabTestId] = useState(null);
  const [showLabModal] = useState(false);

  const TABS = {
    INIT: "init",
    TREATMENT: "treatment",
  };
  
  const [activeTab, setActiveTab] = useState(TABS.INIT);
  
  const tabs = [
    { key: TABS.INIT, label: "Thông tin ban đầu" },
    { key: TABS.TREATMENT, label: "Phác đồ điều trị" },
  ];

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
    [STATUS_TRANSLATIONS]
  );

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(GET_MEDICAL_RECORD(recordId), {
          headers: getJsonAuthHeader(),
        });

        const result = await response.json();
        if (response.ok && result.data) {
          setRecord(result.data);
          setDiagnosis(result.data.diagnosis || "");
          setSymptoms(result.data.symptoms || "");
        } else {
          throw new Error(result.message || "Không thể tải hồ sơ");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [recordId, getJsonAuthHeader]);

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

  const renderResultSection = (title, results) => (
    <div className="mr-card">
      <div className="mr-card-header">
        <h2>{title}</h2>
        <button className="mr-create-btn">Yêu cầu {title.toLowerCase()}</button>
      </div>
      <div className="mr-card-body">
        {results.length > 0 ? (
          <div className="mr-test-results">
            {results.map((test) => (
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
                  <button className="mr-view-btn">Xem kết quả</button>
                )}
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
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
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

            {renderResultSection("Kết quả xét nghiệm", labResults)}

            {renderResultSection("Kết quả siêu âm", ultrasoundResults)}
          </div>
        )}

        {activeTab === TABS.TREATMENT && (
          <div className="treatment-tab">
            {renderTreatmentPlan()}
          </div>
        )}
      </div>
    </div>
  );
}