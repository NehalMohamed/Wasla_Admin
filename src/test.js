import React, { useState, useEffect } from "react";
import { Navbar, Container, Modal, Button, Spinner } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [order, setOrder] = useState("");
  const [language, setLanguage] = useState("English");
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post("https://152.53.126.186:4431/api/WaslaAdmin/getAdminQuesList", {
          lang: "en",
        });
        const formattedData = res.data.map((q) => ({
          ques_id: q.ques_id,
          question: q.ques_title,
          order: parseInt(q.ques_type),
          language: q.lang_code,
        }));
        setData(formattedData);
      } catch (err) {
        setError("Failed to load questions");
        showToast("Failed to load questions", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-bg-${type} border-0 show position-fixed top-0 end-0 m-3`;
    toast.role = "alert";
    toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div></div>`;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const handleAdd = async () => {
    if (question.trim() === "" || order === "") return;
    setLoading(true);
    setError(null);

    const payload = {
      ques_id: editIndex !== null ? data[editIndex].ques_id : 0,
      ques_title: question,
      ques_type: order.toString(),
      lang_code: language,
    };

    try {
      const res = await axios.post("https://152.53.126.186:4431/api/WaslaAdmin/saveQuestions", payload);
      if (res.data.success) {
        if (editIndex !== null) {
          const updatedData = [...data];
          updatedData[editIndex] = { ...payload, order: parseInt(order) };
          setData(updatedData);
          showToast("Question updated successfully", "success");
          setEditIndex(null);
        } else {
          setData([...data, { ...payload, ques_id: Math.random(), order: parseInt(order) }]);
          showToast("Question added successfully", "success");
        }
      } else {
        showToast("Error saving question", "danger");
      }
    } catch {
      showToast("API Error", "danger");
    } finally {
      setLoading(false);
      setQuestion("");
      setOrder("");
      setLanguage("English");
    }
  };

  const handleEdit = (index) => {
    setQuestion(data[index].question);
    setOrder(data[index].order);
    setLanguage(data[index].language);
    setEditIndex(index);
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    const updatedData = data.filter((_, i) => i !== deleteIndex);
    setData(updatedData);
    showToast("Question deleted", "success");
    setShowConfirm(false);
  };

  const filteredData = data
    .filter((item) => item.question.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.order - b.order);

  return (
    <Container fluid className="p-0">
      <Navbar fixed="top" expand="lg" className="navbar-custom">
        <Container fluid className="p-0 d-flex justify-content-between align-items-center">
          <Navbar.Brand href="/" className="brand d-flex align-items-center">
            <img src="logo/wasla logo.png" alt="Logo" className="logo" />
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div className="main-container">
        <h2 className="mb-4 questions-heading">Add Your Questions</h2>
        <div className="ques-container">
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
                <option value="arb">arb</option>
                <option value="fre">fre</option>
              </select>
            </div>
            <div className="col-md-2 mb-2">
              <button className="btn btn-primary w-100" onClick={handleAdd} disabled={loading}>
                {editIndex !== null ? <><FaEdit className="me-1" /> Update</> : <><FaPlus className="me-1" /> Add</>}
              </button>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search questions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading && <Spinner animation="border" variant="primary" className="mb-3" />}
          {error && <div className="alert alert-danger">{error}</div>}

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
                {filteredData.length === 0 && !loading && !error ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No questions match your search.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((entry, index) => (
                    <tr key={entry.ques_id}>
                      <td>{entry.question}</td>
                      <td>{entry.order}</td>
                      <td>{entry.language}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2 yellow-btn"
                          onClick={() => handleEdit(data.findIndex((d) => d.ques_id === entry.ques_id))}
                        >
                          <FaEdit className="me-1" /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => confirmDelete(data.findIndex((d) => d.ques_id === entry.ques_id))}
                        >
                          <FaTrash className="me-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
