import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import "./styles/shared.scss";
import QuestionsPage from "./pages/QuestionsPage";
import ServicesPage from "./pages/ServicesPage";
import UsersPage from "./pages/UsersPage";
import PackagesPage from "./pages/PackagesPage";
import PricingPage from "./pages/PricingPage";
import FeaturesPage from "./pages/FeaturesPage";
import Login from "./components/login/login";
import Dashboard from "./pages/DashboardPage";
import InvoicesPage from "./pages/InvoicesPage";
import PrivateRoute from "./components/shared/PrivateRoute";
import UnauthorizedPage from "./components/ErrorsPages/UnauthorizedPage";
import TransactionPage from "./pages/TransactionPage";
import ReportsPage from "./pages/ReportsPage";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <BrowserRouter>
        <Container fluid className="p-0">
          {/* <div className="main-container"> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route exact path="/features" element={<FeaturesPage />} />
              <Route exact path="/services" element={<ServicesPage />} />
              <Route exact path="/packages" element={<PackagesPage />} />
              <Route exact path="/transactions" element={<TransactionPage />} />
            </Route>
            <Route
              element={<PrivateRoute allowedRoles={["accountant", "Admin"]} />}
            >
              <Route path="/home" element={<Dashboard />} />
              <Route exact path="/pricing" element={<PricingPage />} />
              <Route exact path="/invoices" element={<InvoicesPage />} />
              <Route exact path="/reports" element={<ReportsPage />} />
            </Route>
            {/* <Route path="/" element={<Login />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route exact path="/features" element={<FeaturesPage />} />
            <Route exact path="/services" element={<ServicesPage />} />
            <Route exact path="/packages" element={<PackagesPage />} />
            <Route exact path="/pricing" element={<PricingPage />} />
            <Route exact path="/invoices" element={<InvoicesPage />} /> */}
          </Routes>
          {/* </div> */}
        </Container>
      </BrowserRouter>
    </>
  );
}

export default App;
