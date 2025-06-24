import React from "react";
import { FaPlus, FaEdit } from "react-icons/fa";
import { Form, Button, Row, Col } from "react-bootstrap";

const PricingForm = ({
  services,
  languages,
  currencies,
  formData,
  onInputChange,
  onSubmit,
  editId,
}) => {
  return (
    <Form onSubmit={onSubmit} className="mb-4">
      <Row className="mb-3">
        <Col xs={12} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="service">
            <Form.Control
              as="select"
              name="service_id"
              value={formData.service_id}
              onChange={onInputChange}
              required
            >
              <option value="">Select Service</option>
              {services?.map((service, index) => (
                <option key={index} value={service.productId}>
                  {service.productName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col xs={12} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="package_name">
            <Form.Control
              type="text"
              placeholder="Package Name"
              name="package_name"
              value={formData.package_name}
              onChange={onInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="package_code">
            <Form.Control
              type="text"
              placeholder="Code"
              name="package_code"
              value={formData.package_code}
              onChange={onInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={2}>
          <Form.Group controlId="package_desc">
            <Form.Control
              type="text"
              placeholder="Description"
              name="package_desc"
              value={formData.package_desc}
              onChange={onInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="is_recommend">
            <Form.Check
              type="checkbox"
              label="Recommended"
              name="is_recommend"
              checked={formData.is_recommend}
              onChange={(e) =>
                onInputChange({
                  target: {
                    name: "is_recommend",
                    value: e.target.checked,
                  },
                })
              }
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="is_custom">
            <Form.Check
              type="checkbox"
              label="Custom"
              name="is_custom"
              checked={formData.is_custom}
              onChange={(e) =>
                onInputChange({
                  target: {
                    name: "is_custom",
                    value: e.target.checked,
                  },
                })
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={6} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="package_price">
            <Form.Control
              type="number"
              placeholder="Price"
              name="package_price"
              value={formData.package_price}
              onChange={onInputChange}
              required
              disabled={formData.is_custom == true}
            />
          </Form.Group>
        </Col>

        <Col xs={6} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="package_sale_price">
            <Form.Control
              type="number"
              placeholder="Sale Price"
              name="package_sale_price"
              value={formData.package_sale_price}
              onChange={onInputChange}
              required
              disabled={formData.is_custom == true}
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="order">
            <Form.Control
              type="number"
              placeholder="Order"
              name="order"
              value={formData.order}
              onChange={onInputChange}
              required
            />
          </Form.Group>
        </Col>

        <Col xs={6} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="curr_code">
            <Form.Control
              as="select"
              name="curr_code"
              value={formData.curr_code}
              onChange={onInputChange}
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
        <Col xs={6} md={2} className="mb-2 mb-md-0">
          <Form.Group controlId="lang_code">
            <Form.Control
              as="select"
              name="lang_code"
              value={formData.lang_code}
              onChange={onInputChange}
              required
            >
              {languages.map((lang, index) => (
                <option key={index} value={lang.code}>
                  {lang.code}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs={6} md={2}>
          <Button variant="primary" type="submit" className="w-100">
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
        </Col>
      </Row>
    </Form>
  );
};

export default PricingForm;
