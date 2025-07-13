import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMainServices,
  fetchMainPackages,
  getServiceGrpWithPkgs,
  AssignPackagesToService,
  SaveMainPackage,
} from "../../slices/pricingSlice";
import PopUp from "../shared/popup/PopUp";
import LoadingPage from "../Loader/LoadingPage";
import { FaEdit, FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import { FiDollarSign, FiLayers, FiEdit } from "react-icons/fi";
import { Form, Row, Col, Button, Accordion, Table } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import PriceModal from "./PriceModal";
import FeatureModal from "./Features";
import "./Pricing.scss";

const PricingPackages = () => {
  const dispatch = useDispatch();
  const { services, packages, loading, error, PackagesWithService } =
    useSelector((state) => state.pricing);

  const [formData, setFormData] = useState({
    service_id: 0,
    package_id: 0,
    is_recommend: false,
  }); // Form state for assigning packages to services
  const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [showPriceModal, setShowPriceModal] = useState(false); // State for price modal visibility
  const [showFeatureModal, setShowFeatureModal] = useState(false); // State for feature modal visibility
  const [ActivePkg, setActivePkg] = useState(null); // State for active package

  // Fetch services and packages on component mount
  useEffect(() => {
    dispatch(fetchMainServices({ isDropDown: false }));
    dispatch(fetchMainPackages({ isDropDown: false }));
    dispatch(getServiceGrpWithPkgs());
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission for assigning packages to services
  const onSubmit = (e) => {
    e.preventDefault();
    formData["id"] = 0;
    dispatch(AssignPackagesToService(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        setFormData({
          service_id: "",
          package_id: "",
          is_recommend: false,
        });
        dispatch(getServiceGrpWithPkgs());
      } else {
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };

  // Handle showing errors
  const showError = (err) => {
    setShowPopup(true);
    setPopupMessage(err);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4 page-title">Packages Management</h2>
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
            placeholder="Search By Service ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>
      </div>
      <Form onSubmit={onSubmit} className="mb-4">
        <Row className="mb-3">
          <Col xs={12} md={3} className="mb-2 mb-md-0">
            <Form.Group controlId="service">
              <Form.Label>Service</Form.Label>
              <Form.Control
                as="select"
                name="service_id"
                onChange={handleInputChange}
                value={formData.service_id}
                required
              >
                <option value="">Select Service</option>
                {services &&
                  services?.map((service, index) => (
                    <option key={index} value={service.id}>
                      {service.service_code} - {service.default_name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={3} className="mb-2 mb-md-0">
            <Form.Group controlId="service">
              <Form.Label>Package</Form.Label>
              <Form.Control
                as="select"
                name="package_id"
                onChange={handleInputChange}
                value={formData.package_id}
                required
              >
                <option value="">Select Package</option>
                {packages &&
                  packages?.map((pkg, index) => (
                    <option key={index} value={pkg.id}>
                      {pkg.package_code} - {pkg.default_name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={3} className="mb-2 mb-md-0">
            <Form.Group controlId="is_recommend">
              <Form.Check
                className="mt-30"
                type="checkbox"
                label="Recommended"
                name="is_recommend"
                checked={formData.is_recommend}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    is_recommend: e.target.checked,
                  });
                }}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Button variant="primary" type="submit" className="w-100 mt-30">
              <FaPlus className="me-1" /> Add
            </Button>
          </Col>
        </Row>
      </Form>
      <div className="result_list">
        {PackagesWithService &&
          PackagesWithService?.filter((item) =>
            item.service_default_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          ).map((row, index) => (
            <Accordion key={index} defaultActiveKey={index}>
              <Accordion.Item eventKey={index}>
                <Accordion.Header>
                  {row.service_code} - {row.service_default_name}
                </Accordion.Header>
                <Accordion.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Package Code</th>
                        <th>Package Name</th>
                        <th>Recommend</th>
                        <th>Custom</th>
                        <th>Order</th>
                        <th>actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row &&
                        row.pkgs &&
                        row.pkgs.map((pkg, key) => (
                          <tr key={key}>
                            <td>{pkg.package_code}</td>
                            <td>{pkg.package_default_name}</td>
                            <td>
                              {pkg.is_recommend ? (
                                <FaCheck className="text-success" />
                              ) : (
                                <FaTimes className="text-danger" />
                              )}
                            </td>
                            <td>
                              {pkg.is_custom ? (
                                <FaCheck className="text-success" />
                              ) : (
                                <FaTimes className="text-danger" />
                              )}
                            </td>
                            <td>{pkg.order}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-info me-2 green-btn"
                                disabled={loading}
                                onClick={() => {
                                  setActivePkg(pkg);
                                  setShowPriceModal(true);
                                }}
                              >
                                <FiDollarSign />
                              </button>
                              <button
                                className="btn btn-sm btn-warning me-2 yellow-btn"
                                disabled={loading}
                                onClick={() => {
                                  setActivePkg(pkg);
                                  setShowFeatureModal(true);
                                }}
                              >
                                <FiLayers />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
      </div>
      {loading ? <LoadingPage /> : null}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />
      {showPriceModal && ActivePkg ? (
        <PriceModal
          show={showPriceModal}
          onHide={() => {
            setShowPriceModal(false);
            setActivePkg(null);
          }}
          pkg={ActivePkg}
        />
      ) : null}
      {showFeatureModal && ActivePkg ? (
        <FeatureModal
          show={showFeatureModal}
          onHide={() => {
            setShowFeatureModal(false);
            setActivePkg(null);
          }}
          pkg={ActivePkg}
          showError={(error) => showError(error)}
        />
      ) : null}
    </>
  );
};

export default PricingPackages;