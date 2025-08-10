import React, { useState } from "react";
import Transaction from "../components/Transactions/Transaction";
import SideMenu from "../components/Navbar/SideMenu";
function TransactionPage() {
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
        <Transaction /> {/* Renders the Features component */}
      </main>
    </div>
  );
}

export default TransactionPage;
