import React, { useEffect, useRef, useState } from "react";
import "./ManaDashboard.css";
import Chart from "chart.js/auto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function ManaDashboard() {
    const chartRefs = useRef({});
    const [rawData, setRawData] = useState({});
    const [newArray, setNewArray] = useState({});
    const [appointment, setAppointment] = useState([]);
    const [unPaidArray, setUnPaidArray] = useState([]);
    const [unPaidSum, setUnPaidSum] = useState([]);
    const [notPaidSum, setNotPaidSum] = useState([]);
    const [checkinSum, setCheckinSum] = useState([]);
    const [unCheckinSum, setUnCheckinSum] = useState([]);
    const [cancelledSum, setCancelledSum] = useState([]);
    const [notPaidArray, setNotPaidArray] = useState([]);
    const [checkinArray, setCheckinArray] = useState([]);
    const [unCheckinArray, setUnCheckinArray] = useState([]);
    const [cancelledArray, setCancelledArray] = useState([]);
    const [totalArray, setTotalArray] = useState([]);
    const [fromDate, setFromDate] = useState(() => new Date());
    const [toDate, setToDate] = useState("");
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const fromRef = useRef();
    const toRef = useRef();

    useEffect(() => {
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 6);

        fetchAccounts({ from: oneWeekAgo, to: today });
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (fromRef.current && !fromRef.current.contains(e.target)) {
                setShowFromCalendar(false);
            }
            if (toRef.current && !toRef.current.contains(e.target)) {
                setShowToCalendar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatStatus = (status) => (status?.toUpperCase());
    
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

    const fetchAccounts = async ({ from, to }) => {
        let fromDateFormatted = formatDate(from);
        let toDateFormatted = formatDate(to);

        try {
            const res = await fetchWithAuth(`http://localhost:8080/api/appointments/report?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}`, {
                method: "GET",
            });
            if (!res.ok) {
                const errorMessage = await res.text();
                toast.error(`Lỗi khi lấy dữ liệu report: ${errorMessage}`);
                return;
            }

            const data = await res.json();
            const raw = data.data;
            
            const mapped = {};
            raw.forEach(item => {
                const key = item.date;
                mapped[key] = {
                    unPaid: item.unPaid,
                    notPaid: item.notPaid,
                    checkin: item.checkin,
                    unCheckin: item.unCheckin,
                    cancelled: item.cancelled,
                    total: item.total,
                };
            });

            setRawData(raw);
            setNewArray(mapped);

            const unP = [];
            const notP = [];
            const check = [];
            const uncheck = [];
            const cancel = [];
            const total = [];

            Object.values(mapped).forEach(acc => {
                total.push(acc.total || 0);
                unP.push(acc.unPaid || 0);
                notP.push(acc.notPaid || 0);
                check.push(acc.checkin || 0);
                uncheck.push(acc.unCheckin || 0);
                cancel.push(acc.cancelled || 0);
            });

            setTotalArray(total);
            setUnPaidArray(unP);
            setNotPaidArray(notP);
            setCheckinArray(check);
            setUnCheckinArray(uncheck);
            setCancelledArray(cancel);

            setUnPaidSum(unP.reduce((a, b) => a + b, 0));
            setNotPaidSum(notP.reduce((a, b) => a + b, 0));
            setCheckinSum(check.reduce((a, b) => a + b, 0));
            setUnCheckinSum(uncheck.reduce((a, b) => a + b, 0));
            setCancelledSum(cancel.reduce((a, b) => a + b, 0))

            const r = await fetchWithAuth(`http://localhost:8080/api/appointments/report/list-appointments?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}`, {
                method: "GET",
            });
            if (!r.ok) {
                const errorMessage = await r.text();
                toast.error(`Lỗi khi lấy dữ liệu account report: ${errorMessage}`);
                return;
            }
            const uData = await r.json();
            setAppointment(uData.data);

            setFromDate(from);
            setToDate(to);

        } catch (error) {
            toast.error(`Lỗi kết nối server: ${error.message}`);
        }
    };

    useEffect(() => {
        console.log("✅ newArray updated:", newArray);
        console.log("✅ Raw data updated:", rawData);
    }, [newArray]);

    const getDayLabels = () => {
        return Object.keys(newArray).map(item => {
            const d = new Date(item);
            return d.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
            });
        });
    };

    useEffect(() => {
        if (Object.keys(newArray).length === 0) return;
        const charts = chartRefs.current;
        const createChart = (id, type, label, data, color) => {
            const ctx = document.getElementById(id);
            if (!ctx) return;

            if (charts[id]) {
                charts[id].destroy();
            }

            const config = {
                type,
                data: {},
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: true },
                    },
                },
            };

            if (type === "line") {
                config.data = {
                    labels: getDayLabels(),
                    datasets: [
                        {
                            label,
                            data,
                            borderColor: color,
                            backgroundColor: color + "33",
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                };
                config.options.plugins.legend.display = false;
            } else if (type === "doughnut") {
                config.data = {
                    labels: ["UNPAID", "NOTPAID", "CHECKIN", "UNCHECKIN", "CANCELLED"],
                    datasets: [
                        {
                            label,
                            data,
                            backgroundColor: [
                                "#0d6efd",
                                "#ffc107",
                                "#0dcaf0",
                                "#dc3545",
                                "#6c757d",
                            ],
                        },
                    ],
                };
            }

            charts[id] = new Chart(ctx, config);
        };

        createChart("coin_sales1", "line", "ENABLED ACCOUNT", [...unPaidArray], "#ffffff");
        createChart("coin_sales2", "line", "DISABLED ACCOUNT", [...notPaidArray], "#ffffff");
        createChart("coin_sales3", "line", "DELETED ACCOUNT", [...checkinArray], "#ffffff");
        createChart("coin_sales4", "line", "DELETED ACCOUNT", [...unCheckinArray], "#ffffff");
        createChart("coin_sales5", "line", "DELETED ACCOUNT", [...cancelledArray], "#ffffff");

        createChart("overview-chart-appointment", "line", "Overview", [...totalArray], "#007bff");
        const sum = (arr) => arr.reduce((a, b) => a + b, 0);
        createChart("coin-distribution", "doughnut", "Distribution", [
            sum([...unPaidArray]),
            sum([...notPaidArray]),
            sum([...checkinArray]),
            sum([...unCheckinArray]),
            sum([...cancelledArray]),
        ], "#17a2b8");

        return () => {
            Object.values(charts).forEach(chart => chart.destroy());
        };
    }, [newArray]);

    const handleSearch = ({ from, to }) => {
        const f = from;
        const t = to;
        if (t === null) {
            const actualToDate = new Date(new Date(f).setDate(f.getDate() + 6))
            fetchAccounts({ from: f, to: actualToDate });
        } else {
            fetchAccounts({ from: f, to: t });
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />

            <div className="dashboard-container">
                <div className="dashboard-grid">
                    <div className="dashboard-card primary">
                        <div className="card-body">
                            <div className="card-header">
                                <div className="card-info">
                                    <h5 className="card-title-appointment-dashboard">UN_PAID</h5>
                                    <p className="card-value">{unPaidSum}</p>
                                    <p className="card-date">Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-btc"></i>
                                </div>
                            </div>
                            <canvas className="canvas-appointment-dashboard" id="coin_sales1" height="100"></canvas>
                        </div>
                    </div>

                    <div className="dashboard-card warning">
                        <div className="card-body">
                            <div className="card-header">
                                <div className="card-info">
                                    <h5 className="card-title-appointment-dashboard">NOT_PAID</h5>
                                    <p className="card-value">{notPaidSum}</p>
                                    <p className="card-date">Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-btc"></i>
                                </div>
                            </div>
                            <canvas className="canvas-appointment-dashboard" id="coin_sales2" height="100"></canvas>
                        </div>
                    </div>

                    <div className="dashboard-card info">
                        <div className="card-body">
                            <div className="card-header">
                                <div className="card-info">
                                    <h5 className="card-title-appointment-dashboard">CHECK_IN</h5>
                                    <p className="card-value">{checkinSum}</p>
                                    <p className="card-date">Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-eur"></i>
                                </div>
                            </div>
                            <canvas className="canvas-appointment-dashboard" id="coin_sales3" height="100"></canvas>
                        </div>
                    </div>

                    <div className="dashboard-card danger">
                        <div className="card-body">
                            <div className="card-header">
                                <div className="card-info">
                                    <h5 className="card-title-appointment-dashboard">UN_CHECK_IN</h5>
                                    <p className="card-value">{unCheckinSum}</p>
                                    <p className="card-date">Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-btc"></i>
                                </div>
                            </div>
                            <canvas className="canvas-appointment-dashboard" id="coin_sales4" height="100"></canvas>
                        </div>
                    </div>

                    <div className="dashboard-card secondary">
                        <div className="card-body">
                            <div className="card-header">
                                <div className="card-info">
                                    <h5 className="card-title-appointment-dashboard">CANCELLED</h5>
                                    <p className="card-value">{cancelledSum}</p>
                                    <p className="card-date">Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-btc"></i>
                                </div>
                            </div>
                            <canvas className="canvas-appointment-dashboard" id="coin_sales5" height="100"></canvas>
                        </div>
                    </div>
                </div>

                <div className="overview-section">
                    <div className="overview-chart">
                        <div className="card-appointment-dashboard">
                            <div className="card-body-appointment-dashboard">
                                <div className="overview-header">
                                    <h5 className="card-title-appointment-dashboard">Overview</h5>
                                    <div className="date-controls">
                                        <div className="calendar-container-appointment-dashboard" ref={fromRef}>
                                            From:
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Chọn ngày"
                                                value={fromDate ? formatDate(fromDate) : ""}
                                                onClick={() => setShowFromCalendar(true)}
                                            />
                                            {showFromCalendar && (
                                                <div className="calendar-popup-appointment-dashboard">
                                                    <Calendar
                                                        value={fromDate}
                                                        showNeighboringMonth={false}
                                                        onChange={(date) => {
                                                            setFromDate(date);
                                                            setShowFromCalendar(false);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="calendar-container-appointment-dashboard" ref={toRef}>
                                            To:
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Chọn ngày"
                                                value={toDate ? formatDate(toDate) : ""}
                                                onClick={() => setShowToCalendar(true)}
                                            />
                                            {showToCalendar && (
                                                <div className="calendar-popup-appointment-dashboard">
                                                    <Calendar
                                                        value={toDate}
                                                        showNeighboringMonth={false}
                                                        onChange={(date) => {
                                                            setToDate(date);
                                                            setShowToCalendar(false);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <button className="button-search-appointment" onClick={() => handleSearch({ from: fromDate, to: toDate })}>
                                            Search
                                        </button>
                                    </div>
                                </div>
                                <canvas className="canvas-appointment-dashboard" id="overview-chart-appointment" height="200"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="distribution-chart">
                        <div className="card-appointment-dashboard">
                            <div className="card-body-appointment-dashboard">
                                <h5 className="card-title-appointment-dashboard">Appointment Distribution</h5>
                                <canvas className="canvas-appointment-dashboard" id="coin-distribution" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                {appointment ? (
                    <div className="account-appointment-dashboard">
                        <table className="account-table-appointment-dashboard">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>NAME</th>
                                    <th>TIME</th>
                                    <th>STATUS</th>
                                    <th>CREATE AT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointment.map((acc, index) => (
                                    <tr key={acc.id}>
                                        <td>{index + 1}</td>
                                        <td>{acc.patientName}</td>
                                        <td>{formatDate(acc.time)}</td>
                                        <td>{formatStatus(acc.status)}</td>
                                        <td>{formatDate(acc.createAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No account available</p>
                )}
            </div>
        </>
    );
}