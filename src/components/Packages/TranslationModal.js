import React from 'react';
import { Modal, Spinner, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { savePackageTranslation, fetchPackages } from '../../slices/packagesSlice';

const TranslationModal = ({
    show,
    setShow,
    currentTranslation,
    setCurrentTranslation,
    setPopupMessage,
    setPopupType,
    setShowPopup
}) => {
    const dispatch = useDispatch();
    const { translationStatus } = useSelector(state => state.packages); // Get translation status from Redux store

    // Handle translation submission
    const handleTranslationSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(savePackageTranslation(currentTranslation)).unwrap();
            dispatch(fetchPackages());
            setShow(false);
            setPopupMessage(currentTranslation.id ? 'Translation updated successfully' : 'Translation added successfully');
            setPopupType('success');
            setShowPopup(true);
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to save package translation';
            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
    };

    // Handle translation input changes
    const handleTranslationChange = (e) => {
        const { name, value } = e.target;
        setCurrentTranslation(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {currentTranslation?.id ? 'Edit Translation' : 'Add Translation'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {currentTranslation && (
                    <Form onSubmit={handleTranslationSubmit}>
                        <Form.Group className="mb-3" controlId="langCode">
                            <Form.Label>Language</Form.Label>
                            <Form.Select
                                name="lang_code"
                                value={currentTranslation.lang_code}
                                onChange={handleTranslationChange}
                                required
                            >
                                <option value="en">EN-English</option>
                                <option value="ar">AR-Arabic</option>
                                <option value="de">DE-Dutch</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="packageName">
                            <Form.Label>Package Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="package_name"
                                value={currentTranslation.package_name}
                                onChange={handleTranslationChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="packageDescription">
                            <Form.Label>Package Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="package_desc"
                                value={currentTranslation.package_desc}
                                onChange={handleTranslationChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="packageDetails">
                            <Form.Label>Package Details</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="package_details"
                                value={currentTranslation.package_details}
                                onChange={handleTranslationChange}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={translationStatus === 'loading'}
                            >
                                {translationStatus === 'loading' ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default TranslationModal;