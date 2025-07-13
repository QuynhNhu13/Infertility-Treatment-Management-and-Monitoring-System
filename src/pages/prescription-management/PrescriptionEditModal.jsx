import React, { useEffect, useState } from "react";
import "../../styles/prescription-management/PrescriptionEditModal.css";
import { useAuth } from "../../context/AuthContext";
import { UPDATE_PRESCRIPTION } from "../../api/apiUrls";
import Select from "react-select";

export default function PrescriptionEditModal({ prescription, onSuccess, onClose }) {
  const { getAuthHeader } = useAuth();
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState(prescription?.notes || "");
  const [loading, setLoading] = useState(false);

  const medicationRoutes = [
    { value: "ORAL", label: "Uống" },
    { value: "BUCCAL", label: "Ngậm" },
    { value: "INJECTION", label: "Tiêm" },
    { value: "TOPICAL", label: "Bôi ngoài da" },
    { value: "VAGINAL", label: "Đặt âm đạo" },
    { value: "RECTAL", label: "Đặt hậu môn" },
  ];

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#077BF6",
      boxShadow: "0 0 0 1px #077BF6",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#E2EFFF" : "white",
      color: "#001D54",
    }),
  };

  useEffect(() => {
    setSelectedItems(
      prescription?.medications?.map((med) => ({
        id: med.id,
        medicationId: med.medicationId || med.id,
        medicationName: med.medicationName || "",
        dosage: med.dosage || "",
        quantity: med.quantity || 0,
        frequency: med.frequency || "",
        usageInstruction: med.usageInstruction || "",
        route: med.route || "ORAL",
      })) || []
    );
  }, [prescription]);

  const handleUpdate = (index, field, value) => {
    const updated = [...selectedItems];
    updated[index][field] = value;
    setSelectedItems(updated);
  };

  const handleRemove = (index) => {
    const updated = [...selectedItems];
    updated.splice(index, 1);
    setSelectedItems(updated);
  };

  const handleSubmit = async () => {
    if (!prescription?.id) {
      alert("Thiếu ID đơn thuốc.");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Đơn thuốc không được để trống.");
      return;
    }

    const payload = {
      notes,
      medications: selectedItems.map((item) => ({
        id: item.id,
        medicationId: item.medicationId,
        dosage: item.dosage,
        quantity: Number(item.quantity),
        frequency: item.frequency,
        usageInstruction: item.usageInstruction,
        route: item.route,
      })),
    };

    setLoading(true);
    try {
      const response = await fetch(UPDATE_PRESCRIPTION(prescription.id), {
        method: "PUT",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        alert(result.message || "Cập nhật đơn thuốc thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn thuốc:", error);
      alert("Lỗi máy chủ khi cập nhật đơn thuốc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pum-modal-overlay">
      <div className="pum-modal">
        <div className="pum-modal-header">
          <h2>Cập nhật đơn thuốc #{prescription?.id}</h2>
          <button className="pum-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="pum-modal-content">
          <textarea
            className="pum-notes-input"
            placeholder="Ghi chú đơn thuốc..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {selectedItems.map((item, index) => (
            <div key={index} className="pum-medication-card">
              <div className="pum-card-header">
                <strong>{item.medicationName}</strong>
                <button className="pum-btn-remove" onClick={() => handleRemove(index)}>🗑</button>
              </div>
              <div className="pum-input-group">
                <input
                  type="text"
                  placeholder="Liều dùng"
                  value={item.dosage}
                  onChange={(e) => handleUpdate(index, "dosage", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Số lượng"
                  value={item.quantity}
                  onChange={(e) => handleUpdate(index, "quantity", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Tần suất"
                  value={item.frequency}
                  onChange={(e) => handleUpdate(index, "frequency", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Cách dùng"
                  value={item.usageInstruction}
                  onChange={(e) => handleUpdate(index, "usageInstruction", e.target.value)}
                />
                <Select
                  options={medicationRoutes}
                  value={medicationRoutes.find((opt) => opt.value === item.route)}
                  onChange={(opt) => handleUpdate(index, "route", opt.value)}
                  styles={customSelectStyles}
                />
              </div>
            </div>
          ))}
          <div className="pum-form-actions">
            <button className="pum-btn-cancel" onClick={onClose}>Hủy</button>
            <button className="pum-btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang cập nhật..." : "💾 Lưu đơn thuốc"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
