import Header from "../../components/Header.jsx";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import { useEffect, useRef, useState } from "react";
import "../../styles/appointment-management/BookAppointment.css"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


import { useSearchParams } from "react-router-dom";
export default function BookAppointment() {
    const [datLichKhamTheo, setDatLichKhamTheo] = useState("doctor");
    const [buocTiepTheo, setBuocTiepTheo] = useState(true)

    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [doctorList, setDoctorList] = useState([]);
    const [showCalender, setShowCalender] = useState(false);
    const [showDobCalendar, setShowDobCalendar] = useState(false);

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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchWithAuth("url", {
                    method: "GET",
                })
                if (!userData.ok) throw new Error("Lỗi khi gọi API thông tin người dùng");
                const data = await userData.json();
                setFormData((prev) => ({
                    ...prev,
                    patientName: data.data.patientName,
                    phoneNumber: data.data.phoneNumber,
                    gender: data.data.gender,
                    dob: data.data.dob
                }))
            } catch (error) {
                console.error("Lỗi lấy thông tin người dùng:", error);
            }
        }
        fetchUserData();

    }, []);



    useEffect(() => {

        const fetchData = async () => {
            try {
                let url = "";
                if (datLichKhamTheo === "doctor") {
                    url = "http://localhost:8080/api/user/appointments/available-doctors";
                } else if (datLichKhamTheo === "date") {
                    url = "http://localhost:8080/api/schedules/available-dates-by-date";
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

    const calendarRef = useRef("");
    const dobCalendarRef = useRef("");
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalender(false);
            }
            if (dobCalendarRef.current && !dobCalendarRef.current.contains(event.target)) {
                setShowDobCalendar(false);
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
                const res = await fetchWithAuth("http://localhost:8080/api/schedules/available-dates-by-doctor?id=" + bacSi, {
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
            setFormData({ ...formData, date: dateStr, time: "" })
            setSelectedDate(dateStr);
            try {
                const res = await fetchWithAuth("http://localhost:8080/api/schedules/slots?id=" + formData.doctorID + "&date=" + dateStr, {
                    method: "GET"
                })
                if (!res.ok) throw new Error("Lỗi khi gọi api giờ làm việc của bác sĩ")
                const data = await res.json()
                setAvailableTimes(data.data)
            } catch (error) {
                console.error(error)
            }
        } else {
            setAvailableTimes([])
        }
    }

    const handleDateChangeTheoNgay = async (date) => {
        const dateStr = formatDate(date);
        if (availableDates.includes(dateStr)) {
            setFormData({ ...formData, date: dateStr, time: "" });
            setSelectedDate(dateStr);
            // Gọi API lấy giờ dựa trên ngày (theo ngày)
            try {
                const res = await fetchWithAuth("http://localhost:8080/api/schedules/slots-by-date?date=" + dateStr, {
                    method: "GET"
                })
                if (!res.ok) throw new Error("Lỗi khi gọi api giờ khám theo ngày")
                const data = await res.json()
                setAvailableTimes(data.data)
            } catch (error) {
                console.error(error)
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
            return <div className="dot"></div>; // dot là dấu tròn nhỏ
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
        if (!formData.date || !formData.time || !formData.patientName.trim() || !formData.phoneNumber.trim() || !formData.dob.trim() || !formData.gender) {
            alert("Vui lòng điền đầy đủ thông tin trước khi tiếp tục.");
            return;
        }
        console.log("Dữ liệu gửi lên:", formData);
        try {
            const response = await fetchWithAuth("http://localhost:8080/api/appointments/create", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Lỗi khi gửi data lên server " + response.status);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error("Lỗi từ API: " + data.message);
            }

            localStorage.setItem("appointmentPending", "true");
            // ✅ Sau khi đặt lịch xong thì gọi VNPay
            const paymentResponse = await fetchWithAuth("http://localhost:8080/api/payment/vn-pay?amount=300000&vnp_BankCode=VNBANK", {
                method: "GET"
            });
            if (!paymentResponse.ok) {
                throw new Error("Lỗi khi gọi VNPay");
            } else {
                const paymentData = await paymentResponse.json();
                window.location.href = paymentData.data.paymentUrl;
            }


        } catch (error) {
            console.error("Lỗi khi đặt lịch:", error);
            alert("❌ Đặt lịch thất bại: " + error.message);
        }

    };

    return (
        <>
            <Header />
            <Navbar />

            <div className="form-dangkylichkham">
                <div className="title" >
                    <h1>ĐĂNG KÝ KHÁM BỆNH</h1>
                </div>


                <div className="khung-dat-lich">

                    <p className="loi_mo_dau"><i>Đối với các khách hàng lần đầu đến khám và sử dụng dịch vụ tại Hệ thống Bệnh viện Đa khoa Thành Nhân, xin vui lòng cung cấp đầy đủ các thông tin của người đến khám theo mẫu bên dưới. Việc cung cấp đầy đủ thông tin sẽ giúp Quý khách tiết kiệm được thời gian làm hồ sơ khách hàng tại bệnh viện.</i></p>

                    <div className="chon-loai-dich-vu">
                        <p>ĐẶT LỊCH KHÁM</p>
                        <div className="nut-chon-dich-vu">
                            <button className={datLichKhamTheo === "doctor" ? 'active' : ''}
                                onClick={() => setDatLichKhamTheo("doctor")}
                            >THEO BÁC SĨ</button>
                            <button className={datLichKhamTheo === "date" ? 'active' : ''}
                                onClick={() => setDatLichKhamTheo("date")}>THEO NGÀY</button>
                        </div>

                    </div>


                    <br /><br />
                    <div className="hang_dau">
                        <div>
                            {
                                datLichKhamTheo === "doctor" && (
                                    <form onSubmit={handleSubmit} >
                                        <div className="doctor">
                                            <p>Chọn bác sĩ:</p>
                                            <select value={formData.doctorID} onChange={handleChonBacSiTheoBacSi}
                                                required
                                            >

                                                <option value="">Chọn bác sĩ</option>
                                                {
                                                    doctorList.map((bacSi) => (
                                                        <option key={bacSi.id} value={bacSi.id}>{bacSi.fullName}</option>
                                                    )
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </form>
                                )
                            }
                        </div>
                        <div>
                            {
                                buocTiepTheo === true && (
                                    <form onSubmit={handleSubmit}>
                                        <div className="date">
                                            <p>Chọn ngày - khung giờ muốn khám:</p>
                                            <div className="input-calendar-wrapper">
                                                <input type="text"
                                                    readOnly
                                                    className="chon-ngay"
                                                    value={(selectedDate && selectedTime) ? `Bạn đã chọn ngày ${selectedDate}   -    ${selectedTime}` : ''}
                                                    placeholder="Chọn ngày - giờ muốn khám"
                                                    onClick={() => setShowCalender(true)} />

                                                {
                                                    showCalender === true && (



                                                        <div ref={calendarRef} className="lich-container">
                                                            <Calendar
                                                                onChange={datLichKhamTheo === "doctor" ? handleDateChange : handleDateChangeTheoNgay}
                                                                tileClassName={tileClassName}
                                                                tileContent={tileContent}
                                                                showNeighboringMonth={false}
                                                                className="khung-lich"
                                                            />

                                                            <div className="legend">
                                                                <span className="dot_blue"></span> Ngày bác sĩ có lịch khám
                                                            </div>

                                                            <div className="time-section">
                                                                <h4>Chọn khung giờ khám</h4>
                                                                {!selectedDate ? (
                                                                    <div className="time-box">Vui lòng chọn ngày trước</div>
                                                                ) : (
                                                                    <div className="time-list">
                                                                        {availableTimes.map((time, index) => (
                                                                            <button
                                                                                key={index}
                                                                                className={`time-btn ${selectedTime === time ? 'active' : ''}`}
                                                                                onClick={() => {
                                                                                    setSelectedTime(time)
                                                                                    setFormData({ ...formData, time: time })
                                                                                }}
                                                                            >
                                                                                {time}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <button
                                                                className="submit-btn"
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
                                    </form>
                                )
                            }
                        </div>

                    </div>

                    {
                        buocTiepTheo === true && (
                            <form onSubmit={handleSubmit}>
                                <div className="hang_hai" >
                                    <div className="information">
                                        <p>Họ và tên:</p>
                                        <input type="text"
                                            required
                                            placeholder="Họ và tên"
                                            value={formData.patientName}
                                            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                            onInput={(e) => {
                                                if (!e.target.value.trim()) {
                                                    e.target.setCustomValidity("Vui lòng nhập tên , không được để trống");
                                                    e.target.reportValidity();
                                                } else {
                                                    e.target.setCustomValidity("");
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="information">
                                        <p>Số điện thoại:</p>
                                        <input type="text"
                                            placeholder="Nhập số điện thoại"
                                            value={formData.phoneNumber}
                                            required
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            onInput={(e) => {
                                                if (!e.target.value.trim()) {
                                                    e.target.setCustomValidity("Vui lòng nhập số điện thoại , không được để trống");
                                                    e.target.reportValidity();
                                                } else {
                                                    e.target.setCustomValidity("");
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="hang_ba" >
                                    <div className="information">
                                        <p>Giới tính:</p>
                                        <select placeholder="Vui lòng lựa chọn giới tính"
                                            value={formData.gender}
                                            required
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="">Vui lòng lựa chọn giới tính</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                        </select>
                                    </div>
                                    <div className="information">
                                        <p>Chọn ngày sinh:</p>
                                        <div className="input-calendar-wrapper">
                                            <input
                                                type="text"
                                                placeholder="Chọn ngày sinh"
                                                readOnly
                                                value={formData.dob ? `Ngày sinh: ${formData.dob}` : ''}
                                                onClick={() => setShowDobCalendar(true)}
                                                className="input-date"
                                            />
                                            {showDobCalendar && (

                                                <div ref={dobCalendarRef} className="lich-container">
                                                    <Calendar
                                                        onChange={(date) => {
                                                            const dateStr = formatDate(date);
                                                            setFormData({ ...formData, dob: dateStr })
                                                            setShowDobCalendar(false);
                                                        }}
                                                        showNeighboringMonth={false}
                                                        maxDate={new Date()}  // không cho chọn ngày tương lai
                                                        className="khung-lich"
                                                    />
                                                </div>


                                            )}
                                        </div>
                                    </div>
                                </div>


                                <div className="submit_but">
                                    <button type="submit"><p>XÁC NHẬN ĐẶT LỊCH</p></button>
                                </div>
                            </form>
                        )
                    }

                </div>


            </div >
            <Footer />
        </>

    )
}