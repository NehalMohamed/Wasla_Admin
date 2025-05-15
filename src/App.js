import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import CustomNavbar from "./components/Navbar/Navbar";
import QuestionsPage from "./pages/QuestionsPage";
import ServicesPage from "./pages/ServicesPage";
import Login from "./components/login/login";
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <BrowserRouter>
        <Container fluid className="p-0">
          {/* <div className="main-container"> */}
          <Routes>
            <Route
              path="/"
              element={<QuestionsPage searchTerm={searchTerm} />}
            />
            <Route
              path="/questions"
              element={<QuestionsPage searchTerm={searchTerm} />}
            />
            <Route exact path="/services" element={<ServicesPage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          {/* </div> */}
        </Container>
      </BrowserRouter>
    </>
  );
}

export default App;
