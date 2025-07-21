import { CONSULTATION_FORM } from "../../api/apiUrls";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import "../../styles/consultation-management/ConsultationForm.css"
import { useState } from "react";

function ConsultationForm() {
    const [formData, setFormData] = useState({
        patientName: "",
        phoneNumber: "",
        email: "",
        message: ""
    })

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmitTVForm = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(CONSULTATION_FORM, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log(formData)

            if (response.ok) {
                setToastMessage("Thông tin tư vấn đã được gửi thành công!");
                setIsSuccess(true);
                setShowToast(true);
                setFormData({
                    patientName: "",
                    phoneNumber: "",
                    email: "",
                    message: ""
                });
            } else {
                setToastMessage("Gửi không thành công: " + data.message);
                setIsSuccess(false);
                setShowToast(true);
            }
        } catch (err) {
            setToastMessage("Có lỗi xảy ra khi gửi!");
            setIsSuccess(false);
            setShowToast(true);
        }
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
    };

    return (
        <>
            <Header />
            <Navbar />
            <div className="consultation-form-wrapper">

                <div className="consultation-form-title">
                    <h2>ĐƠN TƯ VẤN KHÁM</h2>
                </div>
                <div className="consultation-form-container">
                    <p>Vui lòng nhập thông tin của bạn</p>
                    <form onSubmit={handleSubmitTVForm}>
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            value={formData.patientName}
                            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                            required
                            onInput={(e) => {
                                if (!e.target.value.trim()) {
                                    e.target.setCustomValidity("Vui lòng nhập tên. Tên không được để trống");
                                }
                                e.target.setCustomValidity("");
                            }}
                        /> <br />

                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            required
                            onInput={(e) => {
                                if (!e.target.value.trim()) {
                                    e.target.setCustomValidity("Vui lòng nhập số điện thoại. Số điện thoại không được để trống")
                                    e.target.reportValidity();
                                } else if (!/^0\d{9}$/.test(e.target.value)) {
                                    e.target.setCustomValidity("Vui lòng nhập đúng định dạng. Bắt đầu từ số 0 và có 10 số.")
                                    e.target.reportValidity();
                                } else {
                                    e.target.setCustomValidity("")
                                }
                            }}
                        /><br />

                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            onInput={(e) => {
                                const value = e.target.value.trim();
                                if (!value) {
                                    e.target.setCustomValidity("Vui lòng nhập email. Email không được để trống");
                                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                                    e.target.setCustomValidity("Vui lòng nhập đúng định dạng email.");
                                } else {
                                    e.target.setCustomValidity("");
                                }
                            }}
                        /><br />

                        <textarea
                            placeholder="Nhập nội dung cần tư vấn"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            onInput={(e) => {
                                if (!e.target.value.trim()) {
                                    e.target.setCustomValidity("Vui lòng nhập nội dung cần tư vấn.");
                                }
                                e.target.setCustomValidity("");
                            }}
                        /><br />

                        <button className="consultation-form-submit-button" type="submit">
                            GỬI THÔNG TIN
                        </button>
                    </form>
                </div>
            </div>

            {showToast && (
                <div className={`consultation-form-toast ${isSuccess ? "success" : "error"}`}>
                    {toastMessage}
                </div>
            )}

            <Footer />
        </>
    );
}
export default ConsultationForm;
