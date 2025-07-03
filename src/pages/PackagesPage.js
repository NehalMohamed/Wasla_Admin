import React, { useState } from "react";
import Packages from "../components/Packages/Packages";
import SideMenu from "../components/Navbar/SideMenu";

const PackagesPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true);

  return (
     <div className="app-container">
      <SideMenu onToggle={setMenuExpanded}/>
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Packages />
      </main>
    </div>
  );
};

export default PackagesPage;