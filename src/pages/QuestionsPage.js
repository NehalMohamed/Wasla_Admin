import React, { useState } from "react";
import Questions from "../components/Questions/Questions";
import SideMenu from "../components/Navbar/SideMenu";

const QuestionsPage = () => {
  const [menuExpanded, setMenuExpanded] = useState(false); // State to manage side menu

  return (
    <div className="app-container">
      {/* SideMenu component with toggle handler */}
      <SideMenu onToggle={setMenuExpanded} />
      {/* Main content adjusts based on menu state */}
      <main
        className={`main-content ${
          menuExpanded ? "menu-expanded" : "menu-collapsed"
        }`}
      >
        <Questions /> {/* Renders the Questions component */}
      </main>
    </div>
  );
};

export default QuestionsPage;
