import '../styles/Footer.css';
import logo from "../assets/logobv.png";

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <img src={logo} alt="Logo Bệnh viện Thành Nhân" className="logo" />

      <div className="footer-column">
        <h3>THÔNG TIN LIÊN HỆ</h3>
        <p>Địa chỉ: Số 123, Đường Nguyễn Văn Cừ, Phường 2, Quận 5, TP. Hồ Chí Minh</p>
        <p>Hotline: +123-456-7890</p>
        <p>Email: benhviendakhoathanhnhan@gmail.com</p>
        <p>Thời gian làm việc: Thứ 2 – Thứ 7, 7:00 – 17:00</p>
      </div>

      <div className="footer-column">
        <h3>ĐƯỜNG DẪN NHANH</h3>
        <ul>
          <li><a href="/phuong-phap">Phương pháp</a></li>
          <li><a href="/chuyen-gia">Chuyên gia - Bác sĩ</a></li>
          <li><a href="/thanh-tuu">Thành tựu</a></li>
          <li><a href="/goc-chia-se">Góc chia sẻ</a></li>
        </ul>
      </div>
    </div>

    <div className="footer-bottom">
      © 2025 Bệnh viện Đa khoa Thành Nhân. Bảo lưu mọi quyền.
    </div>
  </footer>
);

export default Footer;
