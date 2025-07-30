
import { useEffect, useState, useRef } from "react";
import "./ViewConsultationForm.css";
import { FaSearch } from "react-icons/fa";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewConsultationForm() {
    const [consultationForms, setConsultationForms] = useState([]);
    const [allConsultationForms, setAllConsultationForms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [formToDelete, setFormToDelete] = useState(null);
    const [formToDo, setFormToDo] = useState("");
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showCalender, setShowCalender] = useState(false);
    const [showDOBCalendar, setShowDOBCalendar] = useState(false);
    // const [accountToSubmit , setAccountToSubmit] = useState({});

    const ITEMS_PER_PAGE = 40;
    const totalPages = Math.ceil(consultationForms.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentConsultationForms = consultationForms.slice(startIndex, endIndex);

    const [inputAccount, setInputAccount] = useState("");
    const [inputStatus, setInputStatus] = useState("");
    const [selectedMsg, setSelectedMsg] = useState(null);
    const popupRef = useRef("");
    const calendarRef = useRef("");

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [formBookingData, setFormBookingData] = useState({
        doctorID: "",
        date: "",
        time: "",
        patientName: "",
        phoneNumber: "",
        gender: "",
        dob: ""
    })


    useEffect(() => {
        const consultations = async () => {
            const res = await fetchWithAuth("http://localhost:8080/api/consultation", {
                method: "GET",
            })
            if (!res.ok) { throw new Error("Lỗi khi gọi api lấy form tư vấn .") }
            else {
                const data = await res.json();
                const reversedData = data.data.reverse();
                setAllConsultationForms(reversedData);
                setConsultationForms(reversedData);
            }

            //     const fetchAvailableDate = await fetchWithAuth("http://localhost:8080/api/schedules/available-dates-by-date", {
            //         method: "GET",
            //     })

            //     if (!fetchAvailableDate.ok) {
            //         const errorMessage = await fetchAvailableDate.text();
            //         toast.error(`Lỗi khi lấy dữ liệu ngày trống: ${errorMessage}`);
            //         return;
            //     }
            //     const respond = await fetchAvailableDate.json();
            //     setAvailableDates(respond.data);
        }
        consultations();

    }, [])
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current &&
                !calendarRef.current.contains(event.target)) {
                setShowCalender(false);

            } if (popupRef.current &&
                !popupRef.current.contains(event.target)) {
                setShowDOBCalendar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // const fetchDate = async (account) => {
    //     setFormBookingData({ ...formBookingData, patientName: account.patientName, phoneNumber: account.phoneNumber })

    // }


    useEffect(() => {
        function handleClickOutside(event) {
            if (selectedMsg && popupRef.current && !popupRef.current.contains(event.target)) {
                setSelectedMsg(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedMsg]);

    const formatStatus = (status) => {
        switch (status) {
            case "PENDING":
                return "Đang chờ";
            case "PROCESSED":
                return "Đã xử lí";
            case "DELETED":
                return "Đã bị xóa";
            default:
                return status;
        }
    };
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem("token");
        return fetch(url, {
            ...options,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
    };

    const handleSearchForm = (e) => {
        e.preventDefault();
        const searchTerm = inputAccount.trim().toLowerCase();
        const filtered = allConsultationForms.filter((acc) => {
            const matchesSearchText = searchTerm === ""
                || acc.patientName.toLowerCase().includes(searchTerm)
                || acc.phoneNumber.includes(searchTerm)
                || acc.status.toLowerCase().includes(searchTerm)
            const matchesStatus = inputStatus ? acc.status === inputStatus : true;
            return (
                matchesSearchText &&
                matchesStatus
            );
        });
        setConsultationForms(filtered);
        setCurrentPage(1);
    }


    const handleResetSearch = () => {
        setInputAccount("");
        setInputStatus("");
        setConsultationForms(allConsultationForms);
        setCurrentPage(1);
    };

    const handleDeleteForm = async () => {
        let id = formToDelete.id;
        const res = await fetchWithAuth("http://localhost:8080/api/consultation?id=" + id, {
            method: "DELETE",
        })
        if (!res.ok) { throw new Error("Lỗi không thể xóa account.") }
        else {
            setConsultationForms((prev) =>
                prev.map((form) =>
                    form.id === formToDelete.id ? { ...form, status: "DELETED" } : form
                )
            );
            setAllConsultationForms((prev) =>
                prev.map((form) =>
                    form.id === formToDelete.id ? { ...form, status: "DELETED" } : form
                )
            );
            setFormToDelete(null);
        }

    };

    const handleToDoForm = async () => {
        let id = formToDo.id;
        let status = formToDo.status;
        const res = await fetchWithAuth(`http://localhost:8080/api/consultation?id=${id}&status=${status}`, {
            method: "PUT",
        })
        if (!res.ok) { throw new Error("Lỗi không thể xóa account.") }
        else {
            setConsultationForms((prev) =>
                prev.map((form) =>
                    form.id === formToDo.id ? { ...form, status: "PROCESSED" } : form
                )
            );
            setAllConsultationForms((prev) =>
                prev.map((form) =>
                    form.id === formToDo.id ? { ...form, status: "PROCESSED" } : form
                )
            );
            setFormToDo(null);
        }

    }

    const ngayTrong = async () => {
        try {
            const respond = await fetchWithAuth("http://localhost:8080/api/schedules/available-dates-by-date", {
                method: "GET"
            })
            if (!respond.ok) throw new Error("Lỗi khi gọi api ngày khám")
            const data = await respond.json()
            setAvailableDates(data.data)
            console.log(data.data)
        } catch (error) {
            toast.error("Lỗi không thể lấy được ngày trống " + error)

        }
    }

    const handleDateChangeTheoNgay = async (date) => {
        const dateStr = formatDate(date);
        if (availableDates.includes(dateStr)) {
            setFormBookingData(prev => ({
                ...prev,
                date: dateStr,
                time: ""
            }))
            setSelectedDate(dateStr);

            try {
                const res = await fetchWithAuth("http://localhost:8080/api/schedules/available-slots-by-date?date=" + dateStr, {
                    method: "GET"
                })
                if (!res.ok) throw new Error("Lỗi khi gọi api giờ khám theo ngày")
                const data = await res.json()
                setAvailableTimes(data.data)
            } catch (error) {
                toast.error("Lỗi không thể lấy được giờ trống " + error)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formBookingData.date || !formBookingData.time) {
            toast.warn("Vui lòng điền đầy đủ thông tin trước khi tiếp tục.");
            return;
        }
        console.log("Dữ liệu gửi lên:", formBookingData);
        try {

            const payment = await fetchWithAuth("http://localhost:8080/api/payment/vn-pay?amount=300000&vnp_BankCode=VNBANK", {
                method: "GET",
            })
            if (!payment.ok) {
                const errorMessage = await payment.text();
                toast.error(`Lỗi khi gửi data lên server: ${errorMessage}`);
                return;
            }

            const response = await fetchWithAuth("http://localhost:8080/api/appointments/create", {
                method: "POST",
                body: JSON.stringify(formBookingData)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                toast.error(`Lỗi khi gửi data lên server: ${errorMessage}`);
                return;
            }
            if (response.ok) {
                toast.success("Tạo lịch khám thành công.");
                setFormBookingData({
                    doctorID: "",
                    date: "",
                    time: "",
                    patientName: "",
                    phoneNumber: "",
                    gender: "",
                    dob: ""
                })
                setShowBookingForm(false);
            }


        } catch (error) {
            toast.error("Lỗi khi gọi API tạo lịch hẹn" + error)
        }

    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />

            <div className="khung-xem-don-tu-van">
                <form className="thanh-tim-kiem-account-xem-don-tu-van" onSubmit={handleSearchForm}>
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email hoặc trạng thái..."
                        value={inputAccount}
                        onChange={(e) => setInputAccount(e.target.value)}
                    />
                    <select value={inputStatus} onChange={(e) => setInputStatus(e.target.value)}>
                        <option value="">Tìm theo trạng thái</option>
                        <option value="PENDING">Đang chờ </option>
                        <option value="PROCESSED">Đã xử lý</option>
                        <option value="DELETED">Đã bị xóa</option>
                    </select>
                    <button type="submit">
                        <FaSearch />
                    </button>
                    <button type="button" onClick={handleResetSearch} className="reset-btn-xem-don-tu-van">
                        Xóa tìm kiếm
                    </button>
                </form>
                <table className="bang-xem-don-tu-van">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>TÊN TÀI KHOẢN</th>
                            <th>EMAIL</th>
                            <th>SỐ ĐIỆN THOẠI</th>
                            <th>NỘI DUNG CẦN TƯ VẤN</th>
                            <th>TRẠNG THÁI</th>
                            <th>TÙY CHỌN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentConsultationForms.map((acc, index) => (
                            <tr key={acc.id}>
                                <td>{startIndex + index + 1}</td>
                                <td>{acc.patientName}</td>
                                <td>{acc.email}</td>
                                <td>{acc.phoneNumber}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="view-more-btn-xem-don-tu-van"
                                        onClick={() => {
                                            setSelectedMsg(acc.message || "");
                                            // fetchDate(acc);
                                            setFormBookingData({
                                                ...formBookingData,
                                                patientName: acc.patientName,
                                                phoneNumber: acc.phoneNumber
                                            });
                                        }}
                                    >
                                        Xem thêm
                                    </button>

                                </td>
                                <td>
                                    <span
                                        className={`status ${acc.status === "DELETED"
                                            ? "status--deleted"
                                            : acc.status === "PENDING"
                                                ? "status--disabled"
                                                : "status--active"
                                            }`}
                                    >
                                        {formatStatus(acc.status)}
                                    </span>

                                </td>
                                <td>
                                    <button type="button" className="completed-btn-xem-don-tu-van" onClick={() => setFormToDo(acc)}>Đã hoàn thành</button>
                                    <button type="button" className="delete-btn-xem-don-tu-van" onClick={() => setFormToDelete(acc)}>Xoá</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Phân trang */}
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={currentPage === index + 1 ? "active" : ""}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>

                {/* Popup xác nhận */}
                {formToDelete && (
                    <div className="popup-overlay-xem-don-tu-van">
                        <div className="popup-content-xem-don-tu-van">
                            <p>Bạn có chắc chắn muốn xóa <strong>{formToDelete.fullName}</strong>?</p>
                            <div className="popup-actions-xem-don-tu-van">
                                <button type="button" className="ok-btn-xem-don-tu-van" onClick={handleDeleteForm}>OK</button>
                                <button type="button" className="cancel-btn-xem-don-tu-van" onClick={() => setFormToDelete(null)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}
                {formToDo && (
                    <div className="popup-overlay-xem-don-tu-van">
                        <div className="popup-content-xem-don-tu-van">
                            <p>Bạn có chắc là đã hoàn thành <strong>{formToDo.fullName}</strong>?</p>
                            <div className="popup-actions-xem-don-tu-van">
                                <button type="button" className="ok-btn-xem-don-tu-van" onClick={handleToDoForm}>OK</button>
                                <button type="button" className="cancel-btn-xem-don-tu-van" onClick={() => setFormToDo(null)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {selectedMsg !== null && (
                <div className="popup-overlay-xem-don-tu-van">
                    <div className="popup-content-xem-don-tu-van" ref={popupRef}>
                        <div className="popup-header-xem-don-tu-van">
                            <h3>Chi tiết tư vấn</h3>
                            <button className="close-btn-xem-don-tu-van" onClick={() => setSelectedMsg(null)}>✕</button>
                        </div>
                        <div className="popup-body-xem-don-tu-van">
                            {selectedMsg.trim() !== "" ? selectedMsg : "Không có nội dung tư vấn."}
                        </div>
                        <div className="popup-actions-xem-don-tu-van">
                            <button
                                className="ok-btn-xem-don-tu-van"
                                onClick={() => {
                                    setShowBookingForm(true);
                                    ngayTrong();
                                }}
                            >
                                Tạo lịch khám
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {
                showBookingForm && (
                    <form onSubmit={handleSubmit}>
                        <div className="popup-overlay_dat_lich">
                            <div className="popup-content_dat_lich">
                                <h3>Tạo lịch khám mới cho người dùng</h3>
                                <div className="hang_dau_dat_lich">

                                    <div className="date_dat_lich">
                                        <p>Chọn ngày - khung giờ muốn khám:</p>
                                        <div className="input-calendar-wrapper_dat_lich">
                                            <input
                                                type="text"
                                                readOnly
                                                className="chon-ngay_dat_lich"
                                                value={(selectedDate && selectedTime) ? `Bạn đã chọn ngày ${selectedDate}   -    ${selectedTime}` : ''}
                                                placeholder="Chọn ngày - giờ muốn khám"
                                                onClick={() => setShowCalender(true)}
                                            />

                                            {
                                                showCalender && (
                                                    <div ref={calendarRef} className="lich-container_dat_lich">
                                                        <Calendar
                                                            onChange={handleDateChangeTheoNgay}
                                                            tileClassName={tileClassName}
                                                            tileContent={tileContent}
                                                            showNeighboringMonth={false}
                                                            className="khung_dat_lich"
                                                        />

                                                        <div className="legend_dat_lich">
                                                            <span className="dot_blue_dat_lich"></span> Ngày bác sĩ có lịch khám
                                                        </div>

                                                        <div className="time-section_dat_lich">
                                                            <h4>Chọn khung giờ khám</h4>
                                                            {!selectedDate ? (
                                                                <div className="time-box_dat_lich">Vui lòng chọn ngày trước</div>
                                                            ) : (
                                                                <div className="time-list_dat_lich">
                                                                    {availableTimes.map((time, index) => (
                                                                        <button
                                                                            type="button"
                                                                            key={index}
                                                                            className={`time-btn_dat_lich ${selectedTime === time ? 'active-_dat_lich' : ''}`}
                                                                            onClick={() => {
                                                                                setSelectedTime(time)
                                                                                setFormBookingData(prev => ({
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
                                                            className="submit-btn_dat_lich"
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
                                </div>


                                <div className="hang_hai_dat_lich">
                                    <div className="information_dat_lich">
                                        <p>Họ và tên:</p>
                                        <input type="text"
                                            value={formBookingData.patientName}
                                            readOnly
                                        />
                                    </div>

                                    <div className="information_dat_lich">
                                        <p>Số điện thoại:</p>
                                        <input type="text"
                                            value={formBookingData.phoneNumber}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="hang_ba_dat_lich">
                                    <div className="information_dat_lich">
                                        <p>  Giới tính:</p>
                                        <select required value={formBookingData.gender} onChange={(e) => setFormBookingData({ ...formBookingData, gender: e.target.value })}>
                                            <option value="">Chọn giới tính</option>
                                            <option value="MALE">MALE</option>
                                            <option value="FEMALE">FEMALE</option>
                                        </select>
                                    </div>

                                    <div className="information_dat_lich" style={{ position: "relative" }}>
                                        <p>Ngày sinh:</p>

                                        <input
                                            // ref={popupRef}
                                            type="text"
                                            readOnly
                                            placeholder="Chọn ngày sinh"
                                            value={formBookingData.dob}
                                            onClick={() => setShowDOBCalendar(!showDOBCalendar)}
                                            className="chon-ngay-dob_dat_lich"
                                        />

                                        {showDOBCalendar && (
                                            <div ref={popupRef} className="lich-container_dat_lich">
                                                <Calendar
                                                    onChange={(date) => {
                                                        const formatted = formatDate(date);
                                                        setFormBookingData((prev) => ({ ...prev, dob: formatted }));
                                                        setShowDOBCalendar(false); // đóng sau khi chọn
                                                    }}
                                                    value={formBookingData.dob ? new Date(formBookingData.dob) : null}
                                                    showNeighboringMonth={false}
                                                    className="khung_dat_lich"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="popup-actions-xem-don-tu-van">
                                    <button type="button" className="ok-btn-xem-don-tu-van" onClick={handleSubmit}>XÁC NHẬN ĐẶT LỊCH</button>
                                    <button
                                        type="button"
                                        className="cancel-btn-xem-don-tu-van"
                                        onClick={() => setShowBookingForm(false)}
                                    >
                                        Hủy
                                    </button>
                                </div>

                            </div>
                        </div>


                    </form>
                )
            }


        </>
    );
}
