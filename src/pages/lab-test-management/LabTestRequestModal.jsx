import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { LAB_TEST, LAB_TEST_RESULT_INIT } from "../../api/apiUrls";
import { Search, X, ClipboardList } from "lucide-react";
import "../../styles/lab-test-management/LabTestRequestModal.css";

const LabTestRequestModal = ({ recordId, onClose, onSuccess }) => {
  const { getJsonAuthHeader } = useAuth();
  const [labTests, setLabTests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLabTests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(LAB_TEST, {
          headers: getJsonAuthHeader(),
        });
        setLabTests(res.data.data || []);
      } catch (err) {
        setError("Không thể tải danh sách xét nghiệm.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLabTests();
  }, [getJsonAuthHeader]);

  const handleToggle = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const handleSelectAll = () => {
    const filtered = labTests.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const ids = filtered.map((t) => t.id);
    const allSelected = ids.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  };

  const handleSubmit = async () => {
    if (!selectedIds.length) return;

    const numericRecordId =
      typeof recordId === "object" && recordId.id ? recordId.id : parseInt(recordId, 10);

    if (isNaN(numericRecordId)) {
      setError("ID hồ sơ không hợp lệ.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      console.log("Gửi yêu cầu với recordId:", numericRecordId); 
      await axios.post(
        LAB_TEST_RESULT_INIT(numericRecordId),
        { testIds: selectedIds },
        { headers: getJsonAuthHeader() }
      );

      onSuccess();
      onClose();
    } catch (err) {
      setError("Gửi yêu cầu thất bại. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTests = labTests.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedCount = selectedIds.length;
  const allFilteredSelected =
    filteredTests.length > 0 &&
    filteredTests.every((t) => selectedIds.includes(t.id));

  return (
    <div className="lab-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lab-modal-content">
        <div className="lab-modal-header">
          <div>
            <h2 className="lab-modal-title">Chọn xét nghiệm</h2>
            <p className="lab-modal-subtitle">Chọn các xét nghiệm cần thực hiện cho bệnh nhân</p>
          </div>
          <button className="lab-modal-close-btn" onClick={onClose} aria-label="Đóng modal">
            <X size={20} />
          </button>
        </div>

        <div className="lab-modal-body">
          {error && <div className="lab-modal-error">{error}</div>}

          <div className="lab-modal-controls">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm xét nghiệm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="selection-info">
              <span>Đã chọn: <strong>{selectedCount}</strong></span>
              {filteredTests.length > 0 && (
                <button className="select-all-btn" onClick={handleSelectAll}>
                  {allFilteredSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </button>
              )}
            </div>
          </div>

          <div className="lab-modal-options">
            {loading ? (
              <div className="loading-container"><p>Đang tải...</p></div>
            ) : filteredTests.length === 0 ? (
              <div className="no-results"><p>Không có kết quả phù hợp</p></div>
            ) : (
              filteredTests.map((test) => (
                <label key={test.id} className="lab-modal-option">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(test.id)}
                    onChange={() => handleToggle(test.id)}
                  />
                  <span className="lab-test-name">{test.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="lab-modal-footer">
          <div className="lab-modal-actions">
            <button
              className="lab-modal-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              className="lab-modal-submit"
              onClick={handleSubmit}
              disabled={!selectedIds.length || submitting}
            >
              {submitting ? (
                "Đang gửi..."
              ) : (
                <>
                  <ClipboardList size={16} />
                  Gửi yêu cầu ({selectedIds.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestRequestModal;
