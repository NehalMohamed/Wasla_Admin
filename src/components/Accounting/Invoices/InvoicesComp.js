import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  GetAllInvoices,
  ConfirmInvoice,
} from "../../../slices/AccountingSlice";
import { GetClientProfileByAdmin } from "../../../slices/profileSlice";
import {
  FaEdit,
  FaSearch,
  FaCheck,
  FaTimes,
  FaChevronUp,
  FaChevronDown,
  FaMoneyBillWave,
  FaShoppingCart,
  FaClock,
} from "react-icons/fa";
import {
  Form,
  Col,
  Row,
  Button,
  Table,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import DatePicker from "react-datepicker";

import "./InvoicesComp.scss";
import { FiCheck, FiDownload, FiFilter, FiPrinter } from "react-icons/fi";
import LoadingPage from "../../Loader/LoadingPage";
import { format } from "date-fns";
import downloadInvoice from "../../../utils/downloadInvoice";
function InvoicesComp() {
  const dispatch = useDispatch();
  const [filterExpanded, setFilterExpanded] = useState(false);
  //get to_date = now date minus one month
  const newDate = new Date();
  newDate.setMonth(newDate.getMonth() - 1);
  const statusLst = [
    { name: "pending", id: 1 },
    { name: "checkout", id: 2 },
    { name: "paid", id: 3 },
  ];
  // Get invoices data and status from Redux store
  const { Invoices, loading, error } = useSelector((state) => state.accounting);
  const { profileData } = useSelector((state) => state.profile);
  // State for popup management
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");
  const [popupType, setPopupType] = React.useState("alert");
  const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
  const [date_from, setDate_from] = useState(newDate);
  const [date_to, setDate_to] = useState(new Date());
  const [formData, setformData] = useState({
    date_from: format(newDate, "dd-MM-yyyy hh:mm:ss"),
    date_to: format(new Date(), "dd-MM-yyyy hh:mm:ss"),
    client_email: "",
    status: 0,
    active: true,
    invoice_code: "",
    lang_code: "en",
  });
  // Fetch invoices on component mount
  useEffect(() => {
    dispatch(GetAllInvoices(formData)).catch((error) => {
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
  if (loading) {
    return <LoadingPage />;
  }

  const GetInvoicesByFilter = () => {
    formData["date_from"] = format(date_from, "dd-MM-yyyy hh:mm:ss");
    formData["date_to"] = format(date_to, "dd-MM-yyyy hh:mm:ss");
    dispatch(GetAllInvoices(formData)).catch((error) => {
      setPopupMessage(error || "Failed to fetch invoices");
      setPopupType("error");
      setShowPopup(true);
    });
  };
  const ConfirmClientInvoice = (client_id, invoice_id) => {
    const req = { status: 3, client_id: client_id, invoice_id: invoice_id };
    dispatch(ConfirmInvoice(req)).then((result) => {
      if (result.payload && result.payload.success) {
        setPopupType("success");
        dispatch(GetAllInvoices(formData)).catch((error) => {
          setPopupMessage(error || "Failed to fetch invoices");
          setPopupType("error");
          setShowPopup(true);
        });
      } else {
        setPopupType("error");
      }
      setPopupMessage(result.payload?.message);
      setShowPopup(true);
    });
  };
  const handleDownload = async (invoice) => {
    try {
      // Ensure we have the latest profile data
      // await dispatch(GetClientProfileByAdmin(invoice.client_id)).unwrap();
      await dispatch(GetClientProfileByAdmin(invoice.client_id)).then(
        (result) => {
          const data = result.payload;
          if (data != null) {
            downloadInvoice({
              user: data?.full_name || invoice.client_name || "",
              contact: data?.phone_number,
              address: data?.address || "",
              InvoiceNo: invoice.invoice_code || "",
              Date: invoice.invoice_date || new Date().toLocaleDateString(),
              SubTtotal: invoice.total_price || "0",
              Discount: invoice.discount || "0",
              Total: invoice.grand_total_price || "0",
              services: invoice.pkgs || [],
            });
          }
        }
      );
    } catch (error) {
      // Fallback to invoice data if profile fetch fails
      // downloadInvoice({
      //   user: invoice.client_name || "",
      //   contact: "",
      //   address: invoice.user_address || "",
      //   InvoiceNo: invoice.invoice_code || "",
      //   Date: invoice.invoice_date || new Date().toLocaleDateString(),
      //   SubTtotal: invoice.total_price || "0",
      //   Discount: invoice.discount || "0",
      //   Total: invoice.grand_total_price || "0",
      //   services: invoice.pkgs || [],
      // });
      setPopupMessage(error.toString() || "Failed to fetch profile");
      setShowPopup(true);
      setPopupType("error");
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Checkout";
      case 3:
        return "paid";
      default:
        return "pending";
    }
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Payed
    </Tooltip>
  );
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
                  dateFormat="dd-MM-yyyy"
                />
              </Col>
              <Col md={6} xs={12}>
                <Form.Label className="formLabel">Date To</Form.Label>
                <DatePicker
                  selected={date_to}
                  dateFormat="dd-MM-yyyy"
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
                    value={formData.client_email}
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
                    value={formData.invoice_code}
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
                    <option value="0">Select Status</option>
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
                <Button
                  className="purbleBtn FullWidthBtn"
                  onClick={GetInvoicesByFilter}
                >
                  <FiFilter className="btn_icon" />
                  Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
      <div className="result_list">
        <Table responsive hover className="invoice_tbl">
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
            {Invoices && Invoices.length > 0 ? (
              Invoices.filter((item) =>
                item.invoice_code
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ).map((invoice, key) => (
                <tr
                  key={key}
                  className={
                    invoice.status == 3 ? "payedInvoice" : "NotPayedInv"
                  }
                >
                  <td>{invoice.invoice_code}</td>
                  <td>{invoice.client_email}</td>
                  {/* <td>{invoice.client_name}</td> */}
                  <td>{getStatusText(invoice.status)}</td>

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
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                      >
                        <button
                          className="btn btn-sm btn-info green-btn grid_btn"
                          disabled={loading}
                          onClick={() =>
                            ConfirmClientInvoice(
                              invoice.client_id,
                              invoice.invoice_id
                            )
                          }
                        >
                          <FiCheck />
                        </button>
                      </OverlayTrigger>
                    ) : null}

                    <button
                      className="btn btn-sm btn-warning dark-btn grid_btn"
                      disabled={loading}
                      onClick={() => handleDownload(invoice)}
                    >
                      <FiDownload />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan="10">No Invoices</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default InvoicesComp;
