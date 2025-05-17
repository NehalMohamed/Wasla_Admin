import React, { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SideMenu from "../components/Navbar/SideMenu";
import {
  fetchQuestions,
  saveQuestion,
  deleteQuestion,
} from "../slices/questionsSlice";
import QuestionForm from "../components/Questions/QuestionForm";
import QuestionsList from "../components/Questions/QuestionsList";
import "../components/Questions/Question.scss";
const QuestionsPage = () => {
  const [question, setQuestion] = useState("");
  const [order, setOrder] = useState("");
  const [language, setLanguage] = useState("en");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.questions);

  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  const handleAdd = async () => {
    if (question.trim() === "" || order === "") return;

    const payload = {
      ques_id: editId ?? 0,
      ques_title: question,
      order: order.toString(),
      ques_type: "",
      lang_code: language,
    };

    await dispatch(saveQuestion(payload));
    dispatch(fetchQuestions()); // re-fetch after saving
    setQuestion("");
    setOrder("");
    setLanguage("en");
    setEditId(null);
  };

  const handleEdit = (entry) => {
    setQuestion(entry.ques_title);
    setOrder(entry.order);
    setLanguage(entry.lang_code);
    setEditId(entry.ques_id);
  };

  const handleDelete = async (entry) => {
    await dispatch(deleteQuestion(entry));
    // fetchQuestions not needed here because the reducer updates local state
  };

  const [menuExpanded, setMenuExpanded] = useState(true);
  
  return (
     <div className="app-container">
      <SideMenu onToggle={setMenuExpanded}/>
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-4 questions-heading">Questions Management</h2>
          <div className="mb-4 position-relative" style={{ width: "250px" }}>
            <FaSearch
              className="position-absolute"
              style={{
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            />
            <input
              type="text"
              className="form-control ps-6"
              placeholder="Search By language ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "30px" }}
            />
          </div>
        </div>
        <QuestionForm
          question={question}
          setQuestion={setQuestion}
          order={order}
          setOrder={setOrder}
          language={language}
          setLanguage={setLanguage}
          editId={editId}
          handleAdd={handleAdd}
        />
        <QuestionsList
          data={data}
          searchTerm={searchTerm}
          loading={loading}
          error={error}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </main>
    </div>
  );
};

export default QuestionsPage;
