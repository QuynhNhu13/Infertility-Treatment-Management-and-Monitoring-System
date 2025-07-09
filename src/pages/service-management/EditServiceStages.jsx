import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { LIST_SERVICE_STAGES, EDIT_SERVICE_STAGES } from "../../api/apiUrls";
import { useAuth } from "../../context/AuthContext";
import "../../styles/service-management/EditServiceStages.css";

const EditServiceStages = ({ serviceId, onClose, onUpdated }) => {
    const { getJsonAuthHeader } = useAuth();
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchStages = async () => {
            setInitialLoading(true);
            try {
                const res = await fetch(LIST_SERVICE_STAGES(serviceId), {
                    headers: getJsonAuthHeader(),
                });
                const result = await res.json();
                if (res.ok && result.statusCode === 200) {
                    setStages(result.data.sort((a, b) => a.stageOrder - b.stageOrder));
                }
            } catch (err) {
                console.error("Lỗi khi fetch service stages:", err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchStages();
    }, [serviceId, getJsonAuthHeader]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const newStages = Array.from(stages);
        const [moved] = newStages.splice(result.source.index, 1);
        newStages.splice(result.destination.index, 0, moved);
        const reordered = newStages.map((stage, idx) => ({
            ...stage,
            stageOrder: idx + 1,
        }));
        setStages(reordered);
    };

    const handleChange = (index, field, value) => {
        const newStages = [...stages];
        newStages[index][field] = field === "duration" || field === "stageOrder" ? Number(value) : value;
        setStages(newStages);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            for (const stage of stages) {
                await fetch(EDIT_SERVICE_STAGES(serviceId, stage.id), {
                    method: "PUT",
                    headers: {
                        ...getJsonAuthHeader(),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: stage.name,
                        stageOrder: stage.stageOrder,
                        duration: stage.duration,
                    }),
                });
            }
            if (onUpdated) onUpdated();
            onClose();
        } catch (err) {
            console.error("Lỗi khi cập nhật stages:", err);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <p className="edit-stages-loading">Đang tải dữ liệu giai đoạn...</p>;

    return (
        <div className="edit-stages-wrapper">
            <h3 className="edit-stages-title">Cập nhật giai đoạn điều trị</h3>
            {loading && <p className="edit-stages-loading">Đang lưu dữ liệu...</p>}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="stage-list">
                    {(provided) => (
                        <ul
                            className="edit-stages-list"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {stages.map((stage, index) => (
                                <Draggable key={stage.id} draggableId={`stage-${stage.id}`} index={index}>
                                    {(provided) => (
                                        <li
                                            className="edit-stages-item"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div className="edit-stages-field">
                                                <label>Tên giai đoạn:</label>
                                                <input
                                                    type="text"
                                                    value={stage.name}
                                                    onChange={(e) => handleChange(index, "name", e.target.value)}
                                                />
                                            </div>
                                            <div className="edit-stages-field">
                                                <label>Thời gian (ngày):</label>
                                                <input
                                                    type="number"
                                                    value={stage.duration}
                                                    min="1"
                                                    onChange={(e) => handleChange(index, "duration", e.target.value)}
                                                />
                                            </div>
                                            <div className="edit-stages-order">
                                                <strong>Thứ tự:</strong> {stage.stageOrder}
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="edit-stages-actions">
                <button className="edit-stages-btn cancel" onClick={onClose}>
                    Hủy
                </button>
                <button
                    className="edit-stages-btn save"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>
        </div>
    );
};

export default EditServiceStages;
