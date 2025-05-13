import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Spinner, Alert } from 'react-bootstrap';
import LoadingPage from '../Loader/LoadingPage';

const QuestionsList = ({ 
  data, 
  searchTerm = "", 
  loading, 
  error, 
  handleEdit, 
  handleDelete 
}) => {
  if (loading) return <LoadingPage />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const filteredData = [...data]
    .sort((a, b) => parseInt(a.order) - parseInt(b.order))
    .filter((entry) =>
      entry.lang_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Order</th>
            <th>Language</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((entry) => (
            <tr key={entry.ques_id}>
              <td>{entry.ques_title}</td>
              <td>{entry.order}</td>
              <td>{entry.lang_code}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2 yellow-btn"
                  onClick={() => handleEdit(entry)}
                >
                  <FaEdit className="me-1" /> Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(entry)}
                >
                  <FaTrash className="me-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsList;