import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  GetReports_Mains,
  GetReportData,
} from "../../../slices/AccountingSlice";
import DatePicker from "react-datepicker";
import LoadingPage from "../../Loader/LoadingPage";
import { Row, Col, Button, Form } from "react-bootstrap";
import { format } from "date-fns";
import { TbFileReport } from "react-icons/tb";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import SummaryInvoice from "./SummaryInvoice";
function Reports() {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");
  const [popupType, setPopupType] = React.useState("alert");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() - 1);
  const [date_from, setDate_from] = useState(newDate);
  const [date_to, setDate_to] = useState(new Date());
  const [formData, setformData] = useState({
    date_from: format(newDate, "dd-MM-yyyy hh:mm:ss"),
    date_to: format(new Date(), "dd-MM-yyyy hh:mm:ss"),
    report_id: 0,
  });
  const { reports, loading, error } = useSelector((state) => state.accounting);

  // Fetch invoices on component mount
  useEffect(() => {
    dispatch(GetReports_Mains()).catch((error) => {
      setPopupMessage(error || "Failed to fetch data");
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
  const GetData = () => {
    dispatch(GetReportData(formData)).catch((error) => {
      setPopupMessage(error || "Failed to fetch data");
      setPopupType("error");
      setShowPopup(true);
    });
  };
  if (loading) {
    return <LoadingPage />;
  }
  return (
    <>
      {" "}
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4 page-title">Reports Management</h2>
        <div className="d-flex align-items-center"></div>
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
              <Col md={4} xs={12}>
                <Form.Label className="formLabel">Date From</Form.Label>
                <DatePicker
                  selected={date_from}
                  onChange={(date) => setDate_from(date)}
                  className="date_picker"
                  dateFormat="dd-MM-yyyy"
                />
              </Col>
              <Col md={4} xs={12}>
                <Form.Label className="formLabel">Date To</Form.Label>
                <DatePicker
                  selected={date_to}
                  dateFormat="dd-MM-yyyy"
                  onChange={(date) => setDate_to(date)}
                  className="date_picker"
                />
              </Col>
              <Col md={4} xs={12}>
                <Form.Group>
                  <Form.Label>Report</Form.Label>
                  <Form.Control
                    as="select"
                    name="report_id"
                    onChange={fillFormData}
                    value={formData.report_id}
                    required
                    className="form-select"
                  >
                    <option value="">Select Report</option>
                    {reports &&
                      reports?.map((report, index) => (
                        <option key={index} value={report.id}>
                          {report.report_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}></Col>
              <Col md={{ span: 4, offset: 4 }}>
                <Button className="purbleBtn FullWidthBtn" onClick={GetData}>
                  <TbFileReport className="btn_icon" />
                  Generate
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
      <div className="result_list">
        {formData.report_id == 1 ? <SummaryInvoice /> : null}
      </div>
    </>
  );
}

export default Reports;
