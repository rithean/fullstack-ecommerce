import React from "react";
import Sidebar from "../Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 p-0">
          <Sidebar />
        </div>
        <div className="col-10 p-4 bg-light" style={{ minHeight: "100vh" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
