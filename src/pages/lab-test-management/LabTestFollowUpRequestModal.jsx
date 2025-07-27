import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { LAB_TEST, LAB_TEST_FOLLOW_UP } from "../../api/apiUrls";
import { Search, X, ClipboardList, Loader } from "lucide-react";
import "../../styles/lab-test-management/LabTestFollowUpRequestModal.css";

const LabTestFollowUpRequestModal = ({ recordId, sessionId, onClose, onSuccess }) => {
  const { getJsonAuthHeader } = useAuth();
  const [labTests, setLabTests] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTests = React.useMemo(() => {
    if (!searchTerm.trim()) return labTests;
    return labTests.filter(test =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [labTests, searchTerm]);

  const fetchLabTests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(LAB_TEST, {
        headers: getJsonAuthHeader(),
      });

      const data = response.data?.data || [];
      setLabTests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching lab tests:", err);
      setError("Không thể tải danh sách xét nghiệm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [getJsonAuthHeader]);

  useEffect(() => {
    fetchLabTests();
  }, [fetchLabTests]);

  const handleToggle = useCallback((id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    const filteredIds = filteredTests.map(test => test.id);
    const allSelected = filteredIds.every(id => selectedIds.includes(id));

    setSelectedIds(prev => {
      if (allSelected) {
        return prev.filter(id => !filteredIds.includes(id));
      } else {
        return [...new Set([...prev, ...filteredIds])];
      }
    });
  }, [filteredTests, selectedIds]);

  const handleSubmit = async () => {
    if (!selectedIds.length) {
      setError("Vui lòng chọn ít nhất một xét nghiệm.");
      return;
    }

    if (!recordId || !sessionId) {
      setError("Thiếu thông tin bắt buộc (recordId hoặc sessionId).");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = { testIds: selectedIds };

      await axios.post(
        LAB_TEST_FOLLOW_UP(recordId, sessionId),
        payload,
        { headers: getJsonAuthHeader() }
      );

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Error submitting lab test follow-up:", err);
      const errorMessage = err.response?.data?.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!submitting) {
      onClose?.();
    }
  }, [submitting, onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const handleRetry = useCallback(() => {
    fetchLabTests();
  }, [fetchLabTests]);

  const selectedCount = selectedIds.length;
  const allFilteredSelected = filteredTests.length > 0 &&
    filteredTests.every(test => selectedIds.includes(test.id));

  return (
    <div className="lab-modal-overlay" onClick={handleOverlayClick}>
      <div className="lab-modal-content">
        <div className="lab-modal-header">
          <div className="lab-modal-title-section">
            <h2 className="lab-modal-title">Chọn xét nghiệm</h2>
            <p className="lab-modal-subtitle">
              Chọn các xét nghiệm cần thực hiện cho buổi khám này
            </p>
          </div>
          <button
            className="lab-modal-close-btn"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Đóng modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="lab-modal-body">
          {error && (
            <div className="lab-modal-error">
              <span>{error}</span>
              {!loading && (
                <button onClick={handleRetry} className="retry-btn">
                  Thử lại
                </button>
              )}
            </div>
          )}

          <div className="lab-modal-controls">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm xét nghiệm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                disabled={loading}
              />
            </div>

            <div className="selection-info">
              <span className="selected-count">
                Đã chọn: <strong>{selectedCount}</strong>
                {filteredTests.length > 0 && (
                  <span className="total-count"> / {filteredTests.length}</span>
                )}
              </span>
              {filteredTests.length > 0 && (
                <button
                  className="select-all-btn"
                  onClick={handleSelectAll}
                  disabled={loading}
                >
                  {allFilteredSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </button>
              )}
            </div>
          </div>

          <div className="lab-modal-options">
            {loading ? (
              <div className="loading-container">
                <Loader size={24} className="loading-spinner" />
                <p>Đang tải danh sách xét nghiệm...</p>
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="no-results">
                <ClipboardList size={48} className="no-results-icon" />
                <p>
                  {labTests.length === 0
                    ? "Không có xét nghiệm nào trong hệ thống"
                    : "Không tìm thấy xét nghiệm phù hợp"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="clear-search-btn"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <div className="test-list">
                {filteredTests.map((test) => (
                  <label key={test.id} className="lab-modal-option">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(test.id)}
                      onChange={() => handleToggle(test.id)}
                      disabled={submitting}
                    />
                    <span className="lab-test-name">{test.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lab-modal-footer">
          <div className="lab-modal-actions">
            <button
              className="lab-modal-cancel"
              onClick={handleClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              className="lab-modal-submit"
              onClick={handleSubmit}
              disabled={!selectedIds.length || submitting || loading}
            >
              {submitting ? (
                <>
                  <Loader size={16} className="submit-spinner" />
                  Đang gửi...
                </>
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

export default LabTestFollowUpRequestModal;
