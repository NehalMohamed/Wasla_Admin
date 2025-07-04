import React , { useState } from "react";
import PricingPackages from "../components/Pricing/PricingPackages";
import SideMenu from "../components/Navbar/SideMenu";

const PricingPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true);

  return (
     <div className="app-container">
      <SideMenu onToggle={setMenuExpanded}/>
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <PricingPackages />
      </main>
    </div>
  );
};

export default PricingPage;