import React, { useEffect, useState } from "react";
import ServiceCard from "../../components/service-management/ServiceCard";
import { useAuth } from "../../context/AuthContext";
import { LIST_SERVICE } from "../../api/apiUrls";
import "../../styles/service-management/ListService.css";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const ListService = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getJsonAuthHeader } = useAuth();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(LIST_SERVICE, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setServices(data.data);
                } else {
                    console.error("Lỗi khi gọi API danh sách dịch vụ");
                }
            } catch (error) {
                console.error("Lỗi kết nối:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return (
        <>
            <Header />
            <Navbar />
            <div className="service-list-page">
                <h2 className="service-list-title">Danh sách dịch vụ</h2>
                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <div className="service-list-grid">
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                id={service.id}
                                serviceName={service.serviceName}
                                subTitle={service.subTitle}
                                imgUrl={service.imgUrl}
                                slug={service.slug}
                                price={service.price} 
                            />
                        ))}

                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ListService;
