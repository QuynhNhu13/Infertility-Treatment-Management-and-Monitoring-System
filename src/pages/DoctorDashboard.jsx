import React from "react";
import { Outlet } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import SidebarDoctor from "../components/SidebarDoctor";

const DoctorDashboard = () => {
  return (
    <>
      <HeaderDashboard />
      <SidebarDoctor />
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

export default DoctorDashboard;
