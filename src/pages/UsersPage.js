import React , { useState } from "react";
import Users from "../components/Users/Users";
import SideMenu from "../components/Navbar/SideMenu";

const UsersPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true);

  return (
     <div className="app-container">
      <SideMenu onToggle={setMenuExpanded}/>
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Users />
      </main>
    </div>
  );
};

export default UsersPage;