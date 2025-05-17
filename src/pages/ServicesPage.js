import React , { useState } from "react";
import Services from "../components/Services/Services";
import SideMenu from "../components/Navbar/SideMenu";

const ServicesPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true);

  return (
     <div className="app-container">
      <SideMenu onToggle={setMenuExpanded}/>
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Services />
      </main>
    </div>
  );
};

export default ServicesPage;
