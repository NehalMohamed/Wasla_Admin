import React from 'react';
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
    <div className="row mb-3">
      <div className="col-md-6 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div className="col-md-2 mb-2">
        <input
          type="number"
          className="form-control"
          placeholder="Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
      </div>
      <div className="col-md-2 mb-2">
        <select
          className="form-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">en</option>
          <option value="ar">ar</option>
          <option value="de">de</option>
        </select>
      </div>
      <div className="col-md-2 mb-2">
        <button className="btn btn-primary w-100" onClick={handleAdd}>
          {editId !== null ? (
            <>
              <FaEdit className="me-1" /> Update
            </>
          ) : (
            <>
              <FaPlus className="me-1" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;