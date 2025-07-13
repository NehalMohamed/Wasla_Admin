import React, { useState } from "react";
import Packages from "../components/Packages/Packages";
import SideMenu from "../components/Navbar/SideMenu";

const PackagesPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true); // State to track side menu expansion

  return (
     <div className="app-container">
      {/* SideMenu component with toggle functionality */}
      <SideMenu onToggle={setMenuExpanded}/>
      {/* Main content adjusts width based on menu state */}
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Packages /> {/* Renders the Packages component */}
      </main>
    </div>
  );
};

export default PackagesPage;