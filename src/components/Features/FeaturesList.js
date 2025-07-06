import React, { useState } from 'react';
import { FaEdit, FaTrash, FaGlobe, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCurrentFeature, saveFeature, saveFeatureTranslation, fetchFeatures } from '../../slices/featuresSlice';
import FeatureTranslationModal from './FeatureTranslationModal';
import PopUp from '../shared/popup/PopUp';

const FeaturesList = ({ features, loading, setPopupMessage, setPopupType, setShowPopup }) => {
    const dispatch = useDispatch();
    const [showTranslationModal, setShowTranslationModal] = useState(false);
    const [currentTranslation, setCurrentTranslation] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState(null);
    const [showTranslationDeleteConfirm, setShowTranslationDeleteConfirm] = useState(false);
    const [translationToDelete, setTranslationToDelete] = useState(null);

    const handleEdit = async (feature) => {
        try {
            dispatch(setCurrentFeature(feature))
            dispatch(fetchFeatures());
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : 
                            error.message || 'Failed to edit feature';
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
    };

     const handleDeleteClick = (feature) => {
        setFeatureToDelete(feature);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteConfirm(false);
            try {
                const result = await dispatch(saveFeature({ 
                    ...featureToDelete, 
                    active: false,
                    delete: true 
                })).unwrap();
                dispatch(fetchFeatures());
                setPopupMessage('Feature deleted successfully');
                setPopupType('success');
                setShowPopup(true);
            } catch (error) {
                const errorMessage = typeof error === 'string' ? error : 
                            error.message || 'Failed to delete feature';
                setPopupMessage(errorMessage);
                setPopupType('error');
                setShowPopup(true);
            }
            setFeatureToDelete(null);
    };

    const handleAddTranslation = (feature) => {
        setCurrentTranslation({
            id: 0,
            feature_id: feature.feature_id,
            lang_code: 'en',
            feature_name: '',
            feature_description: '',
            delete: false
        });
        setShowTranslationModal(true);
    };

    const handleDeleteTranslationClick = (translation) => {
        setTranslationToDelete(translation);
        setShowTranslationDeleteConfirm(true);
    };

   const handleDeleteTranslationConfirm = async () => {
    setShowTranslationDeleteConfirm(false);
    try {
        const result = await dispatch(saveFeatureTranslation({ 
            ...translationToDelete, 
            delete: true 
        })).unwrap();
        dispatch(fetchFeatures());
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

    const toggleRow = (id) => {
        const currentExpandedRows = [...expandedRows];
        const isRowExpanded = currentExpandedRows.includes(id);

        if (isRowExpanded) {
            setExpandedRows(currentExpandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...currentExpandedRows, id]);
        }
    };

    const renderTranslationHeader = () => {
        return (
            <tr className="translation-header">
                <td colSpan="3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex" style={{ width: '85%' }}>
                            <div style={{ width: '25%' }}><strong>Language</strong></div>
                            <div style={{ width: '35%' }}><strong>Name</strong></div>
                            <div style={{ width: '40%' }}><strong>Description</strong></div>
                        </div>
                        <div><strong>Actions</strong></div>
                    </div>
                </td>
            </tr>
        );
    };

    const renderTranslationRow = (translation) => {
        return (
            <tr key={`translation-${translation.id}`} className="translation-row">
                <td colSpan="3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div style={{ width: '85%', display: 'flex' }}>
                            <div style={{ width: '25%' }}>{translation.lang_code}</div>
                            <div style={{ width: '35%' }}>{translation.feature_name}</div>
                            <div style={{ width: '40%' }}>{translation.feature_description}</div>
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

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

    return (
        <>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map(feature => (
                            <React.Fragment key={feature.feature_id}>
                                <tr>
                                    <td>
                                        {feature.features_Translations?.length > 0 && (
                                            <button
                                                className="expand-button me-3"
                                                onClick={() => toggleRow(feature.feature_id)}
                                            >
                                                {expandedRows.includes(feature.feature_id) ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        )}
                                        {feature.feature_code}
                                    </td>
                                    <td>{feature.feature_default_name}</td>
                                    <td>
                                        <div className="d-flex">
                                            <button
                                                className="btn btn-sm btn-info me-2 green-btn"
                                                onClick={() => handleAddTranslation(feature)}
                                                title="Add Translation"
                                            >
                                                <FaGlobe />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-warning me-2 yellow-btn"
                                                onClick={() => handleEdit(feature)}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteClick(feature)}
                                                title="Delete"
                                                // disabled={!feature.active}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedRows.includes(feature.feature_id) && feature.features_Translations?.length > 0 && (
                                    <>
                                        {renderTranslationHeader()}
                                        {feature.features_Translations?.map(translation =>
                                            renderTranslationRow(translation)
                                        )}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <FeatureTranslationModal
                show={showTranslationModal}
                setShow={setShowTranslationModal}
                currentTranslation={currentTranslation}
                setCurrentTranslation={setCurrentTranslation}
                setPopupMessage={setPopupMessage}
                setPopupType={setPopupType}
                setShowPopup={setShowPopup}
            />

            {/* Feature Delete Confirmation Popup */}
            <PopUp
                show={showDeleteConfirm}
                closeAlert={() => setShowDeleteConfirm(false)}
                confirmAction={handleDeleteConfirm}
                msg="Are you sure you want to delete this feature?"
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

export default FeaturesList;