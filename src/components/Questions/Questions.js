import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import { fetchQuestions } from '../../slices/questionsSlice';
import QuestionsForm from './QuestionsForm';
import QuestionsList from './QuestionsList';
import PopUp from '../shared/popup/PopUp';
import LoadingPage from '../Loader/LoadingPage';
import './Questions.scss';

// Main component for Questions Management
const Questions = () => {
  const dispatch = useDispatch();
  // Get questions data and status from Redux store
  const { items, status, error } = useSelector(state => state.questions);
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  // State for popup management
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('alert');

  // Fetch questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        await dispatch(fetchQuestions()).unwrap();
      } catch (error) {
        console.log(error)
        setPopupMessage('Failed to load questions');
        setPopupType('error');
        setShowPopup(true);
      }
    };
    loadQuestions();
  }, [dispatch]);

  // Filter questions based on search term
  const filteredQuestions = items.filter(question =>
    question.ques_title_default.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="questions-container">
      {/* Show loading spinner when data is loading */}
      {status === 'loading' && <LoadingPage />}

      {/* Popup component for showing alerts/notifications */}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />

      {/* Header section with title and search bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="questions-heading mb-0">Questions Management</h2>
        <div className="position-relative" style={{ width: "250px" }}>
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
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>
      </div>

      {/* Form component for adding/editing questions */}
      <QuestionsForm
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />

      {/* List component displaying all questions */}
      <QuestionsList
        questions={filteredQuestions}
        loading={status === 'loading'}
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />
    </div>
  );
};

export default Questions;