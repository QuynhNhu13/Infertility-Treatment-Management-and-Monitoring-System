import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_MEDICAL_RECORD_HISTORY } from "../../api/apiUrls";
import { useNavigate } from "react-router-dom";
import "../../styles/medical-record-management/MedicalRecordHistory.css";
import CreateMedicalRecordModal from "../../pages/medical-record-management/MedicalRecordModalCreate";
import ROUTES from "../../routes/RoutePath";

export default function MedicalRecordHistoryModal({ accountId, onClose }) {
    const { getJsonAuthHeader } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const headers = getJsonAuthHeader();
                const response = await fetch(GET_MEDICAL_RECORD_HISTORY(accountId), { headers });

                if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

                const { statusCode, data, message } = await response.json();
                if (statusCode === 200 && Array.isArray(data)) {
                    setRecords(data);
                } else {
                    throw new Error(message || "Không lấy được hồ sơ bệnh án");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (accountId) fetchRecords();
    }, [accountId, getJsonAuthHeader]);

const handleViewDetail = (recordId) => {
    navigate(ROUTES.MEDICAL_RECORD_DETAIL.replace(":recordId", recordId));
    onClose();
};


    const handleCreateRecord = () => {
        setShowCreateModal(true);
    };

    const handleAddRecord = (newRecord) => {
        setRecords((prev) => [newRecord, ...prev]);
    };

    return (
        <div className="mrh-modal-overlay" onClick={onClose}>
            <div className="mrh-modal-content large" onClick={(e) => e.stopPropagation()}>
                <div className="mrh-modal-header">
                    <h2>Lịch sử hồ sơ bệnh án</h2>
                    <button className="mrh-create-btn" onClick={handleCreateRecord}>
                        + Tạo hồ sơ mới
                    </button>
                    <button className="mrh-close-btn" onClick={onClose}>×</button>
                </div>

                <div className="mrh-modal-body">
                    {loading && <p>Đang tải...</p>}
                    {error && <p className="mrh-error">Lỗi: {error}</p>}
                    {!loading && !error && (
                        <table className="mrh-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Ngày tạo</th>
                                    <th>Triệu chứng</th>
                                    <th>Chẩn đoán</th>
                                    <th>Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record.id}>
                                        <td>{record.id}</td>
                                        <td>{new Date(record.createdAt).toLocaleDateString("vi-VN")}</td>
                                        <td>{record.symptoms || <em>Chưa cập nhật</em>}</td>
                                        <td>{record.diagnosis || <em>Chưa chẩn đoán</em>}</td>
                                        <td>
                                            <button className="mrh-view-btn" onClick={() => handleViewDetail(record.id)}>
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showCreateModal && (
                <CreateMedicalRecordModal
                    accountId={accountId}
                    onClose={() => setShowCreateModal(false)}
                    onAddRecord={handleAddRecord}
                />
            )}
        </div>
    );
}
