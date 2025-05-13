import React, { useEffect, useState } from "react";
import { Navbar, Container, Spinner, Alert } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash ,FaSearch } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [order, setOrder] = useState("");
  const [language, setLanguage] = useState("en");
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 
  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "/api/WaslaAdmin/getAdminQuesList",
        { lang: "all" }
      );
      const sortedData = response.data.sort((a, b) => a.ques_id - b.ques_id); 
      setData(sortedData);
    } catch (err) {
      setError("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async () => {
    if (question.trim() === "" || order === "") return;

    const payload = {
      ques_id: editId ?? 0,
      ques_title: question,
      order: order.toString(),
      ques_type:"",
      lang_code: language
    };


    try {
      await axios.post(
        "/api/WaslaAdmin/saveQuestions",
        payload
      );
      setQuestion("");
      setOrder("");
      setLanguage("en");
      setEditId(null);
      fetchQuestions(); // Refresh list
    } catch {
      setError("Failed to save question.");
    }
  };

  const handleEdit = (entry) => {
    setQuestion(entry.ques_title);
    setOrder(entry.order);
    setLanguage(entry.lang_code);
    setEditId(entry.ques_id);
  };

  const handleDelete = async (entry) => {
    try {
      await axios.post("/api/WaslaAdmin/deleteQuestions", {
        ques_id: entry.ques_id,
        ques_title: entry.ques_title,
        order:entry.order,
        ques_type: "",
        lang_code: entry.lang_code
      });
      fetchQuestions();
    } catch {
      setError("Failed to delete question.");
    }
  };

  return (
    <Container fluid className="p-0">
      <Navbar fixed="top" expand="lg" className="navbar-custom">
        <Container fluid className="p-0 d-flex justify-content-between align-items-center">
          <Navbar.Brand href="/" className="brand d-flex align-items-center">
            <img src="wasla logo.png" alt="Logo" className="logo" />
          </Navbar.Brand>
          <div className="d-flex align-items-center ms-auto me-3 position-relative" style={{ width: "250px" }}>
            <FaSearch className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
            <input
              type="text"
              className="form-control ps-6"
              placeholder="Search By language ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "30px" }}
            />
          </div>
        </Container>
      </Navbar>

      <div className="main-container">
        <h2 className="mb-4 questions-heading">Add Your Questions</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
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
                  {[...data]
                    .sort((a, b) => parseInt(a.order) - parseInt(b.order))
                    .filter((entry) =>
                      entry.lang_code.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((entry) => (
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
          </>
        )}
      </div>
    </Container>
  );
}

export default App;