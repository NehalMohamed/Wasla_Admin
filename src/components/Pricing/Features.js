import React, { useEffect, useState } from "react";
import {
  getPackageFeatures,
  getMainFeatures,
  AssignFeaturesToPackage,
} from "../../slices/pricingSlice";
import { Modal, Button, Form, Col, Table, Row } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const FeaturesModal = ({ show, onHide, pkg, showError }) => {
  const dispatch = useDispatch();
  const [feature, setFeature] = useState(0);
  const { Features, PackageFeatures, loading, error } = useSelector(
    (state) => state.pricing
  );
  useEffect(() => {
    dispatch(getMainFeatures());
    dispatch(
      getPackageFeatures({
        service_package_id: pkg.service_package_id,
        lang_code: "en",
      })
    );
    return () => {};
  }, []);
  const onDeleteFeature = (feat) => {
    const data = {
      id: feat.id,
      feature_id: feat.feature_id,
      service_package_id: feat.service_package_id,
      delete: true,
    };
    dispatch(AssignFeaturesToPackage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setFeature(0);
        dispatch(
          getPackageFeatures({
            service_package_id: pkg.service_package_id,
            lang_code: "en",
          })
        );
      } else {
        console.log("result.payload ", result.payload);
        setFeature(0);
        showError(result.payload.errors);
      }
    });
  };
  const handleAdd = () => {
    const data = {
      id: 0,
      feature_id: feature,
      service_package_id: pkg.service_package_id,
      delete: false,
    };
    dispatch(AssignFeaturesToPackage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setFeature(0);
        dispatch(
          getPackageFeatures({
            service_package_id: pkg.service_package_id,
            lang_code: "en",
          })
        );
      } else {
        console.log("result.payload ", result.payload);
        setFeature(0);
        showError(result.payload.errors);
      }
    });
  };
  console.log("PackageFeatures", PackageFeatures);
  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="page-title">
            Features for {pkg.service_default_name} / {pkg.package_default_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={9}>
              <Form.Group controlId="features">
                <Form.Label>Feature</Form.Label>
                <Form.Control
                  as="select"
                  name="feature"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  required
                >
                  <option key={0}>Select Feature</option>
                  {Features &&
                    Features.map((feat, index) => (
                      <option key={index} value={feat.id}>
                        {feat.feature_code} - {feat.feature_default_name}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button variant="primary" onClick={handleAdd} className="w-100">
                <FaPlus className="me-1" /> Add
              </Button>
            </Col>
          </Row>

          <div className="feature-table table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Feature Code</th>
                  <th>Feature Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {PackageFeatures &&
                  PackageFeatures.map((feat, idx) => (
                    <tr key={idx}>
                      <td>{feat.feature_code}</td>
                      <td>{feat.feature_default_name}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDeleteFeature(feat)}
                        >
                          <FaTrash className="me-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default FeaturesModal;
