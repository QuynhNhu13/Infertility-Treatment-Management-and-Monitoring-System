import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SEARCH_GROUPED_LAB_TEST_RESULT, GET_GROUPED_DETAILS } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import "../../styles/lab-test-management/LabTestResultList.css";
import LabTestResultForm from "./LabTestResultForm";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";


registerLocale("vi", vi);

export default function LabTestResultList() {
  const { getAuthHeader } = useAuth();

  const [groups, setGroups] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [editingTestId, setEditingTestId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);

  const statusOptions = useMemo(() => [
    { value: "", label: "Tất cả trạng thái" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "COMPLETED", label: "Đã hoàn thành" },
  ], []);

  const fetchGroupedResults = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (searchTerm?.trim()) {
        params.append("keyword", searchTerm.trim());
      }
      if (searchDate) {
        const formattedDate = searchDate.toISOString().split('T')[0];
        params.append("testDate", formattedDate);
      }
      if (statusFilter) {
        params.append("status", statusFilter);
      }

      const response = await fetch(`${SEARCH_GROUPED_LAB_TEST_RESULT}?${params.toString()}`, {
        method: "GET",
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        if (response.status === 404) {
          setGroups([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.success !== false && data?.data) {
        setGroups(Array.isArray(data.data) ? data.data : []);
      } else {
        throw new Error(data?.message || "Không thể tải danh sách nhóm xét nghiệm.");
      }
    } catch (err) {
      console.error("Error fetching grouped results:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, searchDate, statusFilter, getAuthHeader]);

  const fetchGroupDetails = useCallback(async (ids) => {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      setError("Danh sách ID không hợp lệ");
      return;
    }

    setDetailsLoading(true);
    setError("");

    try {
      const response = await fetch(GET_GROUPED_DETAILS, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ids),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data?.success !== false) {
        setLabTests(Array.isArray(data.data) ? data.data : []);
        setSelectedGroupIds(ids);
      } else {
        throw new Error(data.message || "Không thể tải chi tiết nhóm.");
      }
    } catch (err) {
      console.error("Error fetching group details:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải chi tiết.");
      setLabTests([]);
    } finally {
      setDetailsLoading(false);
    }
  }, [getAuthHeader]);

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "Không rõ";

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Ngày không hợp lệ";

      return date.toLocaleDateString("vi-VN", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }, []);

  const getStatusClass = useCallback((status) => {
    const statusClasses = {
      "PROCESSING": "ltr-status-processing",
      "COMPLETED": "ltr-status-completed",
    };
    return statusClasses[status] || "ltr-status-default";
  }, []);

  const getStatusText = useCallback((status) => {
    const statusTexts = {
      "PROCESSING": "Đang xử lý",
      "COMPLETED": "Đã hoàn thành",
    };
    return statusTexts[status] || status;
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSearchDate(null);
    setStatusFilter("");
  }, []);

  const closeDetailsModal = useCallback(() => {
    setSelectedGroupIds([]);
    setLabTests([]);
  }, []);

  const closeEditModal = useCallback(() => {
    setEditingTestId(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    const groupIdCopy = [...selectedGroupIds];
    setEditingTestId(null);
    fetchGroupedResults();
    if (groupIdCopy.length > 0) {
      fetchGroupDetails(groupIdCopy);
    }
  }, [selectedGroupIds, fetchGroupedResults, fetchGroupDetails]);

  useEffect(() => {
    fetchGroupedResults();
  }, [fetchGroupedResults]);

  const renderLoadingSpinner = () => (
    <div className="ltr-loading">
      <div className="ltr-spinner"></div>
      <span>Đang tải dữ liệu...</span>
    </div>
  );

  const renderError = () => error && (
    <div className="ltr-error">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="ltr-error-icon">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" />
      </svg>
      {error}
    </div>
  );


  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <input
      style={{
        padding: "10px 14px",
        borderRadius: "10px",
        border: "1px solid #077BF6",
        width: "220px",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        outline: "none",
        color: "#001D54",
        backgroundColor: "#E2EFFF",
        boxShadow: "0 2px 6px rgba(7, 123, 246, 0.15)",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
      }}
      onClick={onClick}
      ref={ref}
      value={value}
      readOnly
      placeholder={placeholder}
      onFocus={(e) => e.target.style.boxShadow = "0 0 0 3px rgba(7, 123, 246, 0.3)"}
      onBlur={(e) => e.target.style.boxShadow = "0 2px 6px rgba(7, 123, 246, 0.15)"}
    />
  ));

  return (
    <div className="ltr-container">
      <div className="ltr-header">
        <h2 className="ltr-title">Danh sách nhóm xét nghiệm</h2>
        <p className="ltr-subtitle">Tìm kiếm và xem chi tiết nhóm xét nghiệm</p>
      </div>

      <div className="ltr-search-section">
        <div className="ltr-search-wrapper">
          <div className="ltr-filter-group">

            <div className="ltr-input-wrapper">
              <DatePicker
                locale="vi"
                selected={searchDate}
                onChange={(date) => setSearchDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày xét nghiệm"
                isClearable
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={10}
                showMonthDropdown
                dropdownMode="select"
                popperPlacement="bottom-start"
                customInput={<CustomInput />}
              />


            </div>

            <div className="ltr-select-wrapper">
              <Select
                options={statusOptions}
                value={statusOptions.find(opt => opt.value === statusFilter) || null}
                onChange={(option) => setStatusFilter(option?.value || "")}
                className="ltr-search-status-select"
                classNamePrefix="ltr-select"
                isClearable
                placeholder="Chọn trạng thái"
                noOptionsMessage={() => "Không có tùy chọn"}
              />
            </div>

            <button
              onClick={resetFilters}
              className="ltr-reset-btn"
              title="Đặt lại bộ lọc"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ltr-reset-icon">
                <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2" />
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {renderError()}

      {loading ? renderLoadingSpinner() : (
        <div className="ltr-results-section">
          <div className="ltr-table-container">
            <table className="ltr-table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Số điện thoại</th>
                  <th>Ngày xét nghiệm</th>
                  <th>Số lượng</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {groups.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="ltr-no-data">
                      <div className="ltr-empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="ltr-empty-icon">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p>Không có nhóm xét nghiệm nào phù hợp với tiêu chí tìm kiếm.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  groups.map((group, index) => (
                    <tr key={`group-${group.id || index}`} className="ltr-table-row">
                      <td className="ltr-patient-name">
                        <div className="ltr-patient-info">
                          <span className="ltr-name">{group.patientName || "Không rõ"}</span>
                        </div>
                      </td>
                      <td className="ltr-phone-number">{group.patientPhoneNumber || "Không có"}</td>
                      <td className="ltr-test-date">{formatDate(group.testDate)}</td>
                      <td className="ltr-test-count">
                        <span className="ltr-count-badge">
                          {Array.isArray(group.labTestResultIds) ? group.labTestResultIds.length : 0}
                        </span>
                      </td>
                      <td>
                        <span className={`ltr-status-badge ${getStatusClass(group.status)}`}>
                          {getStatusText(group.status)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="ltr-action-btn"
                          onClick={() => fetchGroupDetails(group.labTestResultIds)}
                          disabled={!Array.isArray(group.labTestResultIds) || group.labTestResultIds.length === 0}
                          title="Xem chi tiết nhóm xét nghiệm"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ltr-btn-icon">
                            <path d="M1 12C1 5.925 5.925 1 12 1S23 5.925 23 12 18.075 23 12 23 1 18.075 1 12Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedGroupIds.length > 0 && (
        <div className="ltr-modal-overlay" onClick={closeDetailsModal}>
          <div className="ltr-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ltr-modal-header">
              <h3>Chi tiết xét nghiệm</h3>
              <button className="ltr-modal-close" onClick={closeDetailsModal} title="Đóng">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <div className="ltr-modal-body">
              {detailsLoading ? (
                renderLoadingSpinner()
              ) : labTests.length === 0 ? (
                <div className="ltr-no-detail-data">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="ltr-empty-icon">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <p>Không có dữ liệu chi tiết</p>
                </div>
              ) : (
                <div className="ltr-details-list">
                  {labTests.map((test) => (
                    <div key={test.id} className="ltr-detail-item">
                      <div className="ltr-detail-header">
                        <strong className="ltr-test-name">{test.labTestName || "Không rõ tên"}</strong>
                        <span className={`ltr-status-badge ${getStatusClass(test.status)}`}>
                          {getStatusText(test.status)}
                        </span>
                      </div>
                      <div className="ltr-result-summary">
                        <div className="ltr-result-row">
                          <strong>Kết quả:</strong>
                          <span className="ltr-result-value">{test.resultSummary || "Chưa có kết quả"}</span>
                        </div>
                        <div className="ltr-result-row">
                          <strong>Chi tiết:</strong>
                          <span className="ltr-result-detail">{test.resultDetails || "Chưa có chi tiết"}</span>
                        </div>
                        <div className="ltr-result-row">
                          <strong>Ghi chú:</strong>
                          <span className="ltr-result-note">{test.notes || "Không có ghi chú"}</span>
                        </div>
                      </div>
                      {test.status === "PROCESSING" && (
                        <button
                          className="ltr-inline-btn"
                          onClick={() => setEditingTestId(test.id)}
                          title="Cập nhật kết quả xét nghiệm"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ltr-btn-icon">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Cập nhật
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editingTestId && (
        <div className="ltr-modal-overlay" onClick={closeEditModal}>
          <div className="ltr-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ltr-modal-header">
              <h3>Cập nhật kết quả xét nghiệm</h3>
              <button className="ltr-modal-close" onClick={closeEditModal} title="Đóng">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <div className="ltr-modal-body">
              <LabTestResultForm
                labTestId={editingTestId}
                onSuccess={handleFormSuccess}
                onCancel={closeEditModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}