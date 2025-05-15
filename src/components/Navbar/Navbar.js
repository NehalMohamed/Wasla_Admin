import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { GoSearch } from "react-icons/go";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const [MyName, setMyName] = useState("");
  // Effect to fetch and set user name from local storage on component mount
  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      const user = JSON.parse(userLocal);
      if (user) {
        setMyName(`${user.firstName} ${user.lastName}`);
      }
    }
  }, []);
  // Function to handle user logout
  const logOut = () => {
    localStorage.removeItem("token"); // Remove auth token
    localStorage.removeItem("user"); // Remove user info
    navigate("/login"); // Redirect to login page
  };

  return (
    <Navbar fixed="top" expand="lg" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand href="/" className="brand d-flex align-items-center">
          <img src="/waslalogo.png" alt="Logo" className="logo" />
        </Navbar.Brand>

        <Nav className="nav-items">
          <Nav.Link href="/questions" className="nav-item">
            Questions
          </Nav.Link>
          <Nav.Link href="/services" className="nav-item">
            Services
          </Nav.Link>
        </Nav>

        <div className="d-flex align-items-center nav-icons">
          <span>
            <span className="userTitle">{MyName}</span>
            <FiUser className="icon" />
          </span>

          {/* Search icon */}
          <GoSearch className="icon" />

          {/* Logout icon if user is logged in */}
          {MyName ? <FiLogOut className="icon" onClick={logOut} /> : null}
        </div>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
