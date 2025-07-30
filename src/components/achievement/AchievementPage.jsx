import React, { useState, useEffect } from "react";
import "../../styles/achievement/AchievementPage.css";
import Header from "../Header";
import Navbar from "../Navbar";
import Footer from "../Footer";

const AchievementPage = () => {
    const [activeSection, setActiveSection] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    const achievements = [
        {
            id: 1,
            title: "Hơn 50.000 ca điều trị thành công",
            description: "Mỗi năm với tỷ lệ phục hồi cao và mức độ hài lòng từ bệnh nhân trên 95%",
            icon: "🏥",
            stats: "50,000+",
            category: "medical"
        },
        {
            id: 2,
            title: "Kỹ thuật cao tiên tiến",
            description: "Mổ nội soi, tán sỏi ngoài cơ thể, điều trị ung thư bằng hóa trị - xạ trị kết hợp",
            icon: "⚕️",
            stats: "20+",
            category: "technology"
        },
        {
            id: 3,
            title: "Trung tâm hỗ trợ sinh sản với nhiều phương pháp tiên tiến",
            description: "Đạt tỉ lệ thành công cao vượt mức trung bình quốc gia",
            icon: "👶",
            stats: "85%",
            category: "fertility"
        },
        {
            id: 4,
            title: "Chứng nhận ISO 9001:2015",
            description: "Trong quản lý và điều hành bệnh viện",
            icon: "🏆",
            stats: "ISO",
            category: "quality"
        },
        {
            id: 5,
            title: "Nghiên cứu khoa học",
            description: "Hơn 100 đề tài nghiên cứu y khoa ứng dụng thực tiễn",
            icon: "🔬",
            stats: "100+",
            category: "research"
        },
        {
            id: 6,
            title: "Khám bệnh miễn phí",
            description: "Hơn 300 đợt khám bệnh miễn phí cho người nghèo tại các vùng sâu vùng xa",
            icon: "❤️",
            stats: "300+",
            category: "community"
        }
    ];

    const sections = [
        {
            title: "Giới thiệu chung",
            content: "Trải qua hành trình hơn một thập kỷ không ngừng nỗ lực và phát triển, Bệnh viện Đa khoa Thành Nhân đã từng bước khẳng định vị thế là một trong những cơ sở y tế hàng đầu tại khu vực miền Nam Việt Nam."
        },
        {
            title: "Thành tựu y tế",
            content: "Với sứ mệnh 'Đặt người bệnh làm trung tâm', chúng tôi không chỉ chú trọng vào chất lượng chuyên môn cao mà còn đặt yếu tố nhân văn, tận tâm và chuyên nghiệp vào từng hoạt động khám chữa bệnh."
        },
        {
            title: "Nghiên cứu & Đào tạo",
            content: "Chúng tôi đẩy mạnh hoạt động nghiên cứu khoa học và đào tạo chuyên môn với hơn 100 đề tài nghiên cứu y khoa ứng dụng thực tiễn được thực hiện."
        },
        {
            title: "Hoạt động cộng đồng",
            content: "Bệnh viện Thành Nhân còn là địa chỉ tin cậy trong các hoạt động vì cộng đồng với hơn 300 đợt khám bệnh miễn phí cho người nghèo."
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(prev => ({
                        ...prev,
                        [entry.target.id]: entry.isIntersecting
                    }));
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[id^="section-"]').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const filterAchievements = (category) => {
        if (category === 'all') return achievements;
        return achievements.filter(achievement => achievement.category === category);
    };

    const [filter, setFilter] = useState('all');
    const [filteredAchievements, setFilteredAchievements] = useState(achievements);

    useEffect(() => {
        setFilteredAchievements(filterAchievements(filter));
    }, [filter]);

    return (
        <>
            <Header />
            <Navbar />
            <div className="ach-page-container">
                <header className="ach-page-hero">
                    <div className="ach-page-hero-content">
                        <h1 className="ach-page-hero-title">THÀNH TỰU NỔI BẬT</h1>
                        <h2 className="ach-page-hero-subtitle">BỆNH VIỆN ĐA KHOA THÀNH NHÂN</h2>
                        <div className="ach-page-hero-statistics">
                            <div className="ach-page-stat-item">
                                <span className="ach-page-stat-number">10+</span>
                                <span className="ach-page-stat-label">Năm kinh nghiệm</span>
                            </div>
                            <div className="ach-page-stat-item">
                                <span className="ach-page-stat-number">50K+</span>
                                <span className="ach-page-stat-label">Bệnh nhân</span>
                            </div>
                            <div className="ach-page-stat-item">
                                <span className="ach-page-stat-number">95%</span>
                                <span className="ach-page-stat-label">Hài lòng</span>
                            </div>
                        </div>
                    </div>
                </header>

                <nav className="ach-page-tabs">
                    {sections.map((section, index) => (
                        <button
                            key={index}
                            className={`ach-page-tab-btn ${activeSection === index ? 'ach-page-tab-active' : ''}`}
                            onClick={() => setActiveSection(index)}
                        >
                            {section.title}
                        </button>
                    ))}
                </nav>


                <section className="ach-page-main-content">
                    <div className={`ach-page-content-wrapper ${isVisible[`section-${activeSection}`] ? 'ach-page-content-visible' : ''}`} id={`section-${activeSection}`}>
                        <h3 className="ach-page-content-title">{sections[activeSection].title}</h3>
                        <p className="ach-page-content-desc">{sections[activeSection].content}</p>
                    </div>
                </section>


                <div className="ach-page-filter-section">
                    <h3>Lọc thành tựu theo danh mục</h3>
                    <div className="ach-page-filter-controls">
                        {['all', 'medical', 'technology', 'fertility', 'quality', 'research', 'community'].map(category => (
                            <button
                                key={category}
                                className={`ach-page-filter-btn ${filter === category ? 'ach-page-filter-active' : ''}`}
                                onClick={() => setFilter(category)}
                            >
                                {category === 'all' ? 'Tất cả' :
                                    category === 'medical' ? 'Y tế' :
                                        category === 'technology' ? 'Công nghệ' :
                                            category === 'fertility' ? 'Sinh sản' :
                                                category === 'quality' ? 'Chất lượng' :
                                                    category === 'research' ? 'Nghiên cứu' : 'Cộng đồng'}
                            </button>
                        ))}
                    </div>
                </div>


                <div className="ach-page-grid">
                    {filteredAchievements.map((achievement, index) => (
                        <div
                            key={achievement.id}
                            className={`ach-page-grid-item ${selectedAchievement === achievement.id ? 'ach-page-item-selected' : ''}`}
                            onClick={() => setSelectedAchievement(selectedAchievement === achievement.id ? null : achievement.id)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="ach-page-item-icon">{achievement.icon}</div>
                            <div className="ach-page-item-stats">{achievement.stats}</div>
                            <h4 className="ach-page-item-title">{achievement.title}</h4>
                            <p className="ach-page-item-desc">{achievement.description}</p>
                            <div className="ach-page-item-hover">
                                <span>Nhấn để xem chi tiết</span>
                            </div>
                        </div>
                    ))}
                </div>


                {selectedAchievement && (
                    <div className="ach-page-popup-overlay" onClick={() => setSelectedAchievement(null)}>
                        <div className="ach-page-popup-content" onClick={(e) => e.stopPropagation()}>
                            {(() => {
                                const achievement = achievements.find(a => a.id === selectedAchievement);
                                return (
                                    <>
                                        <button className="ach-page-popup-close" onClick={() => setSelectedAchievement(null)}>×</button>
                                        <div className="ach-page-popup-header">
                                            <div className="ach-page-popup-icon">{achievement.icon}</div>
                                            <h3>{achievement.title}</h3>
                                        </div>
                                        <div className="ach-page-popup-body">
                                            <p>{achievement.description}</p>
                                            <div className="ach-page-popup-stats">
                                                <div className="ach-page-popup-stat">
                                                    <span className="ach-page-popup-value">{achievement.stats}</span>
                                                    <span className="ach-page-popup-desc">Chỉ số đạt được</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}


                <section className="ach-page-timeline-wrapper">
                    <h3 className="ach-page-timeline-heading">Hành trình phát triển</h3>
                    <div className="ach-page-timeline-container">
                        <div className="ach-page-timeline-event">
                            <div className="ach-page-timeline-dot"></div>
                            <div className="ach-page-timeline-info">
                                <h4>2014</h4>
                                <p>Thành lập bệnh viện với tầm nhìn phục vụ cộng đồng</p>
                            </div>
                        </div>
                        <div className="ach-page-timeline-event">
                            <div className="ach-page-timeline-dot"></div>
                            <div className="ach-page-timeline-info">
                                <h4>2018</h4>
                                <p>Đạt chứng nhận ISO 9001:2015</p>
                            </div>
                        </div>
                        <div className="ach-page-timeline-event">
                            <div className="ach-page-timeline-dot"></div>
                            <div className="ach-page-timeline-info">
                                <h4>2021</h4>
                                <p>Khánh thành Trung tâm hỗ trợ sinh sản</p>
                            </div>
                        </div>
                        <div className="ach-page-timeline-event">
                            <div className="ach-page-timeline-dot"></div>
                            <div className="ach-page-timeline-info">
                                <h4>2024</h4>
                                <p>Mở rộng quy mô</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="ach-page-action-section">
                    <div className="ach-page-action-content">
                        <h3>Đồng hành cùng sức khỏe của bạn</h3>
                        <p>Hãy để chúng tôi chăm sóc sức khỏe cho bạn và gia đình</p>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
};

export default AchievementPage;
