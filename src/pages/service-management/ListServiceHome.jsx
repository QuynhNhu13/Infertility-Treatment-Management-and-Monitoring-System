import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ServiceCard from "../../components/service-management/ServiceCard";
import "../../styles/service-management/ListServiceHome.css";
import { LIST_SERVICE_HOME } from "../../api/apiUrls";

const ListServiceHome = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(LIST_SERVICE_HOME)
      .then(res => res.json())
      .then(res => {
        if (res.statusCode === 200) {
          const filtered = res.data.filter(service => service.status === 'AVAILABLE');
          setServices(filtered);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi tải danh sách dịch vụ:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải danh sách dịch vụ...</p>;

  return (
    <div>
      <div className="service-card-name">
        <div className="service-card-name01">
          <h1 className="service-h1">CÁC PHƯƠNG PHÁP</h1>
          <h1 className="service-h2">HỖ TRỢ SINH SẢN</h1>
          <div style={{ textAlign: "center", marginTop: "5px", marginBottom: "15px" }}>
            <Link to="/dich-vu" className="view-all-button">
              Xem tất cả phương pháp
            </Link>
          </div>
        </div>
        <div className="service-card-name02">
          <p className="service-p">
            Tại <strong>Bệnh viện Đa khoa Thành Nhân</strong>, chúng tôi triển khai nhiều phương pháp hỗ trợ sinh sản hiện đại
            nhằm đáp ứng nhu cầu đa dạng của các cặp vợ chồng. Một số kỹ thuật nổi bật bao gồm: theo dõi rụng
            trứng tự nhiên để xác định thời điểm thụ thai tối ưu, <strong>bơm tinh trùng vào buồng tử cung (IUI)</strong> giúp
            tăng khả năng thụ thai và <strong>thụ tinh trong ống nghiệm (IVF)</strong> dành cho các trường hợp khó. Ngoài ra,
            bệnh viện còn cung cấp nhiều dịch vụ khác như trữ lạnh tinh trùng, trứng và phôi để hỗ trợ sinh sản
            trong tương lai, cùng các kỹ thuật hỗ trợ phôi làm tổ nhằm nâng cao tỷ lệ thành công. <strong>Với đội ngũ
              bác sĩ giàu kinh nghiệm và quy trình điều trị cá thể hóa</strong>, chúng tôi cam kết đồng hành cùng mỗi
            cặp vợ chồng trên hành trình chạm tới ước mơ.
          </p>
        </div>
      </div>

      <div className="service-list">
        {services.slice(0, 3).map((service, index) => (
          <ServiceCard
            key={service.slug || index}
            id={service.id}
            serviceName={service.serviceName}
            subTitle={service.subTitle}
            imgUrl={service.imgUrl}
            slug={service.slug}
            price={service.price}
          />
        ))}
      </div>
    </div>
  );
};

export default ListServiceHome;
