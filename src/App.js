import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./styles/shared.scss";
import QuestionsPage from "./pages/QuestionsPage";
import ServicesPage from "./pages/ServicesPage";
import UsersPage from "./pages/UsersPage";
import PackagesPage from "./pages/PackagesPage";
import PricingPage from "./pages/PricingPage";
import FeaturesPage from "./pages/FeaturesPage";
import Login from "./components/login/login";
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <BrowserRouter>
        <Container fluid className="p-0">
          {/* <div className="main-container"> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route exact path="/features" element={<FeaturesPage/>} />
            <Route exact path="/services" element={<ServicesPage />} />
            <Route exact path="/packages" element={<PackagesPage />} />
            <Route exact path="/pricing" element={<PricingPage />} />
          </Routes>
          {/* </div> */}
        </Container>
      </BrowserRouter>
    </>
  );
}

export default App;
