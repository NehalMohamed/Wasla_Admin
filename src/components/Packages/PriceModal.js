import React, { useEffect, useState } from "react";
import {
  AssignPriceToPackage,
  getServicePackagePrice,
} from "../../slices/packagesSlice";
import { Modal, Button, Form, Col, Table, Row } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
const PriceModal = ({ show, onHide, pkg }) => {
  const dispatch = useDispatch();
  const [price, setPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [currency, setCurrency] = useState("EGP");
  const { Prices, loading, error } = useSelector((state) => state.packages);
  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "EGP", symbol: "EGP" },
  ];
  useEffect(() => {
    dispatch(
      getServicePackagePrice({ service_package_id: pkg.service_package_id })
    );
    return () => {};
  }, []);
  const onDeletePrice = (row) => {
    const data = {
      id: row.id,
      service_package_id: row.service_package_id,
      curr_code: row.curr_code,
      package_price: row.package_price,
      package_sale_price: row.package_sale_price,
      discount_amount: row.discount_amount,
      discount_type: row.discount_type,
      delete: true,
    };
    dispatch(AssignPriceToPackage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setPrice(0);
        setSalePrice(0);
        setCurrency("");
        dispatch(
          getServicePackagePrice({ service_package_id: pkg.service_package_id })
        );
      } else {
        setPrice(0);
        setSalePrice(0);
        setCurrency("");
      }
    });
  };
  const handleAdd = () => {
    const data = {
      id: 0,
      service_package_id: pkg.service_package_id,
      curr_code: currency,
      package_price: price,
      package_sale_price: salePrice,
      discount_amount: 0,
      discount_type: 0,
      delete: false,
    };
    dispatch(AssignPriceToPackage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setPrice(0);
        setSalePrice(0);
        setCurrency("");
        dispatch(
          getServicePackagePrice({ service_package_id: pkg.service_package_id })
        );
      } else {
        setPrice(0);
        setSalePrice(0);
        setCurrency("");
      }
    });
  };
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="page-title">
          Prices for {pkg.service_default_name} / {pkg.package_default_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                className="form-control"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                //onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Sale Price</Form.Label>
              <Form.Control
                type="number"
                className="form-control"
                placeholder="Enter sale price"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                //onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="curr_code">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                as="select"
                name="curr_code"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              >
                {currencies.map((currency, index) => (
                  <option key={index} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <div className="col-md-2">
            <Button variant="primary" onClick={handleAdd} className="w-100">
              <FaPlus className="me-1" /> Add
            </Button>
          </div>
        </Row>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Price</th>
                <th>Sale Price</th>
                <th>Currency</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Prices &&
                Prices.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.package_price}</td>
                    <td>{row.package_sale_price}</td>
                    <td>{row.curr_code}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDeletePrice(row)}
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
    </Modal>
  );
};

export default PriceModal;
