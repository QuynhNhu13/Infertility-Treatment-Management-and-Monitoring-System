import Header from "../../components/Header.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useEffect, useRef, useState } from "react";
import "../../styles/appointment-management/DatLichKhamBenh.css"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    APPOINTMENT_DATE, APPOINTMENT_DOCTOR, GET_USER_PROFILE, AVAILABLE_DATES_BY_DOCTOR,
    SCHEDULE_SLOTS_BY_DOCTOR_AND_DATE, SCHEDULE_SLOTS_BY_DATE, CREATE_APPOINTMENT, PAYMENT_VNPAY
} from "../../api/apiUrls.js";

export default function DatLichKhamBenh() {
    const [datLichKhamTheo, setDatLichKhamTheo] = useState("doctor");
    const [buocTiepTheo, setBuocTiepTheo] = useState(true)

    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [doctorList, setDoctorList] = useState([]);
    const [showCalender, setShowCalender] = useState(false);
    const [canNotGetCusInfo, setCanNotGetCusInfo] = useState(false);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const [formData, setFormData] = useState({
        doctorID: "",
        date: "",
        time: "",
        patientName: "",
        phoneNumber: "",
        gender: "",
        dob: ""
    })

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem("token");
        return fetch(url, {
            ...options,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    }

    const fetchUserData = async () => {
        try {
            const userData = await fetchWithAuth(GET_USER_PROFILE, {
                method: "GET",
            })
            if (!userData.ok) throw new Error("Lỗi khi gọi API thông tin người dùng");
            const data = await userData.json();
            if (data.data === null) {
                setFormData((prev) => ({
                    ...prev,
                    patientName: "",
                    phoneNumber: "",
                    gender: "",
                    dateOfBirth: ""
                }))
                setCanNotGetCusInfo(true)
                return;
            } else {
                setFormData(prev => ({
                    ...prev,
                    patientName: data.data.userName,
                    phoneNumber: data.data.phoneNumber,
                    gender: data.data.gender,
                    dob: data.data.dateOfBirth
                }))
                setCanNotGetCusInfo(false)
            }

        } catch (error) {
            console.error("Lỗi lấy thông tin người dùng:", error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])
    useEffect(() => {

        const fetchData = async () => {
            try {
                let url = "";
                if (datLichKhamTheo === "doctor") {
                    url = APPOINTMENT_DOCTOR;
                } else if (datLichKhamTheo === "date") {
                    url = APPOINTMENT_DATE;
                }

                const response = await fetchWithAuth(url, {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error("Lỗi khi gọi API");
                }

                const data = await response.json();

                if (datLichKhamTheo === "doctor") {
                    setDoctorList(data.data);
                    console.log(data.data)
                } else {
                    setAvailableDates(data.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datLichKhamTheo]);

    useEffect(() => {
        setSelectedDate("");
        setSelectedTime("");
        setAvailableTimes([]);
        setFormData((prev) => ({
            ...prev,
            date: "",
            time: ""
        }));
    }, [datLichKhamTheo]);


    const calendarRef = useRef("");
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalender(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    const handleChonBacSiTheoBacSi = async (e) => {
        let bacSi = e.target.value;

        if (!bacSi.trim()) {
            setFormData({ ...formData, doctorID: "" });
            setAvailableDates([]);
            setAvailableTimes([])
        } else {
            try {
                setFormData({ ...formData, doctorID: bacSi, date: "", time: "" }); // doctor o day dang la id roi 
                const res = await fetchWithAuth(`${AVAILABLE_DATES_BY_DOCTOR}?id=${bacSi}`, {
                    method: "GET"
                })
                if (!res.ok) throw new Error("Lỗi khi gọi api ngày làm việc của bác sĩ")
                const data = await res.json()
                setAvailableDates(data.data)
            } catch (error) {
                console.error(error)
            }
        }
    }
    const handleDateChange = async (date) => {
        const dateStr = formatDate(date);
        if (availableDates.includes(dateStr)) {
            setFormData(prev => ({
                ...prev,
                date: dateStr,
                time: ""
            }))
            setSelectedDate(dateStr);
            localStorage.setItem("selectedDate", dateStr);
            try {
                const res = await fetchWithAuth(`${SCHEDULE_SLOTS_BY_DOCTOR_AND_DATE}?id=${formData.doctorID}&date=${dateStr}`, {
                    method: "GET"
                })
                if (!res.ok) throw new Error("Lỗi khi gọi api giờ làm việc của bác sĩ")
                const data = await res.json()
                setAvailableTimes(data.data)
            } catch (error) {
                toast.error("Lỗi không thể tải danh sách giờ làm của bác sĩ" + error)
            }
        } else {
            setAvailableTimes([])
        }
    }

    const handleDateChangeTheoNgay = async (date) => {
        const dateStr = formatDate(date);
        if (availableDates.includes(dateStr)) {
            setFormData(prev => ({
                ...prev,
                date: dateStr,
                time: ""
            }))
            setSelectedDate(dateStr);
            try {
                const res = await fetchWithAuth(`${SCHEDULE_SLOTS_BY_DATE}?date=${dateStr}`, {
                    method: "GET"
                })
                if (!res.ok) throw new Error("Lỗi khi gọi api giờ khám theo ngày")
                const data = await res.json()
                setAvailableTimes(data.data)
            } catch (error) {
                toast.error("Lỗi không thể lấy được ngày làm việc của bác sĩ: " + error)
            }
        } else {
            setAvailableTimes([]);
        }
    };


    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = formatDate(date);
            if (availableDates.includes(dateStr)) {
                return 'has-appointment';
            } else {
                return 'disabled-day';
            }
        }
    }
    const tileContent = ({ date, view }) => {
        const dateStr = formatDate(date);
        if (view === 'month' && availableDates.includes(dateStr)) {
            return <div className="dot-dat-lich-kham"></div>;
        }
        return null;
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    // THEO NGAY 


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.date || !formData.time) {
            toast.warn("Vui lòng điền đầy đủ thông tin trước khi tiếp tục.");
            return;
        }
        console.log("Dữ liệu gửi lên:", formData);
        try {
            const response = await fetchWithAuth(CREATE_APPOINTMENT, {
                method: "POST",
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Lỗi khi gửi data lên server " + response.status);
            }

            // const data = await response.json();

            // if (!data.ok) {
            //     throw new Error("Lỗi từ API: " + data.message);
            // }

            else {
                toast.success("Tạo appointment thành công .")
            }

            localStorage.setItem("appointmentPending", "true");
            const paymentResponse = await fetchWithAuth(`${PAYMENT_VNPAY}?amount=300000&vnp_BankCode=VNBANK`, {
                method: "GET"
            });
            if (!paymentResponse.ok) {
                throw new Error("Lỗi khi gọi VNPay");
            } else {
                const paymentData = await paymentResponse.json();
                window.location.href = paymentData.data.paymentUrl;
            }


        } catch (error) {
            toast.error("Bạn không thể đặt 2 lịch khám trong cùng 1 ngày")
        }

    };

    return (
        <>
            <Header />
            <Navbar />
            {
                canNotGetCusInfo === true ? (
                    <div>
                        <div className="max-w-md mx-auto mt-6 p-4 bg-red-50 border border-red-300 rounded-lg text-center shadow-md">
                            <p className="text-red-700 font-semibold mb-3">
                                ⚠️ Không thể lấy thông tin người dùng.
                            </p>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                                onClick={fetchUserData}
                            >
                                Tải lại thông tin
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="form-dat-lich-kham">
                        <div className="title-dat-lich-kham">
                            <h1>ĐĂNG KÝ KHÁM BỆNH</h1>
                        </div>

                        <div className="khung-dat-lich-kham">
                            <p className="loi_mo_dau-dat-lich-kham"><i>Đối với các khách hàng lần đầu đến khám và sử dụng dịch vụ tại Hệ thống Bệnh viện Đa khoa Thành Nhân, xin vui lòng cung cấp đầy đủ các thông tin của người đến khám theo mẫu bên dưới. Việc cung cấp đầy đủ thông tin sẽ giúp Quý khách tiết kiệm được thời gian làm hồ sơ khách hàng tại bệnh viện.</i></p>

                            <div className="chon-loai-dich-vu-dat-lich-kham">
                                <p>ĐẶT LỊCH KHÁM</p>
                                <div className="nut-chon-dich-vu-dat-lich-kham">
                                    <button className={datLichKhamTheo === "doctor" ? 'active' : ''}
                                        onClick={() => setDatLichKhamTheo("doctor")}
                                    >THEO BÁC SĨ</button>
                                    <button className={datLichKhamTheo === "date" ? 'active' : ''}
                                        onClick={() => setDatLichKhamTheo("date")}>THEO NGÀY</button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="hang_dau-dat-lich-kham">
                                    <div>
                                        {
                                            datLichKhamTheo === "doctor" && (
                                                <div className="doctor-dat-lich-kham">
                                                    <p>Chọn bác sĩ:</p>
                                                    <select value={formData.doctorID} onChange={handleChonBacSiTheoBacSi} required>
                                                        <option value="">Chọn bác sĩ</option>
                                                        {doctorList.map((bacSi) => (
                                                            <option key={bacSi.id} value={bacSi.id}>{bacSi.fullName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div>
                                        {
                                            buocTiepTheo && (
                                                <div className="date-dat-lich-kham">
                                                    <p>Chọn ngày - khung giờ muốn khám:</p>
                                                    <div className="input-calendar-wrapper-dat-lich-kham">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            className="chon-ngay-dat-lich-kham"
                                                            value={(selectedDate && selectedTime) ? `Bạn đã chọn ngày ${selectedDate}   -    ${selectedTime}` : ''}
                                                            placeholder="Chọn ngày - giờ muốn khám"
                                                            onClick={() => setShowCalender(true)}
                                                        />

                                                        {
                                                            showCalender && (
                                                                <div ref={calendarRef} className="lich-container-dat-lich-kham">
                                                                    <Calendar
                                                                        onChange={datLichKhamTheo === "doctor" ? handleDateChange : handleDateChangeTheoNgay}
                                                                        tileClassName={tileClassName}
                                                                        tileContent={tileContent}
                                                                        showNeighboringMonth={false}
                                                                        className="khung-lich-dat-lich-kham"
                                                                    />

                                                                    <div className="legend-dat-lich-kham">
                                                                        <span className="dot_blue-dat-lich-kham"></span> Ngày bác sĩ có lịch khám
                                                                    </div>

                                                                    <div className="time-section-dat-lich-kham">
                                                                        <h4>Chọn khung giờ khám</h4>
                                                                        {!selectedDate ? (
                                                                            <div className="time-box-dat-lich-kham">Vui lòng chọn ngày trước</div>
                                                                        ) : (
                                                                            <div className="time-list-dat-lich-kham">
                                                                                {availableTimes.map((time, index) => (
                                                                                    <button
                                                                                        type="button"
                                                                                        key={index}
                                                                                        className={`time-btn-dat-lich-kham ${selectedTime === time ? 'active-dat-lich-kham' : ''}`}
                                                                                        onClick={() => {
                                                                                            setSelectedTime(time)
                                                                                            setFormData(prev => ({
                                                                                                ...prev,
                                                                                                time: time
                                                                                            }))
                                                                                        }}
                                                                                    >
                                                                                        {time}
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        className="submit-btn-dat-lich-kham"
                                                                        disabled={!selectedDate || !selectedTime}
                                                                        onClick={() => setShowCalender(false)}
                                                                    >
                                                                        {selectedDate && selectedTime
                                                                            ? `Chọn ngày ${selectedDate}      -     ${selectedTime} giờ`
                                                                            : 'Vui lòng chọn đầy đủ ngày và khung giờ khám'}
                                                                    </button>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                                {
                                    buocTiepTheo && (
                                        <>
                                            <div className="hang_hai-dat-lich-kham">
                                                <div className="information-dat-lich-kham">
                                                    <p>Họ và tên:</p>
                                                    <input type="text"
                                                        value={formData.patientName}
                                                        readOnly
                                                    />
                                                </div>

                                                <div className="information-dat-lich-kham">
                                                    <p>Số điện thoại:</p>
                                                    <input type="text"
                                                        value={formData.phoneNumber}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="hang_ba-dat-lich-kham">
                                                <div className="information-dat-lich-kham">
                                                    <p>Giới tính:</p>
                                                    <input type="text"
                                                        value={formData.gender}
                                                        readOnly
                                                    />
                                                </div>

                                                <div className="information-dat-lich-kham">
                                                    <p>Ngày sinh:</p>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={formData.dob}
                                                    />
                                                </div>
                                            </div>

                                            <div className="submit_but-dat-lich-kham">
                                                <button type="submit"><p>XÁC NHẬN ĐẶT LỊCH</p></button>
                                            </div>
                                        </>
                                    )
                                }
                            </form>
                        </div>
                    </div>
                )
            }

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <Footer />
        </>

    )
}