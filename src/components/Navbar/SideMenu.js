import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import {
  FiHome,
  FiHelpCircle,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiDollarSign,
  FiLayers,
  FiUsers,
} from "react-icons/fi";
import { IoLogoFirebase } from "react-icons/io5";
import { FaFileInvoice } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { menuItems, allMenuItems } from "./MenuItems";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import * as IO5Icons from "react-icons/io5";
import "./SideMenu.scss";
const allIcons = { ...FaIcons, ...IO5Icons, ...FiIcons };

const SideMenu = ({ onToggle }) => {
  const navigate = useNavigate();
  const [MyName, setMyName] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [Items, setItems] = useState([]);
  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      const user = JSON.parse(userLocal);
      if (user) {
        setMyName(`${user.firstName} ${user.lastName}`);

        // Filter menu items based on user role
        const authorizedMenuItems = allMenuItems.filter((item) =>
          item.roles.includes(user.role)
        );
        setItems(authorizedMenuItems || []);
        // setItems(menuItems[user.role] || []);
      }
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
      //  if (mobile) {
      //   setIsExpanded(false);
      // }
    };

    // window.addEventListener("resize", handleResize);
    // handleResize();
    // return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) onToggle(newState);
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    setIsExpanded(false);
    if (onToggle) onToggle(false);
    navigate(path);
  };

  return (
    <div
      className={`side-menu ${isExpanded ? "expanded" : "collapsed"} ${
        isMobile ? "mobile" : ""
      }`}
    >
      {/* Top Bar with Logo and Toggle */}
      <div className="side-menu-topbar">
        {isExpanded && <img src="/waslalogo.png" alt="Logo" className="logo" />}
        <button className="toggle-button" onClick={toggleExpand}>
          {isExpanded ? (
            <FiChevronLeft size={20} />
          ) : (
            <FiChevronRight size={20} />
          )}
        </button>
      </div>

      {/* Main Menu Content */}
      <div className="side-menu-content">
        <Nav className="flex-column">
          {Items &&
            Items.map((item, index) => {
              const IconComponent = allIcons[item.icon];
              return (
                <Nav.Link
                  key={index}
                  href={item.path}
                  className="side-menu-item"
                  onClick={(e) => handleNavigation(e, item.path)}
                >
                  {IconComponent && <IconComponent className="menu-icon" />}
                  {isExpanded && <span>{item.title}</span>}
                </Nav.Link>
              );
            })}
          {/* <Nav.Link
            href="/home"
            className="side-menu-item"
            onClick={(e) => handleNavigation(e, "/home")}
          >
            <FiHome className="menu-icon" />
            {isExpanded && <span>Home</span>}
          </Nav.Link>
          <Nav.Link
            href="/users"
            className="side-menu-item"
            onClick={(e) => handleNavigation(e, "/users")}
          >
            <FiUsers className="menu-icon" />
            {isExpanded && <span>Users</span>}
          </Nav.Link>
          <Nav.Link
            href="/questions"
            className="side-menu-item"
            onClick={(e) => handleNavigation(e, "/questions")}
          >
            <FiHelpCircle className="menu-icon" />
            {isExpanded && <span>Questions</span>}
          </Nav.Link>
          <Nav.Link
            href="/features"
            className="side-menu-item"
            onClick={(e) => handleNavigation(e, "/features")}
          >
            <FiLayers className="menu-icon" />
            {isExpanded && <span>Features</span>}
          </Nav.Link>
          <Nav.Link
            href="/services"
            className="side-menu-item"
            onClick={(e) => handleNavigation(e, "/services")}
          >
            <FiSettings className="menu-icon" />
            {isExpanded && <span>Services</span>}
          </Nav.Link>
          <Nav.Link
            href="/packages"
            className="side-menu-item"
            onClick={(e) => handleNavigation(e, "/packages")}
          >
            <IoLogoFirebase className="menu-icon" />
            {isExpanded && <span>Packages</span>}
          </Nav.Link>
          <Nav.Link
            href="/pricing"
            className="side-menu-item"
            onClick={(e) => handleNavigation(e, "/pricing")}
          >
            <FiDollarSign className="menu-icon" />
            {isExpanded && <span>Pricing</span>}
          </Nav.Link>
          <Nav.Link
            href="/invoices"
            className="side-menu-item"
            onClick={(e) => handleNavigation(e, "/invoices")}
          >
            <FaFileInvoice className="menu-icon" />
            {isExpanded && <span>Invoices</span>}
          </Nav.Link> */}
        </Nav>

        {/* Bottom Section */}
        <div className="side-menu-footer">
          <div className="footer-content">
            <div className="user-info">
              <FiUser className="user-icon" />
              {isExpanded && <span className="user-title">{MyName}</span>}
            </div>

            <div className="menu-actions">
              <button className="menu-action-button">
                <FiSearch className="action-icon" />
                {isExpanded && <span>Search</span>}
              </button>

              {MyName && (
                <button className="menu-action-button" onClick={logOut}>
                  <FiLogOut className="action-icon" />
                  {isExpanded && <span>Logout</span>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
