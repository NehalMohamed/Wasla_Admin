import React, { useState } from "react";
import Questions from "../components/Questions/Questions";
import SideMenu from "../components/Navbar/SideMenu";

const QuestionsPage = () => {
   const [menuExpanded, setMenuExpanded] = useState(true);

  return (
     <div className="app-container">
      <SideMenu onToggle={setMenuExpanded}/>
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
      <Questions />
      </main>
    </div>
  );
};

export default QuestionsPage;