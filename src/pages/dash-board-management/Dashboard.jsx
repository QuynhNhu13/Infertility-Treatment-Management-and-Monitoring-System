import React, { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import Chart from "chart.js/auto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function Dashboard() {
    const chartRefs = useRef({});
    const [rawData, setRawData] = useState({});
    const [newArray, setNewArray] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [disabledAccountArray, setDisabledAccountArray] = useState([]);
    const [enabledAccountArray, setEnabledAccountArray] = useState([]);
    const [deletedAccountArray, setDeletedAccountArray] = useState([]);
    const [totalAccountArray, setTotalAccountArray] = useState([]);
    const [fromDate, setFromDate] = useState(() => new Date());
    const [toDate, setToDate] = useState("");
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);
    const [numberEnabledAccount, setNumberEnabledAccount] = useState(0);
    const [numberDisabledAccount, setNumberDisabledAccount] = useState(0);
    const [numberDeletedAccount, setNumberDeletedAccount] = useState(0);
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

    const formatStatus = (status) => {
        switch (status) {
            case "ENABLED":
                return "Đang hoạt động";
            case "DISABLED":
                return "Chưa hoạt động";
            case "DELETED":
                return "Đã bị xóa";
            default:
                return status;
        }
    };

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
            const res = await fetchWithAuth(`http://localhost:8080/report?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}`, {
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
                    total: item.totalAccount,
                    enabled: item.enabledAccount,
                    disabled: item.disabledAccount,
                    deleted: item.deletedAccount,
                };
            });

            setRawData(raw);
            setNewArray(mapped);

            const dis = [];
            const ena = [];
            const del = [];
            const total = [];

            Object.values(mapped).forEach(acc => {
                total.push(acc.total || 0);
                ena.push(acc.enabled || 0);
                dis.push(acc.disabled || 0);
                del.push(acc.deleted || 0);
            });

            setTotalAccountArray(total);
            setEnabledAccountArray(ena);
            setDisabledAccountArray(dis);
            setDeletedAccountArray(del);

            setNumberEnabledAccount(ena.reduce((a, b) => a + b, 0));
            setNumberDisabledAccount(dis.reduce((a, b) => a + b, 0));
            setNumberDeletedAccount(del.reduce((a, b) => a + b, 0));

            const r = await fetchWithAuth(`http://localhost:8080/api/accounts/accounts-report?fromDate=${fromDateFormatted}&toDate=${toDateFormatted}`, {
                method: "GET",
            });
            if (!r.ok) {
                const errorMessage = await r.text();
                toast.error(`Lỗi khi lấy dữ liệu account report: ${errorMessage}`);
                return;
            }
            const uData = await r.json();
            setAccounts(uData.data);

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
                    labels: ["ENABLED", "DISABLED", "DELETED"],
                    datasets: [
                        {
                            label,
                            data,
                            backgroundColor: [
                                "#00fa3aff",
                                "#b6b4b0ff",
                                "#e60017ff",
                            ],
                        },
                    ],
                };
            }

            charts[id] = new Chart(ctx, config);
        };

        createChart("coin_sales1", "line", "ENABLED ACCOUNT", [...enabledAccountArray], "#ffffff");
        createChart("coin_sales2", "line", "DISABLED ACCOUNT", [...disabledAccountArray], "#ffffff");
        createChart("coin_sales3", "line", "DELETED ACCOUNT", [...deletedAccountArray], "#ffffff");

        createChart("overview-chart", "line", "Overview", [...totalAccountArray], "#007bff");
        const sum = (arr) => arr.reduce((a, b) => a + b, 0);
        createChart("coin-distribution", "doughnut", "Distribution", [
            sum([...enabledAccountArray]),
            sum([...disabledAccountArray]),
            sum([...deletedAccountArray]),
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

            <div className="admin-dashboard-container">
                <div className="admin-stats-row">
                    <div className="admin-stat-card admin-stat-card-primary">
                        <div className="admin-card-body-dashboard">
                            <div className="admin-card-content">
                                <div className="admin-card-info">
                                    <h5 className="admin-card-title-dashboard">ENABLED ACCOUNT</h5>
                                    <p className="admin-card-number">{numberEnabledAccount}</p>
                                    <p className="admin-card-date">
                                        Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}
                                    </p>
                                </div>
                                <div className="admin-card-icon">
                                    <i className="fa fa-btc"></i>
                                </div>
                            </div>
                            <canvas className="admin-canvas-dashboard" id="coin_sales1" height="100"></canvas>
                        </div>
                    </div>

                    <div className="admin-stat-card admin-stat-card-warning">
                        <div className="admin-card-body-dashboard">
                            <div className="admin-card-content">
                                <div className="admin-card-info">
                                    <h5 className="admin-card-title-dashboard">DISABLED ACCOUNT</h5>
                                    <p className="admin-card-number">{numberDisabledAccount}</p>
                                    <p className="admin-card-date">
                                        Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}
                                    </p>
                                </div>
                                <div className="admin-card-icon">
                                    <i className="fa fa-btc"></i>
                                </div>
                            </div>
                            <canvas className="admin-canvas-dashboard" id="coin_sales2" height="100"></canvas>
                        </div>
                    </div>

                    <div className="admin-stat-card admin-stat-card-info">
                        <div className="admin-card-body-dashboard">
                            <div className="admin-card-content">
                                <div className="admin-card-info">
                                    <h5 className="admin-card-title-dashboard">DELETED ACCOUNT</h5>
                                    <p className="admin-card-number">{numberDeletedAccount}</p>
                                    <p className="admin-card-date">
                                        Date: {formatDate(fromDate)} – {formatDate(toDate || new Date(new Date(fromDate).setDate(fromDate.getDate() + 6)))}
                                    </p>
                                </div>
                                <div className="admin-card-icon">
                                    <i className="fa fa-eur"></i>
                                </div>
                            </div>
                            <canvas className="admin-canvas-dashboard" id="coin_sales3" height="100"></canvas>
                        </div>
                    </div>
                </div>

                <div className="admin-main-row">
                    <div className="admin-overview-section">
                        <div className="admin-card-dashboard">
                            <div className="admin-card-body-dashboard">
                                <div className="admin-overview-header">
                                    <h5 className="admin-card-title-dashboard">Overview</h5>
                                    <div className="admin-date-controls">
                                        <div className="admin-calendar-container-dashboardPage" ref={fromRef}>
                                            From:
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Chọn ngày"
                                                value={fromDate ? formatDate(fromDate) : ""}
                                                onClick={() => setShowFromCalendar(true)}
                                            />
                                            {showFromCalendar && (
                                                <div className="admin-calendar-popup-dashboardPage">
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

                                        <div className="admin-calendar-container-dashboardPage" ref={toRef}>
                                            To:
                                            <input
                                                type="text"
                                                readOnly
                                                placeholder="Chọn ngày"
                                                value={toDate ? formatDate(toDate) : ""}
                                                onClick={() => setShowToCalendar(true)}
                                            />
                                            {showToCalendar && (
                                                <div className="admin-calendar-popup-dashboardPage">
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

                                        <button 
                                            className="admin-button-search-dashboardPage" 
                                            onClick={() => handleSearch({ from: fromDate, to: toDate })}
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                                <canvas className="admin-canvas-dashboard" id="overview-chart" height="200"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="admin-distribution-section">
                        <div className="admin-card-dashboard admin-distribution-card">
                            <div className="admin-card-body-dashboard">
                                <h5 className="admin-card-title-dashboard">Account Distribution</h5>
                                <canvas className="admin-canvas-dashboard" id="coin-distribution" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                {accounts ? (
                    <div className="admin-account-dashboardPage">
                        <table className="admin-account-table-dashboardPage">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>TÊN TÀI KHOẢN</th>
                                    <th>SĐT</th>
                                    <th>EMAIL</th>
                                    <th>NGÀY TẠO</th>
                                    <th>TRẠNG THÁI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((acc, index) => (
                                    <tr key={acc.id}>
                                        <td>{index + 1}</td>
                                        <td>{acc.fullName}</td>
                                        <td>{acc.phoneNumber}</td>
                                        <td>{acc.email}</td>
                                        <td>{formatDate(acc.createdAt)}</td>
                                        <td>
                                            <span
                                                className={`admin-status-account ${acc.status === "deleted"
                                                    ? "admin-status-account-deleted"
                                                    : acc.status === "disabled"
                                                        ? "admin-status-account-disabled"
                                                        : "admin-status-account-enabled"
                                                    }`}
                                            >
                                                {formatStatus(acc.status)}
                                            </span>
                                        </td>
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