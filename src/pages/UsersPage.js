import React , { useState } from "react";
import Users from "../components/Users/Users";
import SideMenu from "../components/Navbar/SideMenu";

const UsersPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true); // State to track side menu expansion

  return (
     <div className="app-container">
      {/* SideMenu component with toggle functionality */}
      <SideMenu onToggle={setMenuExpanded}/>
      {/* Main content adjusts based on menu state */}
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Users /> {/* Renders the Users component */}
      </main>
    </div>
  );
};

export default UsersPage;