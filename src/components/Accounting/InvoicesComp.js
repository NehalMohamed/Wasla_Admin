import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllInvoices } from "../../slices/AccountingSlice";
import { FaEdit, FaSearch, FaCheck, FaTimes, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Form, Col, Row, Button, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./InvoicesComp.scss";
import { FiCheck, FiFilter, FiPrinter } from "react-icons/fi";
function InvoicesComp() {
  const dispatch = useDispatch();
  const [filterExpanded, setFilterExpanded] = useState(false);
  //get to_date = now date minus one month
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() - 1);
  const statusLst = [
    { name: "pending", id: 1 },
    { name: "checkout", id: 2 },
    { name: "confirmed", id: 3 },
  ];
  // Get invoices data and status from Redux store
  const { Invoices, loading, error } = useSelector((state) => state.accounting);
  // State for popup management
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");
  const [popupType, setPopupType] = React.useState("alert");
  const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
  const [date_from, setDate_from] = useState(newDate);
  const [date_to, setDate_to] = useState(new Date());
  const [formData, setformData] = useState({
    date_from: newDate,
    date_to: new Date(),
    client_email: "",
    status: 1,
    active: true,
    invoice_code: "",
    lang_code: "en",
  });
  // Fetch invoices on component mount
  useEffect(() => {
    dispatch(GetAllInvoices(formData))
      .unwrap()
      .catch((error) => {
        setPopupMessage(error || "Failed to fetch users");
        setPopupType("error");
        setShowPopup(true);
      });
  }, [dispatch]);

  const fillFormData = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4 page-title">Invoices Management</h2>
         <div className="d-flex align-items-center"></div>
         <div className="mb-4 position-relative" style={{ width: "250px" }}>
          <FaSearch
            className="position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
          <input
            type="text"
            className="form-control ps-6"
            placeholder="Search By Invoice ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>

        <Button 
          variant="light" 
          onClick={() => setFilterExpanded(!filterExpanded)}
          className="filter-toggle-btn mb-4"
        >
          {filterExpanded ? <FaChevronUp /> : <FaChevronDown />}
          <span className="ms-2">Filters</span>
        </Button>
      </div>
      {filterExpanded && (
        <div className="filter_panel">
        <Form>
          <Row>
            <Col md={6} xs={12}>
              <Form.Label className="formLabel">Date From</Form.Label>
              <DatePicker
                selected={date_from}
                onChange={(date) => setDate_from(date)}
                className="date_picker"
              />
            </Col>
            <Col md={6} xs={12}>
              <Form.Label className="formLabel">Date To</Form.Label>
              <DatePicker
                selected={date_to}
                onChange={(date) => setDate_to(date)}
                className="date_picker"
              />
            </Col>
          </Row>
          <Row>
            <Col md={4} xs={12}>
              {" "}
              <Form.Group className="mb-3">
                <Form.Label className="formLabel">Client Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="client email"
                  required
                  name="client_email"
                  className="formInput"
                  onChange={fillFormData}
                />
              </Form.Group>
            </Col>
            <Col md={4} xs={12}>
              {" "}
              <Form.Group className="mb-3">
                <Form.Label className="formLabel">invoice code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="invoice code"
                  required
                  name="invoice_code"
                  className="formInput"
                  onChange={fillFormData}
                />
              </Form.Group>
            </Col>
            <Col md={4} xs={12}>
              <Form.Group controlId="service">
                <Form.Label className="formLabel">status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  onChange={fillFormData}
                  value={formData.status}
                  required
                  className="form-select"
                >
                  <option value="">Select Status</option>
                  {statusLst &&
                    statusLst?.map((row, index) => (
                      <option key={index} value={row.id}>
                        {row.name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}></Col>
            <Col md={{ span: 4, offset: 4 }}>
              <Button className="purbleBtn FullWidthBtn">
                <FiFilter className="btn_icon" />
                Filter
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      )}
      <div className="result_list">
        <Table responsive hover>
          <thead>
            <tr>
              <th>Invoice Code</th>
              <th>client email</th>
              {/* <th>client name</th> */}
              <th>status</th>
              <th>tax</th>
              {/* <th>tax code</th> */}
              {/* <th>copoun</th> */}
              <th>Copoun Discount</th>
              <th>Date</th>
              <th>total price</th>
              <th>currency</th>
              <th>grand total price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Invoices &&
              Invoices.map((invoice, key) => (
                <tr key={key}>
                  <td>{invoice.invoice_code}</td>
                  <td>{invoice.client_email}</td>
                  {/* <td>{invoice.client_name}</td> */}
                  <td>{invoice.status}</td>
                  <td>{invoice.tax_amount}</td>
                  {/* <td>{invoice.tax_code}</td> */}
                  {/* <td>{invoice.copoun}</td> */}
                  <td>{invoice.copoun_discount}</td>
                  <td>{invoice.invoice_date}</td>
                  <td>{invoice.total_price}</td>
                  <td>{invoice.curr_code}</td>
                  <td>{invoice.grand_total_price}</td>
                  <td>
                    {invoice.status == 2 ? (
                      <button
                        className="btn btn-sm btn-info me-2 green-btn"
                        disabled={loading}
                      >
                        <FiCheck />
                      </button>
                    ) : null}

                    <button
                      className="btn btn-sm btn-warning me-2 yellow-btn"
                      disabled={loading}
                    >
                      <FiPrinter />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default InvoicesComp;
