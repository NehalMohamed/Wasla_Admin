import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { Spinner, Form, Button, Row, Col } from 'react-bootstrap';
import { saveFeature, fetchFeatures, clearCurrentFeature } from '../../slices/featuresSlice';

const FeaturesForm = ({ setPopupMessage, setPopupType, setShowPopup }) => {
  const dispatch = useDispatch();
  const { currentFeature, saveStatus } = useSelector(state => state.features);
  const [formData, setFormData] = useState({
    id: 0,
    feature_code: '',
    feature_default_name: ''
  });

  useEffect(() => {
    if (currentFeature) {
      setFormData({
        id: currentFeature.feature_id,
        feature_code: currentFeature.feature_code,
        feature_default_name: currentFeature.feature_default_name
      });
    } else {
      setFormData({
        id: 0,
        feature_code: '',
        feature_default_name: ''
      });
    }
  }, [currentFeature]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        saveFeature({
          ...formData,
          active: true,
          delete: false
        })
      ).unwrap();

      dispatch(fetchFeatures());
      dispatch(clearCurrentFeature());
      
      setPopupMessage(formData.id ? 'Feature updated successfully' : 'Feature added successfully');
      setPopupType('success');
      setShowPopup(true);
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : 
                          error.message || 'Failed to save feature';
      
      setPopupMessage(errorMessage);
      setPopupType('error');
      setShowPopup(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={5}>
          <Form.Group controlId="featureCode">
            <Form.Label>Feature Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter feature code"
              name="feature_code"
              value={formData.feature_code}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={5}>
          <Form.Group controlId="defaultName">
            <Form.Label>Default Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter default name"
              name="feature_default_name"
              value={formData.feature_default_name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
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

export default FeaturesForm;