import React , { useState } from "react";
import Features from "../components/Features/Features";
import SideMenu from "../components/Navbar/SideMenu";

const FeaturesPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true);

  return (
     <div className="app-container">
      <SideMenu onToggle={setMenuExpanded}/>
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Features />
      </main>
    </div>
  );
};

export default FeaturesPage;