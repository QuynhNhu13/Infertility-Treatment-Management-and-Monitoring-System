import React, { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { TREATMENT_PLAN_UPDATE } from "../../api/apiUrls";
import "../../styles/treatment-plan-management/TreatmentPlanUpdateModal.css";

const statusOptions = [
    { value: "IN_PROGRESS", label: "Đang điều trị" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" }
];

export default function TreatmentPlanUpdateModal({ isOpen, onRequestClose, planId, onUpdated }) {
    const { getAuthHeader } = useAuth();
    const [status, setStatus] = useState(null);
    const [notes, setNotes] = useState("");
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async () => {
        if (!status) {
            toast.warning("Vui lòng chọn trạng thái!");
            return;
        }
        setUpdating(true);
        try {
            const response = await axios.put(
                TREATMENT_PLAN_UPDATE(planId),
                { status: status.value, notes },
                { headers: getAuthHeader() }
            );
            toast.success("Cập nhật thành công!");
            onUpdated();
            onRequestClose();
        } catch (err) {
            console.error(err);
            toast.error("Cập nhật thất bại!");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="treatment-plan-update-modal"
            overlayClassName="modal-overlay"
        >
            <h2 style={{ color: "#077BF6", marginBottom: "16px" }}>Cập nhật phác đồ điều trị</h2>

            <div className="treatment-plan-update-modal__field">
                <label style={{ fontWeight: 600 }}>Trạng thái:</label>
                <Select
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    placeholder="Chọn trạng thái"
                />
            </div>

            <div className="treatment-plan-update-modal__field">
                <label style={{ fontWeight: 600 }}>Ghi chú:</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Nhập ghi chú nếu có"
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc"
                    }}
                />
            </div>

            <div className="treatment-plan-update-modal__actions" style={{ marginTop: "20px" }}>
                <button
                    onClick={handleSubmit}
                    disabled={updating}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#077BF6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: updating ? "not-allowed" : "pointer"
                    }}
                >
                    {updating ? "Đang cập nhật..." : "Lưu thông tin"}
                </button>
                <button
                    onClick={onRequestClose}
                    style={{
                        padding: "10px 20px",
                        marginLeft: "10px",
                        backgroundColor: "#ccc",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Hủy
                </button>
            </div>
        </Modal>
    );
}
