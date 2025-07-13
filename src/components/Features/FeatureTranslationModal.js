import React from 'react';
import { Modal, Spinner, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveFeatureTranslation, fetchFeatures } from '../../slices/featuresSlice';

const FeatureTranslationModal = ({
    show,
    setShow,
    currentTranslation,
    setCurrentTranslation,
    setPopupMessage,
    setPopupType,
    setShowPopup
}) => {
    const dispatch = useDispatch();
    const { translationStatus } = useSelector(state => state.features); // Get translation status from Redux store

    // Handle translation submission
    const handleTranslationSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(saveFeatureTranslation(currentTranslation)).unwrap();
            dispatch(fetchFeatures());
            setShow(false);
            setPopupMessage(currentTranslation.id ? 'Translation updated successfully' : 'Translation added successfully');
            setPopupType('success');
            setShowPopup(true);
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : error.message || 'Failed to save feature translation';
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

                        <Form.Group className="mb-3" controlId="featureName">
                            <Form.Label>Feature Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="feature_name"
                                value={currentTranslation.feature_name}
                                onChange={handleTranslationChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="featureDescription">
                            <Form.Label>Feature Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="feature_description"
                                value={currentTranslation.feature_description}
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

export default FeatureTranslationModal;