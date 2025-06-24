import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { Spinner, Alert, Form, InputGroup } from 'react-bootstrap';

const PricingTable = ({
  pricingData,
  languages,
  loading,
  error,
  onDeletePackage,
  onEditPackage,
  onOpenFeaturesModal
}) => {

  const [searchValues, setSearchValues] = useState({
    service: '',
    package: '',
    code: '',
    description: '',
    price: '',
    salePrice: '',
    order: '',
    currency: '',
    language: ''
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchValues(prev => ({
      ...prev,
      [name]: value.toLowerCase()
    }));
  };

  const clearSearch = (fieldName) => {
    setSearchValues(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  const safeToString = (value) => {
    if (value === null || value === undefined) return '';
    return value.toString().toLowerCase();
  };

  const filteredData = pricingData?.filter(item => {
    if (!item) return false;

    return (
      safeToString(item.service_name).includes(searchValues.service) &&
      safeToString(item.package_name).includes(searchValues.package) &&
      safeToString(item.package_code).includes(searchValues.code) &&
      safeToString(item.package_desc).includes(searchValues.description) &&
      safeToString(item.package_price).includes(searchValues.price) &&
      safeToString(item.package_sale_price).includes(searchValues.salePrice) &&
      safeToString(item.order).includes(searchValues.order) &&
      safeToString(item.curr_code).includes(searchValues.currency) &&
      safeToString(item.lang_code).includes(searchValues.language)
    );
  }) || [];

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading pricing data...</p>
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!pricingData || pricingData.length === 0) {
    return <Alert variant="info">No pricing packages available</Alert>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>
              <div className="d-flex flex-column">
                <span className="fw-bold">Service</span>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    name="service"
                    value={searchValues.service}
                    onChange={handleSearchChange}
                    disabled={loading}
                    className="search-grid"
                  />
                  {searchValues.service && (
                    <InputGroup.Text
                      className="bg-transparent border-start-0 cursor-pointer"
                      onClick={() => clearSearch('service')}
                    >
                      <FaTimes className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </div>
            </th>
            <th>
              <div className="d-flex flex-column">
                <span className="fw-bold">Package</span>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    name="package"
                    value={searchValues.package}
                    onChange={handleSearchChange}
                    disabled={loading}
                    className="search-grid"
                  />
                  {searchValues.package && (
                    <InputGroup.Text
                      className="bg-transparent border-start-0 cursor-pointer"
                      onClick={() => clearSearch('package')}
                    >
                      <FaTimes className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </div>
            </th>
            <th>
              <div className="d-flex flex-column">
                <span className="fw-bold">Code</span>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    name="code"
                    value={searchValues.code}
                    onChange={handleSearchChange}
                    disabled={loading}
                    className="search-grid"
                  />
                  {searchValues.code && (
                    <InputGroup.Text
                      className="bg-transparent border-start-0 cursor-pointer"
                      onClick={() => clearSearch('code')}
                    >
                      <FaTimes className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </div>
            </th>
            <th className="d-none d-md-table-cell">
              <div className="d-flex flex-column">
                <span className="fw-bold">Description</span>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    name="description"
                    value={searchValues.description}
                    onChange={handleSearchChange}
                    disabled={loading}
                    className="search-grid"
                  />
                  {searchValues.description && (
                    <InputGroup.Text
                      className="bg-transparent border-start-0 cursor-pointer"
                      onClick={() => clearSearch('description')}
                    >
                      <FaTimes className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </div>
            </th>
            <th>
              <div className="d-flex flex-column">
                <span className="fw-bold">Price</span>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    name="price"
                    value={searchValues.price}
                    onChange={handleSearchChange}
                    disabled={loading}
                    className="search-grid"
                  />
                  {searchValues.price && (
                    <InputGroup.Text
                      className="bg-transparent border-start-0 cursor-pointer"
                      onClick={() => clearSearch('price')}
                    >
                      <FaTimes className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </div>
            </th>
            <th className="d-none d-md-table-cell">
              <div className="d-flex flex-column">
                <span className="fw-bold">Sale</span>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    name="salePrice"
                    value={searchValues.salePrice}
                    onChange={handleSearchChange}
                    disabled={loading}
                    className="search-grid"
                  />
                  {searchValues.salePrice && (
                    <InputGroup.Text
                      className="bg-transparent border-start-0 cursor-pointer"
                      onClick={() => clearSearch('salePrice')}
                    >
                      <FaTimes className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </div>
            </th>
            <th className="d-none d-md-table-cell">
              <div className="d-flex flex-column">
                <span className="fw-bold">Order</span>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    name="order"
                    value={searchValues.order}
                    onChange={handleSearchChange}
                    disabled={loading}
                    className="search-grid"
                  />
                  {searchValues.order && (
                    <InputGroup.Text
                      className="bg-transparent border-start-0 cursor-pointer"
                      onClick={() => clearSearch('order')}
                    >
                      <FaTimes className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </div>
            </th>
            <th className="d-none d-md-table-cell">
              <div className="d-flex flex-column">
                <span className="fw-bold">Currency</span>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    name="currency"
                    value={searchValues.currency}
                    onChange={handleSearchChange}
                    disabled={loading}
                    className="search-grid"
                  />
                  {searchValues.currency && (
                    <InputGroup.Text
                      className="bg-transparent border-start-0 cursor-pointer"
                      onClick={() => clearSearch('currency')}
                    >
                      <FaTimes className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </div>
            </th>
            <th className="d-none d-md-table-cell">
              <div className="d-flex flex-column">
                <span className="fw-bold">Language</span>
                <InputGroup size="sm">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    name="language"
                    value={searchValues.language}
                    onChange={handleSearchChange}
                    disabled={loading}
                    className="search-grid"
                  />
                  {searchValues.language && (
                    <InputGroup.Text
                      className="bg-transparent border-start-0 cursor-pointer"
                      onClick={() => clearSearch('language')}
                    >
                      <FaTimes className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
              </div>
            </th>
            <th>
              <div className="d-flex flex-column">
                <span className="fw-bold">Features</span>
                <div style={{ height: '30px' }}></div>
              </div>
            </th>
            <th>
              <div className="d-flex flex-column">
                <span className="fw-bold">Actions</span>
                <div style={{ height: '30px' }}></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.package_id}>
                <td>{item.service_name || '-'}</td>
                <td>{item.package_name || '-'}</td>
                <td>{item.package_code || '-'}</td>
                <td className="d-none d-md-table-cell">{item.package_desc || '-'}</td>
                <td>{item.package_price || '-'}</td>
                <td className="d-none d-md-table-cell">{item.package_sale_price || '-'}</td>
                <td className="d-none d-md-table-cell">{item.order || '-'}</td>
                <td className="d-none d-md-table-cell">{item.curr_code || '-'}</td>
                <td className="d-none d-md-table-cell">{item.lang_code || '-'}</td>
                <td>
                  <button
                    className="btn btn-sm purple-btn"
                    onClick={() => onOpenFeaturesModal(item.package_id)}
                    disabled={loading}
                  >
                    <FaPlus className="me-1" />
                    {/* Features  */}
                    {/* ({item.features.length}) */}
                  </button>
                </td>
                <td>
                  <div className="d-flex">
                    <button
                      className="btn btn-sm yellow-btn me-2"
                      onClick={() => onEditPackage(item.package_id)}
                      disabled={loading}
                    >
                      <FaEdit />
                      {/* Edit */}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDeletePackage(item.package_id)}
                      disabled={loading}
                    >
                      <FaTrash />
                      {/* Delete */}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center py-4">
                No matching records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;