import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorFormCreateModal from "../../pages/doctor-management/DoctorFormCreateModal";
import DoctorFormUpdateModal from "../../pages/doctor-management/DoctorFormUpdateModal";
import { useAuth } from "../../context/AuthContext";
import { GET_DOCTORS_IN_HOME } from "../../api/apiUrls";
import "../../styles/doctor-management/DoctorManager.css";

export default function DoctorManager() {
  const { getAuthHeader } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const doctorsPerPage = 9;
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(GET_DOCTORS_IN_HOME, {
        method: "GET",
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (res.ok) {
        setDoctors(data.data);
        setFilteredDoctors(data.data);
      } else {
        console.error("Lỗi khi lấy danh sách bác sĩ:", data.message);
      }
    } catch (err) {
      console.error("Lỗi khi fetch bác sĩ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch =
        doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.expertise.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty = filterSpecialty === "" ||
        doctor.expertise.toLowerCase().includes(filterSpecialty.toLowerCase());

      return matchesSearch && matchesSpecialty;
    });

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.fullName.localeCompare(b.fullName);
        case "position":
          return a.position.localeCompare(b.position);
        case "expertise":
          return a.expertise.localeCompare(b.expertise);
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterSpecialty, doctors, sortBy]);

  const getUniqueSpecialties = () => {
    const specialties = doctors.map(doc => doc.expertise);
    return [...new Set(specialties)];
  };

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    fetchDoctors();
  };

  const handleCloseUpdateModal = () => {
    setSelectedDoctorId(null);
    fetchDoctors();
  };

  const LoadingSkeleton = () => (
    <div className="doctor-manager-loading-skeleton">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="doctor-manager-skeleton-card">
          <div className="doctor-manager-skeleton-avatar"></div>
          <div className="doctor-manager-skeleton-content">
            <div className="doctor-manager-skeleton-line long"></div>
            <div className="doctor-manager-skeleton-line medium"></div>
            <div className="doctor-manager-skeleton-line short"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const DoctorCard = ({ doctor, index }) => (
    <div
      className="doctor-manager-doctor-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="doctor-manager-card-header">
        <div className="doctor-manager-doctor-avatar">
          {doctor.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="doctor-manager-status-badge">
          ✅ Hoạt động
        </div>
      </div>

      <div className="doctor-manager-card-content">
        <h3 className="doctor-manager-doctor-name">{doctor.fullName}</h3>
        <p className="doctor-manager-doctor-position">
          <span className="doctor-manager-label">Chức vụ:</span> {doctor.position}
        </p>
        <p className="doctor-manager-doctor-expertise">
          <span className="doctor-manager-label">Chuyên khoa:</span> {doctor.expertise}
        </p>
      </div>

      <div className="doctor-manager-card-actions">
        <button
          className="doctor-manager-edit-btn"
          onClick={() => setSelectedDoctorId(doctor.id)}
        >
          ✏️ Sửa
        </button>
        <button
          className="doctor-manager-detail-btn"
          onClick={() => navigate(`/bac-si/${doctor.id}`)}
        >
          👁️ Chi tiết
        </button>
      </div>
    </div>
  );

  return (
    <div className="doctor-manager-container">
      <div className="doctor-manager-header">
        <h2 className="doctor-manager-title">
          QUẢN LÝ BÁC SĨ
        </h2>

        <div className="doctor-manager-stats">
          <div className="doctor-manager-stat-card">
            <span className="doctor-manager-stat-number">{filteredDoctors.length}</span>
            <span className="doctor-manager-stat-label">Bác sĩ</span>
          </div>
          <div className="doctor-manager-stat-card">
            <span className="doctor-manager-stat-number">{getUniqueSpecialties().length}</span>
            <span className="doctor-manager-stat-label">Chuyên khoa</span>
          </div>
        </div>
      </div>

      <div className="doctor-manager-controls">
        <div className="doctor-manager-search-section">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm bác sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="doctor-manager-search-input"
          />

          {/* <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="doctor-manager-filter-select"
          >
            <option value="">🏥 Tất cả chuyên khoa</option>
            {getUniqueSpecialties().map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select> */}

          {/* <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="doctor-manager-sort-select"
          >
            <option value="name">📝 Sắp xếp theo tên</option>
            <option value="position">🏆 Sắp xếp theo chức vụ</option>
            <option value="expertise">🩺 Sắp xếp theo chuyên khoa</option>
          </select> */}
        </div>

        <div className="doctor-manager-action-section">
          <div className="doctor-manager-view-toggle">
            <button
              className={`doctor-manager-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞ Grid
            </button>
            <button
              className={`doctor-manager-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              ☰ Table
            </button>
          </div>

          {/* <button
            className="doctor-manager-add-button"
            onClick={() => setShowCreateModal(true)}
          >
            + Thêm bác sĩ mới
          </button> */}
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : filteredDoctors.length === 0 ? (
        <div className="doctor-manager-empty">
          <div className="doctor-manager-empty-icon">👨‍⚕️</div>
          <p>Không tìm thấy bác sĩ nào.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <>
          <div className="doctor-manager-grid">
            {currentDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="doctor-manager-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="doctor-manager-pagination-btn"
              >
                ← Trước
              </button>

              <div className="doctor-manager-pagination-info">
                <span className="doctor-manager-current-page">{currentPage}</span>
                <span> / </span>
                <span className="doctor-manager-total-pages">{totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="doctor-manager-pagination-btn"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="doctor-manager-table-container">
          <table className="doctor-manager-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Chức vụ</th>
                <th>Chuyên khoa</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentDoctors.map((doc, index) => (
                <tr
                  key={doc.id}
                  className="doctor-manager-table-row"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td>
                    <div className="doctor-manager-table-doctor">
                      <div className="doctor-manager-table-avatar">
                        {doc.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span>{doc.fullName}</span>
                    </div>
                  </td>
                  <td>{doc.position}</td>
                  <td>
                    <span className="doctor-manager-expertise-tag">{doc.expertise}</span>
                  </td>
                  <td>
                    <div className="doctor-manager-table-actions">
                      <button
                        className="doctor-manager-table-edit-btn"
                        onClick={() => setSelectedDoctorId(doc.id)}
                      >
                        Sửa
                      </button>
                      <button
                        className="doctor-manager-table-detail-btn"
                        onClick={() => navigate(`/bac-si/${doc.id}`)}
                      >
                        Xem
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="doctor-manager-pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="doctor-manager-pagination-btn"
              >
                ← Trước
              </button>

              <div className="doctor-manager-pagination-info">
                <span className="doctor-manager-current-page">{currentPage}</span>
                <span> / </span>
                <span className="doctor-manager-total-pages">{totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="doctor-manager-pagination-btn"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <DoctorFormCreateModal onClose={handleCloseCreateModal} />
      )}

      {selectedDoctorId && (
        <DoctorFormUpdateModal
          id={selectedDoctorId}
          onClose={handleCloseUpdateModal}
        />
      )}
    </div>
  );
}