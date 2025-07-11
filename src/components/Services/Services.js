import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import { fetchServices } from '../../slices/servicesSlice';
import ServicesForm from './ServicesForm';
import ServicesList from './ServicesList';
import PopUp from '../shared/popup/PopUp';
import LoadingPage from '../Loader/LoadingPage';
import './Services.scss';

const Services = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.services);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('alert');

  useEffect(() => {
    const loadServices = async () => {
      try {
        await dispatch(fetchServices()).unwrap();
      } catch (error) {
        setPopupMessage('Failed to load services');
        setPopupType('error');
        setShowPopup(true);
      }
    };
    loadServices();
  }, [dispatch]);

  const filteredServices = items.filter(service =>
    service.service_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.default_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="services-container">
      {status === 'loading' && <LoadingPage />}

      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="services-heading mb-0">Services Management</h2>
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
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>
      </div>

      <ServicesForm
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />

      <ServicesList
        services={filteredServices}
        loading={status === 'loading'}
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />
    </div>
  );
};

export default Services;