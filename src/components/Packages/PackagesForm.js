import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { Spinner, Form, Button, Row, Col, FormCheck } from 'react-bootstrap';
import { savePackage, fetchPackages, clearCurrentPackage } from '../../slices/packagesSlice';

const PackagesForm = ({ setPopupMessage, setPopupType, setShowPopup }) => {
  const dispatch = useDispatch();
  const { currentPackage, saveStatus } = useSelector(state => state.packages);
  const [formData, setFormData] = useState({
    id: 0,
    package_code: '',
    default_name: '',
    is_recommend: false,
    is_custom: false,
    active: true,
    order: 0
  });

  useEffect(() => {
    if (currentPackage) {
      setFormData({
        id: currentPackage.id,
        package_code: currentPackage.package_code,
        default_name: currentPackage.default_name,
        is_recommend: currentPackage.is_recommend,
        is_custom: currentPackage.is_custom,
        active: currentPackage.active,
        order: currentPackage.order
      });
    } else {
      setFormData({
        id: 0,
        package_code: '',
        default_name: '',
        is_recommend: false,
        is_custom: false,
        active: true,
        order: 0
      });
    }
  }, [currentPackage]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(savePackage(formData)).unwrap();
      dispatch(fetchPackages());
      dispatch(clearCurrentPackage());
      
      setPopupMessage(formData.id ? 'Package updated successfully' : 'Package added successfully');
      setPopupType('success');
      setShowPopup(true);
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 
                          error.message || 'Failed to save package';
      
      setPopupMessage(errorMessage);
      setPopupType('error');
      setShowPopup(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={2}>
          <Form.Group controlId="packageCode">
            <Form.Label>Package Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter code"
              name="package_code"
              value={formData.package_code}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="defaultName">
            <Form.Label>Default Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="default_name"
              value={formData.default_name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="order">
            <Form.Label>Order</Form.Label>
            <Form.Control
              type="number"
              placeholder="Order"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-center">
          <FormCheck
            type="checkbox"
            id="isRecommend"
            label="Recommended"
            name="is_recommend"
            checked={formData.is_recommend}
            onChange={handleInputChange}
            className="mt-4"
          />
        </Col>
        <Col md={1} className="d-flex align-items-center">
          <FormCheck
            type="checkbox"
            id="isCustom"
            label="Custom"
            name="is_custom"
            checked={formData.is_custom}
            onChange={handleInputChange}
            className="mt-4"
          />
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={saveStatus === 'loading'}
          >
            {saveStatus === 'loading' ? (
              <Spinner animation="border" size="sm" />
            ) : formData.id ? (
              <>
                <FaEdit className="me-1" /> Update
              </>
            ) : (
              <>
                <FaPlus className="me-1" /> Add
              </>
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PackagesForm;