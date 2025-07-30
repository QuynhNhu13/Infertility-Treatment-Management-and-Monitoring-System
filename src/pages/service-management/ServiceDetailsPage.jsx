import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { LIST_SERVICE_DETAILS } from '../../api/apiUrls';
import '../../styles/service-management/ServiceDetailsPage.css';
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const { getAuthHeader } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(LIST_SERVICE_DETAILS(serviceId), {
          headers: getAuthHeader(),
        });
        setDetails(res.data.data); 
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu chi tiết dịch vụ:', error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchDetails();
    }
  }, [serviceId, getAuthHeader]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!details) return <div>Không tìm thấy dữ liệu.</div>;

  return (
    <>
      <Header />
      <Navbar />

      <div className="field-container">
        <h3 className="field-service-name">{details.serviceName}</h3>

        <Section title="1. Khái niệm" htmlContent={details.concept} imgUrl={details.conceptImgUrl} />
        <Section title="2. Đối tượng áp dụng" htmlContent={details.condition} />
        <Section title="3. Người thực hiện" htmlContent={details.assignment} />
        <Section title="4. Không áp dụng cho" htmlContent={details.unAssignment} />
        <Section title="5. Quy trình thực hiện" htmlContent={details.procedureDetails} imgUrl={details.procedureDetailsImgUrl} />
        <Section title="6. Tỷ lệ thành công" htmlContent={details.successRate} />
        <Section title="7. Kinh nghiệm" htmlContent={details.experience} />
        <Section title="8. Rủi ro" htmlContent={details.risk} />
        <Section title="9. Quy trình tại bệnh viện" htmlContent={details.hospitalProcedure} imgUrl={details.hospitalProcedureImgUrl} />
      </div>

      <Footer />
    </>
  );
};

const Section = ({ title, htmlContent, imgUrl }) => {
  return (
    <section className="field-section">
      <h3>{title}</h3>
      {htmlContent ? (
        <div
          className="field-rich-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p>Chưa có nội dung.</p>
      )}
      {imgUrl && <img src={imgUrl} alt={title} className="field-image" />}
    </section>
  );
};

export default ServiceDetailsPage;
