import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { Spinner, Form, Button, Row, Col } from 'react-bootstrap';
import { saveService, fetchServices, clearCurrentService } from '../../slices/servicesSlice';

// Component for the service form (add/edit)
const ServicesForm = ({ setPopupMessage, setPopupType, setShowPopup }) => {
  const dispatch = useDispatch();
  // Get current service and save status from Redux store
  const { currentService, saveStatus } = useSelector(state => state.services);
  // Form state
  const [formData, setFormData] = useState({
    id: 0,
    service_code: '',
    default_name: ''
  });

  // Update form data when currentService changes (for editing)
  useEffect(() => {
    if (currentService) {
      setFormData({
        id: currentService.id,
        service_code: currentService.service_code,
        default_name: currentService.default_name
      });
    } else {
      // Reset form when no service is selected
      setFormData({
        id: 0,
        service_code: '',
        default_name: ''
      });
    }
  }, [currentService]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save service to backend
      const result = await dispatch(
        saveService({
          ...formData,
          active: true
        })
      ).unwrap();

      // Refresh services list and reset form
      dispatch(fetchServices());
      dispatch(clearCurrentService());
      
      // Show success message
      setPopupMessage(formData.id ? 'Service updated successfully' : 'Service added successfully');
      setPopupType('success');
      setShowPopup(true);
    } catch (error) {
      // Handle errors (either string or error object)
      const errorMessage = typeof error === 'string' ? error : 
                          error.message || 'Failed to save service';
      
      setPopupMessage(errorMessage);
      setPopupType('error');
      setShowPopup(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        {/* Service Code Field */}
        <Col md={5}>
          <Form.Group controlId="serviceCode">
            <Form.Label>Service Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter service code"
              name="service_code"
              value={formData.service_code}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        
        {/* Default Name Field */}
        <Col md={5}>
          <Form.Group controlId="defaultName">
            <Form.Label>Default Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter default name"
              name="default_name"
              value={formData.default_name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        
        {/* Submit Button */}
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

export default ServicesForm;