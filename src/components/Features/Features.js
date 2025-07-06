import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import { fetchFeatures } from '../../slices/featuresSlice';
import FeaturesForm from './FeaturesForm';
import FeaturesList from './FeaturesList';
import PopUp from '../shared/popup/PopUp';
import LoadingPage from '../Loader/LoadingPage';
import './Features.scss';

const Features = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.features);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('alert');

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        await dispatch(fetchFeatures()).unwrap();
      } catch (error) {
        console.log(error)
        setPopupMessage('Failed to load features');
        setPopupType('error');
        setShowPopup(true);
      }
    };
    loadFeatures();
  }, [dispatch]);

  const filteredFeatures = items.filter(feature =>
    feature.feature_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.feature_default_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="features-container">
      {status === 'loading' && <LoadingPage />}

      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="features-heading mb-0">Features Management</h2>
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
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>
      </div>

      <FeaturesForm
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />

      <FeaturesList
        features={filteredFeatures}
        loading={status === 'loading'}
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />
    </div>
  );
};

export default Features;