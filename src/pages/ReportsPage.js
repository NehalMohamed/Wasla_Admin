import React, { useState } from "react";
import SideMenu from "../components/Navbar/SideMenu";
import Reports from "../components/Reports/Reports";
function ReportsPage() {
  const [menuExpanded, setMenuExpanded] = useState(false); // State to track side menu expansion

  return (
    <div className="app-container">
      {/* SideMenu component with toggle functionality  */}
      <SideMenu onToggle={setMenuExpanded} />
      {/* Main content adjusts width based on menu state */}
      <main
        className={`main-content ${
          menuExpanded ? "menu-expanded" : "menu-collapsed"
        }`}
      >
        <Reports /> {/* Renders the Features component */}
      </main>
    </div>
  );
}

export default ReportsPage;
