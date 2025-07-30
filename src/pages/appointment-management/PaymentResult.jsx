import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/appointment-management/PaymentResult.css";
import Header from "../../components/Header.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { PAYMENT_VNPAY_CALLBACK, CONFIRM_APPOINTMENT, PAYMENT_VNPAY } from "../../api/apiUrls";

export default function PaymentResult() {
    const [status, setStatus] = useState("loading");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const amount = 300000;
    const bankCode = "VNBANK";
    useEffect(() => {
        const checkPaymentResult = async () => {
            const token = localStorage.getItem("token");
            const appointmentPending = localStorage.getItem("appointmentPending");

            // if (!appointmentPending) {
            //     setStatus("invalid");
            //     return;
            // }

            try {
                const searchParams = new URLSearchParams(window.location.search);

                const res = await fetch(`${PAYMENT_VNPAY_CALLBACK}?${searchParams.toString()}`, {
                    method: "GET",
                    // headers: {
                    //     "Authorization": `Bearer ${token}`
                    // }
                });

                if (!res.ok) throw new Error("Lỗi khi xác thực kết quả thanh toán");

                const data = await res.json();
                const paymentCode = data.data.code;
                const date = localStorage.getItem("selectedDate")
                console.log(paymentCode);
                if (paymentCode === "00") {
                    // const confirmRes = await fetch(`${CONFIRM_APPOINTMENT}?date=${date}`, {
                    //     method: "PUT",
                    //     headers: {
                    //         // "Authorization": `Bearer ${token}`,
                    //         "Content-Type": "application/json"
                    //     }
                    // });

                    // if (!confirmRes.ok) throw new Error("Lỗi khi xác nhận lịch khám");

                    setStatus("success");
                    localStorage.removeItem("appointmentPending");
                } else {
                    setStatus("failure");
                }
            } catch (error) {
                console.error("error");
                setStatus("error");
            }
        };

        checkPaymentResult();
    }, [searchParams]);

    const thanhToanLai = async () => {
        // e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch(`${PAYMENT_VNPAY}?amount=${amount}&vnp_BankCode=${bankCode}`, {
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
            <div className="payment-result-layout">
                {status === "success" && (
                    <div className="payment-result-success">
                        <div className="payment-result-title">
                            <h1>ĐĂNG KÝ KHÁM BỆNH THÀNH CÔNG</h1>
                        </div>

                        <div className="payment-result-info-box">
                            <div className="payment-result-info">
                                <p><b>Kính gửi Quý khách</b><br />
                                    Hệ thống Bệnh viện Đa khoa Thành Nhân cảm ơn quý khách đã gửi yêu cầu đặt lịch khám thông qua trang website của bệnh viện.<br /><br />
                                    Yêu cầu của quý khách đã được chuyển đến bộ phận Tổng đài, và chúng tôi sẽ liên hệ lại với quý khách theo số điện thoại 0123456789 để xác nhận lịch hẹn.<br /><br />
                                    Trường hợp quý khách cần hỗ trợ thêm, xin vui lòng liên hệ đến số hotline:<br />
                                    <b>Bệnh viện Đa khoa Thành Nhân TP. HCM: 123-456-7890 <br /><br />
                                        Trân trọng cảm ơn!</b>
                                </p>
                            </div>
                            <br /><br />
                            <div className="payment-result-buttons">
                                <button onClick={() => navigate("/")}>TRANG CHỦ</button>
                            </div>
                        </div>
                    </div>
                )}

                {status === "failure" && (
                    <div className="payment-result-failure">
                        <div className="payment-result-title">
                            <h1>THANH TOÁN THẤT BẠI.</h1>
                        </div>
                        <div className="payment-result-buttons">
                            <button onClick={thanhToanLai}>THANH TOÁN LẠI</button>
                        </div>
                    </div>
                )}

                <div className="payment-result-container">
                    {status === "loading" && <p>🔄 Đang xử lý kết quả thanh toán...</p>}
                    {status === "invalid" && <div className="payment-result-error"> Không tìm thấy lịch thanh toán đang chờ.</div>}
                    {status === "error" && <div className="payment-result-error"> Có lỗi xảy ra khi xác minh kết quả thanh toán.</div>}
                </div>
            </div>


            <Footer />
        </>

    );
}
