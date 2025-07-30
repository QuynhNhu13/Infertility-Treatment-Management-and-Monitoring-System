import React from "react";
import "../../styles/achievement/ListAchievementHome.css";
import achi1 from "../../assets/achi1.png";
import achi2 from "../../assets/achi2.png";
import achi3 from "../../assets/achi3.png";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
const ListAchievementHome = () => {
    return (
        <>
            <Header />
            <Navbar />
            <div className="list-achievement-home-container">
                <div className="list-achievement-home-header">
                    <h1 className="list-achievement-home-h1">THÀNH TỰU NỔI BẬT</h1>
                    <h2 className="list-achievement-home-h2">BỆNH VIỆN ĐA KHOA THÀNH NHÂN</h2>
                </div>

                <div className="list-achievement-home-description-wrapper">
                    <p className="achievement-home-description">
                        Trải qua hành trình hơn một thập kỷ không ngừng nỗ lực và phát triển, <strong>Bệnh viện Đa khoa Thành Nhân</strong> đã từng bước khẳng định vị thế là một trong những cơ sở y tế hàng đầu tại khu vực miền Nam Việt Nam. Với sứ mệnh <em>"Đặt người bệnh làm trung tâm"</em>, chúng tôi không chỉ chú trọng vào chất lượng chuyên môn cao mà còn đặt yếu tố nhân văn, tận tâm và chuyên nghiệp vào từng hoạt động khám chữa bệnh.

                        <br /><br />
                        Hằng năm, bệnh viện tiếp nhận và điều trị cho hàng chục nghìn lượt bệnh nhân đến từ nhiều tỉnh thành khác nhau. Từ những ca bệnh thông thường cho đến những tình huống y tế phức tạp, đội ngũ bác sĩ và nhân viên y tế luôn sẵn sàng lắng nghe, tiếp cận người bệnh bằng sự đồng cảm và tôn trọng tuyệt đối. Chúng tôi đặc biệt chú trọng đến quá trình tư vấn y khoa trước điều trị, giúp bệnh nhân hiểu rõ tình trạng sức khỏe, lựa chọn được phác đồ phù hợp và an tâm suốt quá trình điều trị.

                        <br /><br />
                        Không dừng lại ở việc khám chữa bệnh, bệnh viện còn triển khai mạnh mẽ các dịch vụ chăm sóc sức khỏe chủ động như khám sức khỏe định kỳ, sàng lọc sớm các bệnh lý nguy hiểm, tư vấn tiền hôn nhân, hỗ trợ sinh sản và chăm sóc mẹ - bé sau sinh. Hệ thống tổng đài chăm sóc khách hàng và tư vấn y tế trực tuyến hoạt động liên tục nhằm hỗ trợ kịp thời mọi nhu cầu của người dân.

                        <br /><br />
                        Với cơ sở vật chất hiện đại, trang thiết bị tiên tiến và quy trình khám chữa bệnh khép kín, <strong>Thành Nhân</strong> hướng tới việc mang lại trải nghiệm y tế toàn diện – nơi bệnh nhân không chỉ được chữa bệnh mà còn được chăm sóc, lắng nghe, tư vấn tận tình như người thân trong gia đình. Chúng tôi cam kết tiếp tục mở rộng quy mô, nâng cao năng lực chuyên môn và phát triển nguồn nhân lực y tế chất lượng cao để đồng hành bền vững cùng sức khỏe cộng đồng.
                    </p>


                    <img src={achi1} alt="Thành tựu y tế" className="list-achievement-home-image" />

                    <p className="list-achievement-home-description">
                        Trong những năm gần đây, bệnh viện đã đạt được nhiều thành tựu nổi bật:
                        <ul>
                            <li> <strong>Hơn 50.000 ca điều trị thành công</strong> mỗi năm với tỷ lệ phục hồi cao và mức độ hài lòng từ bệnh nhân trên 95%.</li>
                            <li> <strong>Triển khai thành công các kỹ thuật cao</strong> như mổ nội soi, tán sỏi ngoài cơ thể, điều trị ung thư bằng hóa trị - xạ trị kết hợp.</li>
                            <li> <strong>Trung tâm hỗ trợ sinh sản IUI & IVF</strong> đạt tỉ lệ thành công cao vượt mức trung bình quốc gia.</li>
                            <li> <strong>Chứng nhận chất lượng ISO 9001:2015</strong> trong quản lý và điều hành bệnh viện.</li>
                        </ul>
                    </p>

                    <p className="list-achievement-home-description">
                        Chúng tôi còn đẩy mạnh hoạt động nghiên cứu khoa học và đào tạo chuyên môn:
                        <ul>
                            <li> Hơn 100 đề tài nghiên cứu y khoa ứng dụng thực tiễn được thực hiện.</li>
                            <li> Tổ chức thường niên <strong>Hội thảo Y học tiên tiến</strong> với sự góp mặt của các chuyên gia trong và ngoài nước.</li>
                            <li> Thực hiện các chương trình đào tạo liên tục (CME) cho đội ngũ y bác sĩ.</li>
                        </ul>
                    </p>

                    <p className="list-achievement-home-description">
                        Ngoài chuyên môn, <strong>Bệnh viện Thành Nhân</strong> còn là địa chỉ tin cậy trong các hoạt động vì cộng đồng:
                        <ul>
                            <li> Hơn 300 đợt khám bệnh miễn phí cho người nghèo tại các vùng sâu vùng xa.</li>
                            <li> Chương trình "Trái tim khỏe" khám tầm soát tim mạch cho học sinh và người cao tuổi.</li>
                            <li> Quỹ hỗ trợ y tế "Chung tay vì sự sống" giúp hơn 1.000 bệnh nhân có hoàn cảnh khó khăn được tiếp cận điều trị miễn phí.</li>
                        </ul>
                    </p>

                    <img src={achi2} alt="Khám bệnh miễn phí" className="list-achievement-home-image" />

                    <p className="achievement-home-description">
                        Với tất cả những kết quả đã đạt được trong suốt hành trình phát triển, <strong>Bệnh viện Đa khoa Thành Nhân</strong> không chỉ là nơi điều trị bệnh tật, mà còn là nơi gửi gắm niềm tin, hy vọng và khởi đầu của những hành trình mới đầy yêu thương. Chúng tôi thấu hiểu rằng, mỗi bệnh nhân đến với bệnh viện đều mang theo những câu chuyện riêng, những trăn trở về sức khỏe, nỗi lo lắng về tương lai, và đôi khi là cả những ước mơ dang dở về một gia đình trọn vẹn.

                        <br /><br />
                        Vì vậy, toàn thể đội ngũ y bác sĩ, chuyên gia và nhân viên y tế tại Thành Nhân không ngừng nỗ lực từng ngày – không chỉ để chữa lành bệnh tật, mà còn để chữa lành những lo âu, đem lại sự an tâm cho mỗi cá nhân và mỗi gia đình. Từ những cặp vợ chồng đang mong chờ một thiên thần nhỏ, đến những người cao tuổi cần chăm sóc tận tình, hay những em nhỏ cần một vòng tay ấm áp trong mỗi lần đến viện – tất cả đều xứng đáng nhận được sự phục vụ tận tâm, chu đáo và nhân văn nhất.

                        <br /><br />
                        Chúng tôi không chỉ xây dựng một cơ sở y tế hiện đại, mà còn vun đắp một mái nhà chung – nơi mà bệnh nhân được tiếp đón bằng nụ cười thân thiện, được chăm sóc bằng trái tim yêu thương và được tôn trọng như những người thân trong gia đình. Với mỗi ca bệnh được điều trị thành công, mỗi em bé được chào đời khỏe mạnh nhờ các kỹ thuật hỗ trợ sinh sản, và mỗi nụ cười rạng rỡ quay trở lại trên gương mặt bệnh nhân – đó chính là phần thưởng lớn nhất, là động lực thôi thúc chúng tôi không ngừng cố gắng.

                        <br /><br />
                        Hạnh phúc của bạn cũng là hạnh phúc của chúng tôi. Sứ mệnh của Bệnh viện Đa khoa Thành Nhân là đem lại không chỉ sức khỏe, mà còn là những khoảnh khắc trọn vẹn – khi một gia đình vỡ òa trong niềm vui đón con yêu sau bao năm chờ đợi, khi người cha khỏe lại để tiếp tục nuôi dưỡng con thơ, hay khi người bà được phục hồi để tiếp tục đồng hành cùng cháu nhỏ khôn lớn.

                        <br /><br />
                        Chúng tôi cam kết sẽ tiếp tục nâng cao chất lượng chuyên môn, đầu tư mạnh mẽ vào hiện đại hóa cơ sở vật chất, đẩy mạnh chuyển đổi số và ứng dụng công nghệ y tế tiên tiến. Đồng thời, xây dựng mô hình bệnh viện thông minh, thân thiện và kết nối – nơi con người là trung tâm, và mọi giá trị đều hướng đến sự hài lòng, an toàn và hạnh phúc của bệnh nhân.

                        <br /><br />
                        <strong>Tất cả những gì chúng tôi đã và đang nỗ lực không phải vì danh tiếng hay thành tích, mà vì một mục tiêu lớn hơn – đó là trao đi hy vọng, mang lại cuộc sống trọn vẹn và dựng xây những mái ấm hạnh phúc.</strong> Bệnh viện Đa khoa Thành Nhân sẽ luôn đồng hành trên hành trình sức khỏe của bạn, như một người bạn tin cậy, một điểm tựa vững vàng và một ngọn đèn soi sáng những ngày khó khăn nhất.
                    </p>

                    <img src={achi3} alt="Khám bệnh miễn phí" className="list-achievement-home-image" />


                </div>
            </div>
            <Footer />
        </>
    );
};

export default ListAchievementHome;
