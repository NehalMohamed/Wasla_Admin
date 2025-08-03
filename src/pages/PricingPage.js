import React, { useState } from "react";
import PricingPackages from "../components/Pricing/PricingPackages";
import SideMenu from "../components/Navbar/SideMenu";

const PricingPage = () => {
  const [menuExpanded, setMenuExpanded] = useState(false); // State for side menu expansion

  return (
    <div className="app-container">
      {/* SideMenu component with toggle callback */}
      <SideMenu onToggle={setMenuExpanded} />
      {/* Main content class changes dynamically */}
      <main
        className={`main-content ${
          menuExpanded ? "menu-expanded" : "menu-collapsed"
        }`}
      >
        <PricingPackages /> {/* Renders the PricingPackages component */}
      </main>
    </div>
  );
};

export default PricingPage;
