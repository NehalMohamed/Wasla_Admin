import React, { useState } from 'react';
import { Navbar, Nav , Container } from 'react-bootstrap';
import { GoSearch } from "react-icons/go";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';

const CustomNavbar = () => {
  const navigate = useNavigate();

  return (
    <Navbar fixed="top" expand="lg" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand href="/" className="brand d-flex align-items-center">
          <img src="/waslalogo.png" alt="Logo" className="logo" />
        </Navbar.Brand>
        
        <Nav className="nav-items">
          <Nav.Link href="/questions" className="nav-item">Questions</Nav.Link>
          <Nav.Link href="/services" className="nav-item">Services</Nav.Link>
        </Nav>

        <div className="d-flex align-items-center nav-icons">
            {/* Search icon */}
            <GoSearch className="icon" />

            {/* Logout icon if user is logged in */}
            <FiLogOut className="icon" /> 
          </div>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;