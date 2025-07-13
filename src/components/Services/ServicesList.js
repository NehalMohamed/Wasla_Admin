import React, { useState } from 'react';
import { FaEdit, FaTrash, FaGlobe, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCurrentService, saveService, saveTranslation, fetchServices } from '../../slices/servicesSlice';
import TranslationModal from './TranslationModal';
import PopUp from '../shared/popup/PopUp';

// Component for displaying the list of services with actions
const ServicesList = ({ services, loading, setPopupMessage, setPopupType, setShowPopup }) => {
    const dispatch = useDispatch();
    // State for managing translations
    const [showTranslationModal, setShowTranslationModal] = useState(false);
    const [currentTranslation, setCurrentTranslation] = useState(null);
    // State for expandable rows
    const [expandedRows, setExpandedRows] = useState([]);
    // State for delete confirmations
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [showTranslationDeleteConfirm, setShowTranslationDeleteConfirm] = useState(false);
    const [translationToDelete, setTranslationToDelete] = useState(null);

    // Handle editing a service
    const handleEdit = async (service) => {
        try {
            dispatch(setCurrentService(service))
            // Refresh the services data
            dispatch(fetchServices());
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : 
                            error.message || 'Failed to edit service';
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
    };

    // Handle delete click (shows confirmation)
    const handleDeleteClick = (service) => {
        setServiceToDelete(service);
        setShowDeleteConfirm(true);
    };

    // Handle confirmed deletion (soft delete by setting active to false)
    const handleDeleteConfirm = async () => {
        setShowDeleteConfirm(false);
            try {
                const result = await dispatch(saveService({ ...serviceToDelete, active: false })).unwrap();
                dispatch(fetchServices());
                setPopupMessage('Service deleted successfully');
                setPopupType('success');
                setShowPopup(true);
            } catch (error) {
                const errorMessage = typeof error === 'string' ? error : 
                            error.message || 'Failed to delete service';
                setPopupMessage(errorMessage);
                setPopupType('error');
                setShowPopup(true);
            }
            setServiceToDelete(null);
    };

    // Handle adding a translation
    const handleAddTranslation = (service) => {
        setCurrentTranslation({
            id: 0,
            service_id: service.id,
            lang_code: 'en',
            productname: '',
            product_desc: '',
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
            const result = await dispatch(saveTranslation({ ...translationToDelete, delete: true })).unwrap();
            dispatch(fetchServices());
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

    // Render a single translation row
    const renderTranslationRow = (translation) => {
        return (
            <tr key={`translation-${translation.id}`} className="translation-row">
                <td colSpan="3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div style={{ width: '85%', display: 'flex' }}>
                            <div style={{ width: '25%' }}>{translation.lang_code}</div>
                            <div style={{ width: '35%' }}>{translation.productname}</div>
                            <div style={{ width: '40%' }}>{translation.product_desc}</div>
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
                            <th>Code</th>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <React.Fragment key={service.id}>
                                <tr>
                                    <td>
                                        {/* Expand/collapse button for translations */}
                                        {service.service_translations?.length > 0 && (
                                            <button
                                                className="expand-button me-3"
                                                onClick={() => toggleRow(service.id)}
                                            >
                                                {expandedRows.includes(service.id) ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        )}
                                        {service.service_code}
                                    </td>
                                    <td>{service.default_name}</td>
                                    <td>
                                        <div className="d-flex">
                                            {/* Action buttons */}
                                            <button
                                                className="btn btn-sm btn-info me-2 green-btn"
                                                onClick={() => handleAddTranslation(service)}
                                                title="Add Translation"
                                            >
                                                <FaGlobe />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-warning me-2 yellow-btn"
                                                onClick={() => handleEdit(service)}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteClick(service)}
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {/* Expanded translation rows */}
                                {expandedRows.includes(service.id) && service.service_translations?.length > 0 && (
                                    <>
                                        {renderTranslationHeader()}
                                        {service.service_translations?.map(translation =>
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
            <TranslationModal
                show={showTranslationModal}
                setShow={setShowTranslationModal}
                currentTranslation={currentTranslation}
                setCurrentTranslation={setCurrentTranslation}
                setPopupMessage={setPopupMessage}
                setPopupType={setPopupType}
                setShowPopup={setShowPopup}
            />

            {/* Service Delete Confirmation Popup */}
            <PopUp
                show={showDeleteConfirm}
                closeAlert={() => setShowDeleteConfirm(false)}
                confirmAction={handleDeleteConfirm}
                msg="Are you sure you want to delete this service?"
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

export default ServicesList;