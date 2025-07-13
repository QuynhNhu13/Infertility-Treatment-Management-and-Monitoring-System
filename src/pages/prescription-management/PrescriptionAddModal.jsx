import React, { useEffect, useState } from "react";
import "../../styles/prescription-management/PrescriptionAddModal.css";
import { useAuth } from "../../context/AuthContext";
import { CREATE_PRESCRIPTION, GET_ALL_MEDICATIONS } from "../../api/apiUrls";
import Select from "react-select";

export default function PrescriptionAddModal({ sessionId, onSuccess, onClose }) {
  const { getAuthHeader } = useAuth();
  const [medications, setMedications] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState("");
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
      "&:hover": { borderColor: "#077BF6" },
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#E2EFFF" : "white",
      color: "#001D54",
    }),
  };

  useEffect(() => {
    fetch(GET_ALL_MEDICATIONS, { headers: getAuthHeader() })
      .then((res) => res.json())
      .then((result) => {
        if (result?.data) setMedications(result.data);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách thuốc:", error));
  }, []);

  const handleAddMedication = (med) => {
    if (!selectedItems.find((item) => item.medicationId === med.id)) {
      setSelectedItems([
        ...selectedItems,
        {
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.strength || "",
          quantity: 0,
          frequency: "",
          usageInstruction: "",
          route: "ORAL",
        },
      ]);
    }
  };

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
    if (selectedItems.length === 0) return alert("Vui lòng thêm ít nhất 1 loại thuốc!");

    const payload = {
      sessionId: Number(sessionId),
      notes: notes,
      medications: selectedItems.map((item) => ({
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
      const response = await fetch(CREATE_PRESCRIPTION, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.status === 201) {
        onSuccess();
      } else {
        alert(result.message || "Tạo đơn thuốc thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn thuốc:", error);
      alert("Lỗi máy chủ khi tạo đơn thuốc");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pam-modal-overlay">
      <div className="pam-modal">
        <div className="pam-modal-header">
          <h2>Tạo đơn thuốc mới</h2>
          <button className="pam-modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="pam-modal-content">
          <div className="pam-left-panel">
            <h3 className="pam-panel-title">💊 Danh sách thuốc</h3>
            <div className="pam-medication-list">
              {medications.map((med) => (
                <div key={med.id} className="pam-medication-item">
                  <div>
                    <strong>{med.name}</strong>
                    <div className="pam-medication-desc">
                      {med.description} <br />
                      <span className="pam-med-subinfo">
                        {med.strength} – {med.form} – {med.manufacturer}
                      </span>
                    </div>
                  </div>
                  <button className="pam-btn-add" onClick={() => handleAddMedication(med)}>+</button>
                </div>
              ))}
            </div>
          </div>

          <div className="pam-right-panel">
            <h3 className="pam-panel-title">📝 Đơn thuốc</h3>
            <textarea
              className="pam-notes-input"
              placeholder="Ghi chú đơn thuốc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            {selectedItems.map((item, index) => (
              <div key={index} className="pam-selected-medication-card">
                <div className="pam-card-header">
                  <strong>{item.medicationName}</strong>
                  <button className="pam-btn-remove" onClick={() => handleRemove(index)}>🗑</button>
                </div>
                <div className="pam-input-group">
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

            <div className="pam-form-actions">
              <button className="pam-btn-cancel" onClick={onClose}>Hủy</button>
              <button className="pam-btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? "Đang lưu..." : "💾 Lưu đơn thuốc"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
