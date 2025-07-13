import React, { useState } from 'react';
import { FaEdit, FaTrash, FaGlobe, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCurrentQuestion, saveQuestion, saveQuestionTranslation, fetchQuestions } from '../../slices/questionsSlice';
import QuestionTranslationModal from './QuestionTranslationModal';
import PopUp from '../shared/popup/PopUp';

// Component for displaying the list of questions with actions
const QuestionsList = ({ questions, loading, setPopupMessage, setPopupType, setShowPopup }) => {
    const dispatch = useDispatch();
    // State for managing translations
    const [showTranslationModal, setShowTranslationModal] = useState(false);
    const [currentTranslation, setCurrentTranslation] = useState(null);
    // State for expandable rows
    const [expandedRows, setExpandedRows] = useState([]);
    // State for delete confirmations
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [showTranslationDeleteConfirm, setShowTranslationDeleteConfirm] = useState(false);
    const [translationToDelete, setTranslationToDelete] = useState(null);

    // Handle editing a question
    const handleEdit = async (question) => {
        try {
            dispatch(setCurrentQuestion(question))
            dispatch(fetchQuestions());
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : 
                            error.message || 'Failed to edit question';
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
    };

    // Handle delete click (shows confirmation)
    const handleDeleteClick = (question) => {
        setQuestionToDelete(question);
        setShowDeleteConfirm(true);
    };

    // Handle confirmed deletion
    const handleDeleteConfirm = async () => {
        setShowDeleteConfirm(false);
            try {
                const result = await dispatch(saveQuestion({ 
                    ...questionToDelete, 
                    active: false,
                    delete: true 
                })).unwrap();
                dispatch(fetchQuestions());
                setPopupMessage('Question deleted successfully');
                setPopupType('success');
                setShowPopup(true);
            } catch (error) {
                const errorMessage = typeof error === 'string' ? error : 
                            error.message || 'Failed to delete question';
                setPopupMessage(errorMessage);
                setPopupType('error');
                setShowPopup(true);
            }
            setQuestionToDelete(null);
    };

    // Handle adding a translation
    const handleAddTranslation = (question) => {
        setCurrentTranslation({
            id: 0,
            ques_id: question.ques_id,
            lang_code: 'en',
            ques_title: '',
            delete: false
        });
        setShowTranslationModal(true);
    };

    // Handle translation delete click (shows confirmation)
    const handleDeleteTranslationClick = (translation) => {
        setTranslationToDelete(translation);
        setShowTranslationDeleteConfirm(true);
    };

    // Handle confirmed translation deletion
    const handleDeleteTranslationConfirm = async () => {
        setShowTranslationDeleteConfirm(false);
        try {
            const result = await dispatch(saveQuestionTranslation({ 
                ...translationToDelete, 
                delete: true 
            })).unwrap();
            dispatch(fetchQuestions());
            setPopupMessage('Translation deleted successfully');
            setPopupType('success');
            setShowPopup(true);
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : 
                                error.message || 'Failed to delete Translation';
            
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
        setTranslationToDelete(null);
    };

    // Toggle row expansion (for showing translations)
    const toggleRow = (id) => {
        const currentExpandedRows = [...expandedRows];
        const isRowExpanded = currentExpandedRows.includes(id);

        if (isRowExpanded) {
            setExpandedRows(currentExpandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...currentExpandedRows, id]);
        }
    };

    // Render translation table header
    const renderTranslationHeader = () => {
        return (
            <tr className="translation-header">
                <td colSpan="4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex" style={{ width: '85%' }}>
                            <div style={{ width: '25%' }}><strong>Language</strong></div>
                            <div style={{ width: '75%' }}><strong>Question Title</strong></div>
                        </div>
                        <div><strong>Actions</strong></div>
                    </div>
                </td>
            </tr>
        );
    };

    // Render a single translation row
    const renderTranslationRow = (translation) => {
        return (
            <tr key={`translation-${translation.id}`} className="translation-row">
                <td colSpan="4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div style={{ width: '85%', display: 'flex' }}>
                            <div style={{ width: '25%' }}>{translation.lang_code}</div>
                            <div style={{ width: '75%' }}>{translation.ques_title}</div>
                        </div>
                        <div>
                            <button
                                className="btn btn-sm btn-warning me-2 yellow-btn"
                                onClick={() => {
                                    setCurrentTranslation(translation);
                                    setShowTranslationModal(true);
                                }}
                                title="Edit Translation"
                            >
                                <FaEdit size={12} />
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteTranslationClick(translation)}
                                title="Delete Translation"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    // Show loading spinner if data is loading
    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

    return (
        <>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Title</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map(question => (
                            <React.Fragment key={question.ques_id}>
                                <tr className={!question.active ? "inactive-row" : ""}>
                                    <td>{question.order}</td>
                                    <td>
                                        {/* Expand/collapse button for translations */}
                                        {question.questions?.length > 0 && (
                                            <button
                                                className="expand-button me-3"
                                                onClick={() => toggleRow(question.ques_id)}
                                            >
                                                {expandedRows.includes(question.ques_id) ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        )}
                                        {question.ques_title_default}
                                    </td>
                                    <td>
                                        <div className="d-flex">
                                            {/* Action buttons */}
                                            <button
                                                className="btn btn-sm btn-info me-2 green-btn"
                                                onClick={() => handleAddTranslation(question)}
                                                title="Add Translation"
                                            >
                                                <FaGlobe />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-warning me-2 yellow-btn"
                                                onClick={() => handleEdit(question)}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteClick(question)}
                                                title="Delete"
                                                disabled={!question.active}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Expanded translation rows */}
                                {expandedRows.includes(question.ques_id) && question.questions?.length > 0 && (
                                    <>
                                        {renderTranslationHeader()}
                                        {question.questions?.map(translation =>
                                            renderTranslationRow(translation)
                                        )}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Translation Modal */}
            <QuestionTranslationModal
                show={showTranslationModal}
                setShow={setShowTranslationModal}
                currentTranslation={currentTranslation}
                setCurrentTranslation={setCurrentTranslation}
                setPopupMessage={setPopupMessage}
                setPopupType={setPopupType}
                setShowPopup={setShowPopup}
            />

            {/* Question Delete Confirmation Popup */}
            <PopUp
                show={showDeleteConfirm}
                closeAlert={() => setShowDeleteConfirm(false)}
                confirmAction={handleDeleteConfirm}
                msg="Are you sure you want to delete this question?"
                type="confirm"
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Translation Delete Confirmation Popup */}
            <PopUp
                show={showTranslationDeleteConfirm}
                closeAlert={() => setShowTranslationDeleteConfirm(false)}
                confirmAction={handleDeleteTranslationConfirm}
                msg="Are you sure you want to delete this translation?"
                type="confirm"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
};

export default QuestionsList;