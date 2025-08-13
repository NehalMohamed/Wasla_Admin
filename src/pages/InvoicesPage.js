import React, { useState } from "react";
import SideMenu from "../components/Navbar/SideMenu";
import InvoicesComp from "../components/Accounting/Invoices/InvoicesComp";

function InvoicesPage() {
  const [menuExpanded, setMenuExpanded] = useState(false); // State to track side menu expansion
  return (
    <div className="app-container">
      {/* SideMenu component with toggle functionality */}
      <SideMenu onToggle={setMenuExpanded} />
      {/* Main content adjusts based on menu state */}
      <main
        className={`main-content ${
          menuExpanded ? "menu-expanded" : "menu-collapsed"
        }`}
      >
        <InvoicesComp /> {/* Renders the Users component */}
      </main>
    </div>
  );
}

export default InvoicesPage;
