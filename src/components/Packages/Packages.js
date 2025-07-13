import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import { fetchPackages } from '../../slices/packagesSlice';
import PackagesForm from './PackagesForm';
import PackagesList from './PackagesList';
import PopUp from '../shared/popup/PopUp';
import LoadingPage from '../Loader/LoadingPage';
import './Packages.scss';

const Packages = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.packages); // Get packages data from Redux store
  const [searchTerm, setSearchTerm] = useState(''); // State for search functionality
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message
  const [popupType, setPopupType] = useState('alert'); // State for popup type (e.g., success, error)

  // Fetch packages data on component mount
  useEffect(() => {
    const loadPackages = async () => {
      try {
        await dispatch(fetchPackages()).unwrap();
      } catch (error) {
        setPopupMessage('Failed to load packages');
        setPopupType('error');
        setShowPopup(true);
      }
    };
    loadPackages();
  }, [dispatch]);

  // Filter packages based on search term
  const filteredPackages = items.filter(pkg =>
    pkg.package_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.default_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="packages-container">
      {status === 'loading' && <LoadingPage />} {/* Show loading spinner while data is being fetched */}

      {/* Popup component for displaying messages */}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />

      {/* Header section with search functionality */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="packages-heading mb-0">Packages Management</h2>
        <div className="position-relative" style={{ width: "250px" }}>
          <FaSearch className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
          <input
            type="text"
            className="form-control ps-6"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>
      </div>

      {/* PackagesForm component for adding/editing packages */}
      <PackagesForm
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />

      {/* PackagesList component to display the list of packages */}
      <PackagesList
        packages={filteredPackages}
        loading={status === 'loading'}
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />
    </div>
  );
};

export default Packages;