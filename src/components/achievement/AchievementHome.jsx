import React from "react";
import { Link } from "react-router-dom";
import achievementImg from "../../assets/achievementhome.jpg";

import "../../styles/achievement/AchievementHome.css";

const AchievementHome = () => {
    return (
        <div>
            <div className="achievement-home-header">
                <div className="achievement-home-header-right">
                    <div className="achievement-home-header-left">
                        <h1 className="achievement-home-h1">THÀNH TỰU NỔI BẬT</h1>
                        <h1 className="achievement-home-h2">TRÊN HÀNH TRÌNH CHĂM SÓC SỨC KHỎE</h1>
                    </div>
                    <p className="achievement-home-description">
                        Trải qua hành trình nhiều năm hình thành và phát triển, <strong>Bệnh viện Đa khoa Thành Nhân</strong> đã không ngừng khẳng định vị thế của mình là một trong những cơ sở y tế uy tín hàng đầu tại Việt Nam.
                        Với sứ mệnh đặt sức khỏe và sự hài lòng của người bệnh lên hàng đầu, chúng tôi luôn tiên phong trong việc ứng dụng các công nghệ tiên tiến vào khám và điều trị, đồng thời xây dựng một môi trường y tế hiện đại, nhân văn và chuyên nghiệp.
                        <br /><br />
                        Những thành tựu mà Bệnh viện Đa khoa Thành Nhân đã đạt được là minh chứng rõ nét cho sự cố gắng và tâm huyết của toàn thể đội ngũ y bác sĩ, chuyên gia và cán bộ y tế. Từ những ca bệnh khó được xử lý thành công, các kỹ thuật hỗ trợ sinh sản như IUI, IVF đạt tỷ lệ thành công cao, đến việc triển khai hàng loạt dịch vụ chăm sóc sức khỏe dự phòng, tư vấn và điều trị toàn diện – mỗi bước tiến đều góp phần nâng tầm chất lượng dịch vụ y tế trong nước.
                        <br /><br />
                        Chúng tôi tự hào đã tiếp nhận và điều trị thành công cho hàng chục nghìn bệnh nhân mỗi năm, trong đó có nhiều trường hợp đặc biệt đến từ khắp các tỉnh thành trong cả nước. Bệnh viện đã được trao tặng nhiều bằng khen, giấy chứng nhận và đạt các tiêu chuẩn chất lượng y tế trong và ngoài nước, là điểm đến tin cậy của người dân trong việc chăm sóc sức khỏe lâu dài.
                        <br /><br />
                        <strong>Những thành tựu đó không chỉ là kết quả, mà còn là động lực to lớn để chúng tôi tiếp tục đổi mới, học hỏi và vươn xa hơn nữa</strong> trong hành trình phụng sự sức khỏe cộng đồng. Với tầm nhìn hướng tới trở thành bệnh viện chuẩn quốc tế, chúng tôi cam kết sẽ không ngừng nỗ lực mang lại những giá trị tốt đẹp nhất cho từng bệnh nhân, từng gia đình và toàn xã hội.
                    </p>

                    {/* <div style={{ textAlign: "center", marginTop: "5px", marginBottom: "-10px" }}>
                        <Link to="/thanh-tuu" className="achievement-home-button">
                            Xem tất cả thành tựu
                        </Link>
                    </div> */}
                </div>
            </div>

            <div className="achievement-home-image-wrapper">
                <img
                    src={achievementImg}
                    alt="Thành tựu bệnh viện Thành Nhân"
                    className="achievement-home-image"
                />
            </div>
        </div>
    );
};

export default AchievementHome;
