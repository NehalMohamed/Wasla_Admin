import React from 'react';
import { Modal, Spinner, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveTranslation, fetchServices } from '../../slices/servicesSlice';

// Modal component for adding/editing service translations
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
    // Get translation status from Redux store
    const { translationStatus } = useSelector(state => state.services);

    // Handle translation form submission
    const handleTranslationSubmit = async (e) => {
        e.preventDefault();
        try {
            // Save translation to backend
            const result = await dispatch(saveTranslation(currentTranslation)).unwrap();
            // Refresh services list
            dispatch(fetchServices())
            setShow(false);
            // Show success message
            setPopupMessage(currentTranslation.id ? 'Translation updated successfully' : 'Translation added successfully');
            setPopupType('success');
            setShowPopup(true);
        } catch (error) {
           const errorMessage = typeof error === 'string' ? error : 
                            error.message || 'Failed to save service';
                    error.toString();

            setPopupMessage(errorMessage);
            setPopupType('error');
            setShowPopup(true);
        }
    };

    // Handle input changes in translation form
    const handleTranslationChange = (e) => {
        const { name, value } = e.target;
        setCurrentTranslation(prev => ({
            ...prev,
            [name]: value
        }));
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
                        {/* Language selection dropdown */}
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

                        {/* Translated service name input */}
                        <Form.Group className="mb-3" controlId="serviceName">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="productname"
                                value={currentTranslation.productname}
                                onChange={handleTranslationChange}
                                required
                            />
                        </Form.Group>

                        {/* Translated service description textarea */}
                        <Form.Group className="mb-3" controlId="serviceDescription">
                            <Form.Label>Service Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="product_desc"
                                value={currentTranslation.product_desc}
                                onChange={handleTranslationChange}
                            />
                        </Form.Group>

                        {/* Submit button */}
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