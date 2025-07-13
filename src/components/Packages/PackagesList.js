import React, { useState } from 'react';
import { FaEdit, FaTrash, FaGlobe, FaChevronDown, FaChevronUp, FaCheck, FaTimes } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCurrentPackage, savePackage, savePackageTranslation, fetchPackages } from '../../slices/packagesSlice';
import TranslationModal from './TranslationModal';
import PopUp from '../shared/popup/PopUp';

const PackagesList = ({ packages, loading, setPopupMessage, setPopupType, setShowPopup }) => {
    const dispatch = useDispatch();
    const [showTranslationModal, setShowTranslationModal] = useState(false); // State for translation modal visibility
    const [currentTranslation, setCurrentTranslation] = useState(null); // State for current translation being edited
    const [expandedRows, setExpandedRows] = useState([]); // State for expanded rows (translations)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation popup
    const [packageToDelete, setPackageToDelete] = useState(null); // State for package to be deleted
    const [showTranslationDeleteConfirm, setShowTranslationDeleteConfirm] = useState(false); // State for translation delete confirmation popup
    const [translationToDelete, setTranslationToDelete] = useState(null); // State for translation to be deleted

    // Handle editing a package
    const handleEdit = async (pkg) => {
        try {
            dispatch(setCurrentPackage(pkg));
            dispatch(fetchPackages());
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to edit package';
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
    };

    // Handle deleting a package
    const handleDeleteClick = (pkg) => {
        setPackageToDelete(pkg);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteConfirm(false);
        try {
            const result = await dispatch(savePackage({ ...packageToDelete, active: false })).unwrap();
            dispatch(fetchPackages());
            setPopupMessage('Package deleted successfully');
            setPopupType('success');
            setShowPopup(true);
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to delete package';
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
        setPackageToDelete(null);
    };

    // Handle adding a translation
    const handleAddTranslation = (pkg) => {
        setCurrentTranslation({
            id: 0,
            package_id: pkg.id,
            lang_code: 'en',
            package_name: '',
            package_desc: '',
            package_details: '',
            delete: false
        });
        setShowTranslationModal(true);
    };

    // Handle deleting a translation
    const handleDeleteTranslationClick = (translation) => {
        setTranslationToDelete(translation);
        setShowTranslationDeleteConfirm(true);
    };

    const handleDeleteTranslationConfirm = async () => {
        setShowTranslationDeleteConfirm(false);
        try {
            const result = await dispatch(savePackageTranslation({ ...translationToDelete, delete: true })).unwrap();
            dispatch(fetchPackages());
            setPopupMessage('Translation deleted successfully');
            setPopupType('success');
            setShowPopup(true);
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to delete Translation';
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
        setTranslationToDelete(null);
    };

    // Toggle row expansion for translations
    const toggleRow = (id) => {
        const currentExpandedRows = [...expandedRows];
        const isRowExpanded = currentExpandedRows.includes(id);
        setExpandedRows(isRowExpanded ? currentExpandedRows.filter(rowId => rowId !== id) : [...currentExpandedRows, id]);
    };

    // Render translation header row
    const renderTranslationHeader = () => {
        return (
            <tr className="translation-header">
                <td colSpan="5">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex" style={{ width: '85%' }}>
                            <div style={{ width: '15%' }}><strong>Language</strong></div>
                            <div style={{ width: '25%' }}><strong>Name</strong></div>
                            <div style={{ width: '25%' }}><strong>Description</strong></div>
                            <div style={{ width: '35%' }}><strong>Details</strong></div>
                        </div>
                        <div><strong>Actions</strong></div>
                    </div>
                </td>
            </tr>
        );
    };

    // Render translation row
    const renderTranslationRow = (translation) => {
        return (
            <tr key={`translation-${translation.id}`} className="translation-row">
                <td colSpan="5">
                    <div className="d-flex justify-content-between align-items-center">
                        <div style={{ width: '85%', display: 'flex' }}>
                            <div style={{ width: '15%' }}>{translation.lang_code}</div>
                            <div style={{ width: '25%' }}>{translation.package_name}</div>
                            <div style={{ width: '25%' }}>{translation.package_desc}</div>
                            <div style={{ width: '35%' }}>{translation.package_details}</div>
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
                            <th>Recommended</th>
                            <th>Custom</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(pkg => (
                            <React.Fragment key={pkg.id}>
                                <tr className={!pkg.active ? 'inactive-row' : ''}>
                                    <td>
                                        {pkg.package_translations?.length > 0 && (
                                            <button
                                                className="expand-button me-3"
                                                onClick={() => toggleRow(pkg.id)}
                                            >
                                                {expandedRows.includes(pkg.id) ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                        )}
                                        {pkg.package_code}
                                    </td>
                                    <td>{pkg.default_name}</td>
                                    <td>
                                        {pkg.is_recommend ? (
                                            <FaCheck className="text-success" />
                                        ) : (
                                            <FaTimes className="text-danger" />
                                        )}
                                    </td>
                                    <td>
                                        {pkg.is_custom ? (
                                            <FaCheck className="text-success" />
                                        ) : (
                                            <FaTimes className="text-danger" />
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex">
                                            <button
                                                className="btn btn-sm btn-info me-2 green-btn"
                                                onClick={() => handleAddTranslation(pkg)}
                                                title="Add Translation"
                                            >
                                                <FaGlobe />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-warning me-2 yellow-btn"
                                                onClick={() => handleEdit(pkg)}
                                                title="Edit"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteClick(pkg)}
                                                title="Delete"
                                                disabled={!pkg.active}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedRows.includes(pkg.id) && pkg.package_translations?.length > 0 && (
                                    <>
                                        {renderTranslationHeader()}
                                        {pkg.package_translations?.map(translation => renderTranslationRow(translation))}
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

            {/* Package Delete Confirmation Popup */}
            <PopUp
                show={showDeleteConfirm}
                closeAlert={() => setShowDeleteConfirm(false)}
                confirmAction={handleDeleteConfirm}
                msg="Are you sure you want to delete this package?"
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

export default PackagesList;