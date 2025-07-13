import React , { useState } from "react";
import Services from "../components/Services/Services";
import SideMenu from "../components/Navbar/SideMenu";

const ServicesPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true); // State for side menu expansion

  return (
     <div className="app-container">
      {/* SideMenu component with toggle callback */}
      <SideMenu onToggle={setMenuExpanded}/>
      {/* Main content class toggles based on menu state */}
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Services /> {/* Renders the Services component */}
      </main>
    </div>
  );
};

export default ServicesPage;