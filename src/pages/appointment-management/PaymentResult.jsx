import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; 
import "../../styles/appointment-management/PaymentResult.css"
import Header from "../../components/Header.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
export default function PaymentResult() {
    const [status, setStatus] = useState("loading");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const checkPaymentResult = async () => {
            const token = localStorage.getItem("token");
            const appointmentPending = localStorage.getItem("appointmentPending");

            if (!appointmentPending) {
                setStatus("invalid");
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/payment-result" + searchParams.toString(), {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Lỗi khi xác thực kết quả thanh toán");

                const data = await res.json();
                const paymentCode = data.data;

                if (paymentCode === "00") {
                    // ✅ Gọi API xác nhận lịch khám
                    const confirmRes = await fetch("http://localhost:8080/api/appointments/confirm-appointment", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (!confirmRes.ok) throw new Error("Lỗi khi xác nhận lịch khám");

                    setStatus("success");
                    localStorage.removeItem("appointmentPending");
                } else {
                    setStatus("failure");
                }
            } catch (error) {
                console.error(error);
                setStatus("error");
            }
        };

        checkPaymentResult();
    }, [searchParams]);

    const thanhToanLai = async () => {
        // e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/payment/vn-pay", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })

        if (!res.ok) {
            throw new Error("Lỗi khi gọi API thanh toán lại")
        } else {
            const data = await res.json();
            window.location.href = data.data.paymentUrl;
        }

    }
    return (
        <>
            <Header />
            <Navbar />
            <div className="layout-thu-cam-on" >
                {
                    status === "success" && (
                        <div className="thu-cam-on">
                            <div className="title-paymentRS" >
                                <h1>DĂNG KÝ KHÁM BỆNH THÀNH CÔNG</h1>
                            </div>

                            <div className="khung-thong-tin-pr">
                                <div className="thong-tin-pr">
                                    <p><b>Kính gửi Quý khách</b><br />
                                        Hệ thống Bệnh viện Đa khoa Thành Nhân cảm ơn quý khách đã gửi yêu cầu đặt lịch khám thông qua trang website của bệnh viện.<br /><br />
                                        Yêu cầu của quý khách đã được chuyển đến bộ phận Tổng đài, và chúng tôi sẽ liên hệ lại với quý khách theo số điện thoại 0123456789 để xác nhận lịch hẹn.<br /><br />
                                        Trường hợp quý khách cần hỗ trợ thêm, xin vui lòng liên hệ đến số hotline:<br />
                                        <b>Bệnh viện Đa khoa Thành Nhân TP. HCM: 123-456-7890 <br /><br />
                                            Trân trọng cảm ơn!</b>
                                    </p>
                                </div>
                                <br /><br />
                                <button onClick={navigate("/")} >TRANG CHỦ</button>
                            </div>
                        </div>
                    )
                }

                {
                    status === "failure" && (
                        <div className="thu-cam-on">
                            <div className="title-paymentRS">
                                <h1>THANH TOÁN THẤT BẠI.</h1>
                            </div>
                            <button onClick={thanhToanLai} >THANH TOÁN LẠI</button>
                        </div>
                    )
                }

                <div className="payment-result-container">
                    {status === "loading" && <p>🔄 Đang xử lý kết quả thanh toán...</p>}

                    {status === "invalid" && <div className="error-box">⚠️ Không tìm thấy lịch thanh toán đang chờ.</div>}
                    {status === "error" && <div className="error-box">🚫 Có lỗi xảy ra khi xác minh kết quả thanh toán.</div>}
                </div>
            </div>

            <Footer />
        </>

    );
}
