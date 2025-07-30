import React, { useEffect, useRef, useState } from "react";
import "./FinancialReport.css";
import Chart from "chart.js/auto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function FinancialReport() {
    const chartRefs = useRef({});
    const [rawData, setRawData] = useState({});
    const [newArray, setNewArray] = useState({});
    const [invoicesList, setInvoicesList] = useState([]);
    const [depositAmountArray, setDepositAmountArray] = useState([]);
    const [serviceAmountArray, setServiceAmountArray] = useState([]);
    const [totalAmountArray, setTotalAmountArray] = useState([]);
    const [fromDate, setFromDate] = useState(() => new Date());
    const [toDate, setToDate] = useState("");
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const [numberDepositAmount, setNumberDepositAmount] = useState(0);
    const [numberServiceAmount, setNumberServiceAmount] = useState(0);
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

    const formatDate = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
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
            const res = await fetchWithAuth(`http://localhost:8080/api/invoices/report?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}`, {
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
                    total: item.totalAmount,
                    deposit: item.depositAmount,
                    service: item.serviceAmount,
                };
            });

            setRawData(raw);
            setNewArray(mapped);

            const depo = [];
            const ser = [];
            const total = [];

            Object.values(mapped).forEach(acc => {
                total.push(acc.total || 0);
                depo.push(acc.deposit || 0);
                ser.push(acc.service || 0);
            });

            setTotalAmountArray(total);
            setDepositAmountArray(depo);
            setServiceAmountArray(ser);

            setNumberDepositAmount(depo.reduce((a, b) => a + b, 0));
            setNumberServiceAmount(ser.reduce((a, b) => a + b, 0));

            const r = await fetchWithAuth(`http://localhost:8080/api/invoices/list-invoices?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}`, {
                method: "GET",
            });
            if (!r.ok) {
                const errorMessage = await r.text();
                toast.error(`Lỗi khi lấy dữ liệu account report: ${errorMessage}`);
                return;
            }
            const uData = await r.json();
            setInvoicesList(uData.data);

            setFromDate(from);
            setToDate(to);

        } catch (error) {
            toast.error(`Lỗi kết nối server: ${error.message}`);
        }
    };

    useEffect(() => {
        console.log("✅ newArray updated:", newArray);
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
                    labels: ["DEPOSIT_AMOUNT", "SERVICE_AMOUNT"],
                    datasets: [
                        {
                            label,
                            data,
                            backgroundColor: [
                                "#00fa3aff",
                                "#b6b4b0ff",
                            ],
                        },
                    ],
                };
            }

            charts[id] = new Chart(ctx, config);
        };

        createChart("coin_sales1", "line", "ENABLED ACCOUNT", [...depositAmountArray], "#ffffff");
        createChart("coin_sales2", "line", "DISABLED ACCOUNT", [...serviceAmountArray], "#ffffff");
        createChart("overview-chart", "line", "Overview", [...totalAmountArray], "#007bff");
        const sum = (arr) => arr.reduce((a, b) => a + b, 0);
        createChart("coin-distribution", "doughnut", "Distribution", [
            sum([...depositAmountArray]),
            sum([...serviceAmountArray]),
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

            <div className="container-fluid">
                <div className="stats-row">
                    <div className="stats-col">
                        <div className="card-final card-primary">
                            <div className="card-body-final">
                                <div className="card-header-content">
                                    <div className="card-info">
                                        <h5 className="card-title-final">DEPOSIT AMOUNT</h5>
                                        <p className="card-amount">{numberDepositAmount.toLocaleString('vi-VN')}</p>
                                        <p className="card-date">
                                            Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}
                                        </p>
                                    </div>
                                    <div className="icon">
                                        <i className="fa fa-btc"></i>
                                    </div>
                                </div>
                                <canvas className="canvas-final" id="coin_sales1" height="100"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="stats-col">
                        <div className="card-final card-warning">
                            <div className="card-body-final">
                                <div className="card-header-content">
                                    <div className="card-info">
                                        <h5 className="card-title-final">SERVICE AMOUNT</h5>
                                        <p className="card-amount">{numberServiceAmount.toLocaleString('vi-VN')}</p>
                                        <p className="card-date">
                                            Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}
                                        </p>
                                    </div>
                                    <div className="icon">
                                        <i className="fa fa-btc"></i>
                                    </div>
                                </div>
                                <canvas className="canvas-final" id="coin_sales2" height="100"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-row">
                    <div className="chart-col">
                        <div className="card-final">
                            <div className="card-body-final">
                                <div className="chart-header">
                                    <h5 className="card-title-final">Overview</h5>
                                    <div className="controls-wrapper">
                                        <div className="calendar-container-final" ref={fromRef}>
                                            From:
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Chọn ngày"
                                                value={fromDate ? formatDate(fromDate) : ""}
                                                onClick={() => setShowFromCalendar(true)}
                                            />
                                            {showFromCalendar && (
                                                <div className="calendar-popup-final">
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

                                        <div className="calendar-container-final" ref={toRef}>
                                            To:
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Chọn ngày"
                                                value={toDate ? formatDate(toDate) : ""}
                                                onClick={() => setShowToCalendar(true)}
                                            />
                                            {showToCalendar && (
                                                <div className="calendar-popup-final">
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
                                        
                                        <div>
                                            <button 
                                                className="button-search-final" 
                                                onClick={() => handleSearch({ from: fromDate, to: toDate })}
                                            >
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <canvas className="canvas-final" id="overview-chart" height="200"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="distribution-col">
                        <div className="card-final card-distribution">
                            <div className="card-body-final">
                                <h5 className="card-title-final">Financial Distribution</h5>
                                <canvas className="canvas-final" id="coin-distribution" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                {invoicesList ? (
                    <div className="account-final">
                        <table className="account-table-final">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>DATE</th>
                                    <th>FINAL AMOUNT</th>
                                    <th>STATUS</th>
                                    <th>TYPE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoicesList.map((acc, index) => (
                                    <tr key={acc.id}>
                                        <td>{index + 1}</td>
                                        <td>{formatDate(acc.date)}</td>
                                        <td>{acc.finalAmount.toLocaleString('vi-VN')}</td>
                                        <td>{formatStatus(acc.status)}</td>
                                        <td>{acc.type}</td>
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