import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/service-management/ServiceCard.css';

const ServiceCard = ({ id, serviceName, subTitle, imgUrl, slug, price }) => {
  const defaultImg = 'https://via.placeholder.com/400x300?text=No+Image';
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookingClick = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt lịch khám");
      navigate('/dang-nhap');
    } else {
      navigate('/booking');
    }
  };

  const formatPrice = (p) => {
    if (!p || isNaN(p)) return "Đang cập nhật";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(p);
  };

  return (
    <div className="service-card">
      <Link to={`/services/${slug || id}`}>
        <img
          src={imgUrl || defaultImg}
          alt={serviceName}
          className="service-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImg;
          }}
        />
      </Link>

      <div className="service-card-content">
        <h3>{serviceName}</h3>
        <p className="service-subtitle">{subTitle}</p>

        {/* Thêm phần hiển thị giá */}
        <p className="service-price">{formatPrice(price)}</p>

        <div className="service-card-buttons">
          <button onClick={handleBookingClick} className="btn btn-booking">
            Đặt lịch khám
          </button>
          <Link to={`/services/${slug || id}`} className="btn btn-detail">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
