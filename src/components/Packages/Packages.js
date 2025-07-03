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
  const { items , status, error } = useSelector(state => state.packages);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('alert');

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

  const filteredPackages = items.filter(pkg =>
    pkg.package_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.default_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="packages-container">
      {status === 'loading' && <LoadingPage />}

      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="packages-heading mb-0">Packages Management</h2>
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
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>
      </div>

      <PackagesForm
        setPopupMessage={setPopupMessage}
        setPopupType={setPopupType}
        setShowPopup={setShowPopup}
      />

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