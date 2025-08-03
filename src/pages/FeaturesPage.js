import React , { useState } from "react";
import Features from "../components/Features/Features";
import SideMenu from "../components/Navbar/SideMenu";

const FeaturesPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(false); // State to track side menu expansion

  return (
     <div className="app-container">
      {/* SideMenu component with toggle functionality  */}
      <SideMenu onToggle={setMenuExpanded}/>
      {/* Main content adjusts width based on menu state */}
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Features /> {/* Renders the Features component */}
      </main>
    </div>
  );
};

export default FeaturesPage;