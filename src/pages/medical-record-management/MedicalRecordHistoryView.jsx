import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { GET_MEDICAL_RECORD_HISTORY_USER } from "../../api/apiUrls";
import { useNavigate } from "react-router-dom";
import "../../styles/medical-record-management/MedicalRecordHistory.css";
import ROUTES from "../../routes/RoutePath";

export default function MedicalRecordHistoryView() {
    const { getJsonAuthHeader } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const headers = getJsonAuthHeader();
                const response = await fetch(GET_MEDICAL_RECORD_HISTORY_USER, { headers });

                if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

                const { statusCode, data, message } = await response.json();
                if (statusCode === 200 && Array.isArray(data)) {
                    // const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    // setRecords(sortedData);
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

        fetchRecords();
    }, [getJsonAuthHeader]);

    const handleViewDetail = (recordId) => {
        navigate(ROUTES.MEDICAL_RECORD_DETAIL_VIEW.replace(":recordId", recordId));
    };

    return (
        <div className="mrh-page-container">
            <h2
                className="mrh-page-title"
                style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#077BF6",
                    textAlign: "center",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                LỊCH SỬ HỒ SƠ BỆNH ÁN
            </h2>

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
    );
}
