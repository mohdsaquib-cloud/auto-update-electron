import React from "react";
const { ipcRenderer: ipc } = window.require("electron");
const Dashboard = () => {
    return (
        <div>
            {ipc.send("dashboard", "hello")}
            <h1>Dashboard</h1>
        </div>
    );
};

export default Dashboard;
