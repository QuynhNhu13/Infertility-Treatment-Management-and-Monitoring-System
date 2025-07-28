import React from "react";
import { Outlet } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import SidebarUser from "../components/SidebarUser";

const UserDashboard = () => {
  return (
    <>
      <HeaderDashboard />
      <SidebarUser />
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

export default UserDashboard;
