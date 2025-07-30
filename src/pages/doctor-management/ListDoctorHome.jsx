import React from "react";
import { Link } from "react-router-dom";
import doctor_home from "../../assets/doctorhome.png";

import "../../styles/doctor-management/ListDoctorHome.css"; // tạo file CSS tương ứng

const ListDoctorHome = () => {
  return (
    <div>
      <div className="list-doctor-home-header">
        <div className="list-doctor-home-header-left">
          <h1 className="list-doctor-home-h1">ĐỘI NGŨ CHUYÊN GIA</h1>
          <h1 className="list-doctor-home-h2">BÁC SĨ HÀNG ĐẦU</h1>
          <div style={{ textAlign: "center", marginTop: "5px", marginBottom: "15px" }}>
            <Link to="/danh-sach-chuyen-gia-bac-si" className="list-doctor-home-button">
              Xem tất cả bác sĩ
            </Link>
          </div>
        </div>
        <div className="list-doctor-home-header-right">
          <p className="list-doctor-home-description">
            <strong>Bệnh viện Đa khoa Thành Nhân</strong> tự hào sở hữu đội ngũ bác sĩ và chuyên gia có trình độ chuyên môn cao, được đào 
            tạo bài bản tại các trường đại học y danh tiếng trong và ngoài nước. Với nhiều năm kinh nghiệm thực tiễn, các bác sĩ tại bệnh viện luôn cập nhật 
            các phương pháp điều trị tiên tiến nhất, nhằm mang lại hiệu quả tối ưu cho từng bệnh nhân.
            Chúng tôi hiểu rằng mỗi ca bệnh đều là duy nhất, vì vậy các bác sĩ luôn lắng nghe kỹ lưỡng, đánh giá toàn diện và đưa ra 
            phác đồ điều trị cá thể hóa, phù hợp với từng người. Sự tận tâm, chuyên nghiệp và đạo đức nghề nghiệp luôn là kim chỉ nam trong hành trình chăm sóc sức khỏe cộng đồng của đội ngũ y bác sĩ tại Thành Nhân.
            <strong>Đặt niềm tin vào chúng tôi</strong>, bạn sẽ được đồng hành bởi những chuyên gia tận tâm và giàu kinh nghiệm, sẵn sàng hỗ trợ bạn trên mọi chặng đường chăm sóc sức khỏe.
          </p>
        </div>
      </div>

      <div className="list-doctor-home-image-wrapper">
        <img src={doctor_home} alt="Đội ngũ bác sĩ Thành Nhân" className="list-doctor-home-image" />
      </div>
    </div>
  );
};

export default ListDoctorHome;
