import React , { useState } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import SideMenu from "../components/Navbar/SideMenu";

const DashboardPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true); // State to track side menu expansion
   const [userRole, setUserRole] = useState('admin');
  return (
     <div className="app-container">
      {/* SideMenu component with toggle functionality  */}
      <SideMenu onToggle={setMenuExpanded}/>
      {/* Main content adjusts width based on menu state */}
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Dashboard userRole={userRole} /> {/* Renders the DashBoard component */}
      </main>
    </div>
  );
};

export default DashboardPage;