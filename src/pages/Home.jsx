import { Link } from "react-router-dom";
import "../styles/Home.css";
import { FaStethoscope, FaCalendarCheck } from "react-icons/fa";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ListServiceHome from "./service-management/ListServiceHome";


import Footer from "../components/Footer";
import doctor01 from "../assets/doctor01.png";
import hospital1 from "../assets/hospital1.jpg";
import logo01 from "../assets/logo01.png";
import logo02 from "../assets/logo02.png";


const Home = () => {
  return (
    <>
      <Header />
      <Navbar />

      <div className="top-section">
        <div className="half-circle-top">
          <div className="half-content">
            <h2>BỆNH VIỆN ĐA KHOA THÀNH NHÂN</h2>
            <h1 className="h01">KHỞI ĐẦU HÀNH TRÌNH</h1>
            <h1 className="h02">GIEO MẦM SỐNG</h1>
            <p className="p01">Chúng tôi luôn đồng hành cùng bạn trên hành trình làm cha mẹ – một hành trình thiêng liêng và đầy cảm xúc –
              với sự hỗ trợ tận tâm từ đội ngũ chuyên gia hàng đầu trong lĩnh vực điều trị hiếm muộn, cùng hệ thống chăm sóc
              và theo dõi điều trị toàn diện, hiện đại và cá nhân hóa cho từng trường hợp.</p>
          </div>
        </div>
        <div className="action-box">
          <div className="doctor-floating">
            <img src={doctor01} alt="Bác sĩ" className="doctor-image1" />
          </div>
          <div className="action-links-right">
            <a href="/tu-van-kham-benh" className="action-link-text">
              <FaStethoscope className="action-icon" />
              <span>TƯ VẤN KHÁM</span>
            </a>
            <a href="/dat-lich-kham" className="action-link-text">
              <FaCalendarCheck className="action-icon" />
              <span>ĐẶT LỊCH KHÁM</span>
            </a>
          </div>
        </div>

      </div>

      <div className="page-content">
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">BỆNH VIỆN ĐA KHOA THÀNH NHÂN</h1>
              <h3 className="hero-subtitle">Uy tín - Chất lượng - Tận tâm</h3>
              <p><strong>Bệnh viện Đa khoa Thành Nhân</strong> là một trong những cơ sở y tế hàng đầu tại TP. Hồ Chí Minh, được thành lập với sứ mệnh mang đến dịch vụ chăm sóc sức khỏe chất lượng cao cho cộng đồng. Với hơn 7 năm hình thành và phát triển, bệnh viện không ngừng mở rộng quy mô, đầu tư trang thiết bị hiện đại và nâng cao chuyên môn đội ngũ y bác sĩ, hướng đến mô hình bệnh viện đa chuyên khoa chuẩn mực – nhân ái – hiện đại.</p>
              <p>Một trong những lĩnh vực trọng điểm được chúng tôi đặc biệt chú trọng phát triển là <strong>theo dõi và điều trị hiếm muộn</strong> – một hành trình đầy thử thách nhưng cũng chan chứa niềm hy vọng của hàng triệu gia đình. Hiểu được những khó khăn, áp lực tâm lý và gánh nặng tài chính mà các cặp vợ chồng phải đối mặt, Thành Nhân đã xây dựng Trung tâm Hỗ trợ Sinh sản với quy trình <strong>chẩn đoán – tư vấn – điều trị toàn diện</strong>, khép kín và cá nhân hóa theo từng trường hợp cụ thể</p>
              <p>Chúng tôi quy tụ đội ngũ bác sĩ chuyên khoa giỏi, từng tu nghiệp trong và ngoài nước, cùng đội ngũ điều dưỡng, kỹ thuật viên và chuyên viên tư vấn tâm lý giàu kinh nghiệm. Kết hợp với hệ thống máy móc tiên tiến đạt chuẩn quốc tế, Bệnh viện Thành Nhân tự tin mang đến các <strong>giải pháp điều trị hiệu quả, an toàn và tối ưu nhất.</strong></p>
              <p>Mỗi bệnh nhân đến với Thành Nhân đều được chăm sóc bằng cả y đức và trái tim, bởi chúng tôi hiểu rằng mỗi một sinh linh chào đời là kết quả của một hành trình đầy nghị lực và tình yêu thương. Chúng tôi không chỉ điều trị bằng y học, mà còn điều trị bằng sự thấu hiểu và lòng nhân ái. Mỗi bệnh nhân đến với Thành Nhân đều được chăm sóc bằng cả y đức và trái tim, bởi chúng tôi hiểu rằng <strong>mỗi một sinh linh chào đời là kết quả của một hành trình đầy nghị lực và tình yêu thương.</strong></p>
            </div>
            <div className="hero-image-box">
              <img src={hospital1} alt="Bệnh viện Thành Nhân" className="hospital-img" />
              <div className="hero-icons">
                <a href="/tu-van-kham-benh">
                  <img src={logo01} alt="Tư vấn khám bệnh" className="icon-img" />
                </a>
                <a href="/dat-lich-kham-benh">
                  <img src={logo02} alt="Đặt lịch khám bệnh" className="icon-img" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <ListServiceHome />

        <Footer />

      </div >


    </>
  );
};

export default Home;
