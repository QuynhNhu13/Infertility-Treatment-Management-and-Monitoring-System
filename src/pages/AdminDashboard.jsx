import React from "react";
import { Outlet } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import SidebarAdmin from "../components/SidebarAdmin";

const AdminDashboard = () => {
  return (
    <>
      <HeaderDashboard />
      <SidebarAdmin />
      <div
        style={{
          marginLeft: "260px",
          marginTop: "-85px",
          padding: "20px",
          backgroundColor: "#e2efff",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default AdminDashboard;
