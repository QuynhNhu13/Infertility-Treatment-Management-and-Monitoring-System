import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ULTRASOUND_IMAGE } from "../../api/apiUrls";
import "../../styles/ultrasound-management/UltrasoundImageFetcher.css";

export default function UltrasoundImageFetcher({ id }) {
  const { getAuthHeader } = useAuth();
  const [imageUrls, setImageUrls] = useState([]);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleImages = async () => {
    if (!opened && imageUrls.length === 0) {
      try {
        setLoading(true);
        const res = await fetch(ULTRASOUND_IMAGE(id), {
          headers: getAuthHeader(),
        });
        const data = await res.json();

        if (res.ok && data.data?.imageUrls) {
          setImageUrls(data.data.imageUrls);
        } else {
          toast.error("Không thể lấy ảnh siêu âm.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi gọi API ảnh siêu âm.");
      } finally {
        setLoading(false);
      }
    }

    setOpened((prev) => !prev);
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleKeyDown = (e) => {
    if (!modalOpen) return;

    switch (e.key) {
      case "ArrowLeft":
        prevImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
      case "Escape":
        closeModal();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [modalOpen]);

  return (
    <div className="us-image-fetcher">
      <button className="us-toggle-btn" onClick={toggleImages} disabled={loading}>
        {loading ? (
          <div className="us-loading-content">
            <div className="us-spinner"></div>
            <span>Đang tải ảnh...</span>
          </div>
        ) : opened ? (
          <div className="us-btn-content">
            <svg className="us-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <span>Ẩn ảnh</span>
          </div>
        ) : (
          <div className="us-btn-content">
            <svg className="us-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            <span>Xem ảnh</span>
          </div>
        )}
      </button>

      {opened && imageUrls.length > 0 && (
        <div className="us-image-grid">
          {imageUrls.map((url, i) => (
            <div key={i} className="us-image-item" onClick={() => openModal(i)}>
              <img
                src={url}
                alt={`Ảnh siêu âm ${i + 1}`}
                className="us-thumbnail"
                onError={(e) => {
                  e.target.parentNode.style.display = "none";
                  console.error("Không thể hiển thị ảnh:", url);
                }}
              />
              <div className="us-image-overlay">
                <svg className="us-zoom-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <div className="us-image-number">{i + 1}</div>
            </div>
          ))}
        </div>
      )}

      {modalOpen &&
        ReactDOM.createPortal(
          <div className="us-modal" onClick={closeModal}>
            <div className="us-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="us-modal-close" onClick={closeModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="us-modal-body">
                <button className="us-nav-btn us-nav-prev" onClick={prevImage}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                </button>

                <div className="us-image-container">
                  <img
                    src={imageUrls[currentImageIndex]}
                    alt={`Ảnh siêu âm ${currentImageIndex + 1}`}
                    className="us-modal-image"
                  />
                </div>

                <button className="us-nav-btn us-nav-next" onClick={nextImage}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              </div>

              <div className="us-modal-footer">
                <div className="us-image-info">
                  <span className="us-image-counter">
                    {currentImageIndex + 1} / {imageUrls.length}
                  </span>
                  <span className="us-image-title">Ảnh siêu âm {currentImageIndex + 1}</span>
                </div>

                <div className="us-thumbnail-strip">
                  {imageUrls.map((url, i) => (
                    <div
                      key={i}
                      className={`us-thumbnail-item ${i === currentImageIndex ? "active" : ""}`}
                      onClick={() => goToImage(i)}
                    >
                      <img src={url} alt={`Thumbnail ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
