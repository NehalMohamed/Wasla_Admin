import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { Spinner, Form, Button, Row, Col } from 'react-bootstrap';
import { saveQuestion, fetchQuestions, clearCurrentQuestion } from '../../slices/questionsSlice';

// Component for the question form (add/edit)
const QuestionsForm = ({ setPopupMessage, setPopupType, setShowPopup }) => {
  const dispatch = useDispatch();
  // Get current question and save status from Redux store
  const { currentQuestion, saveStatus } = useSelector(state => state.questions);
  // Form state
  const [formData, setFormData] = useState({
    ques_id: 0,
    ques_title_default: '',
    ques_type: '',
    order: 0,
    active: true
  });

  // Update form data when currentQuestion changes (for editing)
  useEffect(() => {
    if (currentQuestion) {
      setFormData({
        ques_id: currentQuestion.ques_id,
        ques_title_default: currentQuestion.ques_title_default,
        ques_type:'',
        order: currentQuestion.order || 0,
        active: currentQuestion.active
      });
    } else {
      // Reset form when no question is selected
      setFormData({
        ques_id: 0,
        ques_title_default: '',
        ques_type: '',
        order: 0,
        active: true
      });
    }
  }, [currentQuestion]);

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
      // Save question to backend
      const result = await dispatch(
        saveQuestion({
          ...formData,
          active: true,
          delete: false
        })
      ).unwrap();

      // Refresh questions list and reset form
      dispatch(fetchQuestions());
      dispatch(clearCurrentQuestion());
      
      // Show success message
      setPopupMessage(formData.ques_id ? 'Question updated successfully' : 'Question added successfully');
      setPopupType('success');
      setShowPopup(true);
    } catch (error) {
      // Handle errors
      const errorMessage = typeof error === 'string' ? error : 
                          error.message || 'Failed to save question';
      
      setPopupMessage(errorMessage);
      setPopupType('error');
      setShowPopup(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        {/* Question Title Field */}
        <Col md={5}>
          <Form.Group controlId="questionTitle">
            <Form.Label>Question Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter question title"
              name="ques_title_default"
              value={formData.ques_title_default}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        
        {/* Order Field */}
        <Col md={4}>
          <Form.Group controlId="questionOrder">
            <Form.Label>Order</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter order"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        
        {/* Submit Button */}
        <Col md={3} className="d-flex align-items-end">
          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={saveStatus === 'loading'}
          >
            {saveStatus === 'loading' ? (
              <Spinner animation="border" size="sm" />
            ) : formData.ques_id ? (
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

export default QuestionsForm;