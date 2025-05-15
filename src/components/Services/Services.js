import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Spinner,
  Modal,
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import PopUp from "../shared/popup/PopUp";
import {
  fetchParentProducts,
  fetchProductTree,
  saveProduct,
  clearMessages,
} from "../../slices/productSlice";
import "./Services.scss";
import LoadingPage from "../Loader/LoadingPage";
import CustomNavbar from "../Navbar/Navbar";
const Services = () => {
  const dispatch = useDispatch();
  const {
    parentProducts,
    productTree,
    status,
    error,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    productId: 0,
    productName: "",
    productParent: 0,
    product_desc: "",
    active: true,
  });

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchParentProducts());
      await dispatch(fetchProductTree());
      setLoading(false);
    };

    loadData();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveProduct(currentProduct)).then(() => {
      dispatch(fetchParentProducts());
      dispatch(fetchProductTree());
      resetForm();
    });
  };

  const resetForm = () => {
    setCurrentProduct({
      productId: 0,
      productName: "",
      productParent: 0,
      product_desc: "",
      active: true,
    });
    setEditMode(false);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setCurrentProduct({
      productId: product.productId,
      productName: product.productName,
      productParent: product.productParent,
      product_desc: product.product_desc || "",
      active: true,
    });
    setEditMode(true);
    setShowForm(true);
  };
  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(
        saveProduct({
          productId: productToDelete.productId,
          productName: productToDelete.productName,
          productParent: productToDelete.productParent,
          product_desc: productToDelete.product_desc || "",
          active: false,
        })
      ).then(() => {
        dispatch(fetchParentProducts());
        dispatch(fetchProductTree());
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      });
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const closePopup = () => {
    dispatch(clearMessages());
  };

  const renderProductTree = (products, level = 0) => {
    return products.map((product) => (
      <React.Fragment key={product.productId}>
        <tr
          className={`product-row ${!product.active ? "inactive-row" : ""}`}
          data-active={product.active.toString()}
        >
          <td style={{ paddingLeft: `${level * 20}px` }}>
            {product.productName}
          </td>
          <td>
            {product.productParent === 0
              ? "Root"
              : parentProducts.find(
                  (p) => p.productId === product.productParent
                )?.productName || "N/A"}
          </td>
          <td>{product.product_desc || "-"}</td>
          <td>
            <button
              className="btn btn-sm btn-warning me-2 yellow-btn"
              onClick={() => handleEdit(product)}
              disabled={!product.active}
            >
              <FaEdit className="me-1" /> Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(product)}
              disabled={!product.active}
            >
              <FaTrash className="me-1" /> Delete
            </button>
          </td>
        </tr>
        {product.children && renderProductTree(product.children, level + 1)}
      </React.Fragment>
    ));
  };

  if (
    status === "loading" &&
    productTree.length === 0 &&
    parentProducts.length === 0
  ) {
    return <LoadingPage />;
  }
  return (
    <>
      <CustomNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2>Service Management</h2>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <FaPlus size={18} className="me-1" /> Add Service
            </Button>
          </Col>
        </Row>

        {/* Success/Error Popups */}
        {successMessage && (
          <PopUp
            show={!!successMessage}
            closeAlert={closePopup}
            msg={successMessage}
            type="success"
            confirmText="OK"
            autoClose={3000} // Auto-close after 3 seconds
          />
        )}

        {errorMessage && (
          <PopUp
            show={!!errorMessage}
            closeAlert={closePopup}
            msg={errorMessage}
            type="error"
            confirmText="OK"
            autoClose={5000} // Auto-close after 5 seconds for errors
          />
        )}

        {/* Delete Confirmation PopUp */}
        <PopUp
          show={showDeleteConfirm}
          closeAlert={cancelDelete}
          msg="Are you sure you want to delete this service?"
          type="confirm"
          confirmAction={confirmDelete}
          confirmText="Delete"
          cancelText="Cancel"
        />
        {/* Product Form Modal */}
        <Modal show={showForm} onHide={() => setShowForm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editMode ? "Edit Service" : "Add New Service"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  name="productName"
                  value={currentProduct.productName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Parent Service</Form.Label>
                <Form.Select
                  name="productParent"
                  value={currentProduct.productParent}
                  onChange={handleInputChange}
                >
                  <option value={0}>Root (No Parent)</option>
                  {parentProducts.map((product) => (
                    <option key={product.productId} value={product.productId}>
                      {product.productName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="product_desc"
                  value={currentProduct.product_desc}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={resetForm}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <Spinner animation="border" size="sm" />
                  ) : editMode ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Product Tree Table */}
        <Card>
          <Card.Body>
            {status === "loading" ? (
              <div className="text-center py-4">
                <Spinner animation="border" />
                <p className="mt-2">Loading services...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Parent</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productTree.length > 0 ? (
                    renderProductTree(productTree)
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No Services found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Services;
