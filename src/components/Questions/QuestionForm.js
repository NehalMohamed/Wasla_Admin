import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaPlus, FaEdit } from 'react-icons/fa';

const QuestionForm = ({ 
  question, 
  setQuestion, 
  order, 
  setOrder, 
  language, 
  setLanguage, 
  editId, 
  handleAdd 
}) => {
  return (
    <Form className="row mb-3">
      <Form.Group className="col-md-6 mb-2" controlId="questionInput">
        <Form.Label>Question</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="col-md-2 mb-2" controlId="orderInput">
         <Form.Label>Order</Form.Label>
        <Form.Control
          type="number"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="col-md-2 mb-2" controlId="languageSelect">
         <Form.Label>Question</Form.Label>
        <Form.Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
        >
          <option value="en">EN-English</option>
          <option value="ar">AR-Arabic</option>
          <option value="de">DE-Dutch</option>
        </Form.Select>
      </Form.Group>

      <div className="col-md-2 mb-2 d-flex align-items-end">
        <Button 
          variant="primary" 
          className="w-100" 
          onClick={handleAdd}
        >
          {editId !== null ? (
            <>
              <FaEdit className="me-1" /> Update
            </>
          ) : (
            <>
              <FaPlus className="me-1" /> Add
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default QuestionForm;