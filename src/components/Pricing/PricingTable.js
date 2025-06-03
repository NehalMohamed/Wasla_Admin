import React from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Spinner, Alert } from 'react-bootstrap';

const PricingTable = ({ 
  pricingData, 
  languages, 
  loading, 
  error, 
  onDeletePackage, 
  onEditPackage, 
  onOpenFeaturesModal 
}) => {
  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Package</th>
            <th>Description</th>
            <th>Price</th>
            <th>Sale Price</th>
            <th>Order</th>
            <th>Curr.</th>
            <th>Lang.</th>
            <th>Features</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pricingData.map((item, index) => (
            <tr key={item.package_id}>
              <td>{item.service_name}</td>
              <td>{item.package_name}</td>
              <td>{item.package_desc}</td>
              <td>{item.package_price}</td>
              <td>{item.package_sale_price}</td>
              <td>{item.order}</td>
              <td>{item.curr_code}</td>
              <td>{item.lang_code}</td>
              <td>
                <button
                  className="btn btn-sm purple-btn"
                  onClick={() => onOpenFeaturesModal(item.package_id)}
                >
                  <FaPlus className="me-1" /> 
                  {/* Features  */}
                  {/* ({item.features.length}) */}
                </button>
              </td>
              <td>
                <button
                  className="btn btn-sm yellow-btn me-2"
                  onClick={() => onEditPackage(item.package_id)}
                >
                  <FaEdit className="me-1" /> 
                  {/* Edit */}
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDeletePackage(item.package_id)}
                >
                  <FaTrash className="me-1" /> 
                  {/* Delete */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;