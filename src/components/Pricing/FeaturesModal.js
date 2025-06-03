import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';

const FeaturesModal = ({ 
  show, 
  onHide, 
  packageName, 
  features, 
  onAddFeature, 
  onDeleteFeature 
}) => {
  const [feature, setFeature] = useState('');

  const handleAdd = () => {
    if (!feature) return;
    onAddFeature(feature);
    setFeature('');
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="page-title">Features for {packageName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row mb-3">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              placeholder="Enter feature"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="col-md-2">
            <Button variant="primary" onClick={handleAdd} className="w-100">
              <FaPlus className="me-1" /> Add
            </Button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feat, idx) => (
                <tr key={idx}>
                  <td>{feat.feature_name}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteFeature(idx)}
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
  );
};

export default FeaturesModal;