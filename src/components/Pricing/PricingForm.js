import React from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { Form, Button, Row, Col, Spinner, Alert, Modal, Table } from 'react-bootstrap';

const PricingForm = ({
    services,
    languages,
    currencies,
    formData,
    onInputChange,
    onSubmit,
    editId
}) => {
    return (
        <Form onSubmit={onSubmit} className="mb-4">
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group controlId="service">
                        <Form.Control
                            as="select"
                            name="service_id"
                            value={formData.service_id}
                            onChange={onInputChange}
                            required
                        >
                            <option value="">Select Service</option>
                            {services.map((service, index) => (
                                <option key={index} value={service.service_id}>{service.service_Name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={4}>
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

                <Col md={4}>
                    <Form.Group controlId="package_desc">
                        <Form.Control
                            type="text"
                            placeholder="Package Description"
                            name="package_desc"
                            value={formData.package_desc}
                            onChange={onInputChange}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={2}>
                    <Form.Group controlId="package_price">
                        <Form.Control
                            type="number"
                            placeholder="Price"
                            name="package_price"
                            value={formData.package_price}
                            onChange={onInputChange}
                            required
                        />
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Form.Group controlId="package_sale_price">
                        <Form.Control
                            type="number"
                            placeholder="Sale Price"
                            name="package_sale_price"
                            value={formData.package_sale_price}
                            onChange={onInputChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="order">
                        <Form.Control
                            type="number"
                            placeholder="order"
                            name="order"
                            value={formData.order}
                            onChange={onInputChange}
                            required
                        />
                    </Form.Group>
                </Col>

                <Col md={2}>
                    <Form.Group controlId="curr_code">
                        <Form.Control
                            as="select"
                            name="curr_code"
                            value={formData.curr_code}
                            onChange={onInputChange}
                            required
                        >
                            {currencies.map((currency, index) => (
                                <option key={index} value={currency.code}>{currency.code}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group controlId="lang_code">
                        <Form.Control
                            as="select"
                            name="lang_code"
                            value={formData.lang_code}
                            onChange={onInputChange}
                            required
                        >
                            {languages.map((lang, index) => (
                                <option key={index} value={lang.code}>{lang.code}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={2}>
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