// PricingPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPricingData,
  savePricingPackage,
  savePackageFeatures,
  fetchPackageFeatures,
  clearError
} from '../redux/pricingSlice';
import PricingForm from '../components/Pricing/PricingForm';
import PricingTable from '../components/Pricing/PricingTable';
import FeaturesModal from '../components/Pricing/FeaturesModal';
import SideMenu from "../components/Navbar/SideMenu";
import PopUp from '../components/shared/popup/PopUp';
import LoadingPage from '../components/Loader/LoadingPage';
import '../components/Pricing/Pricing.scss';
import { FaSearch } from "react-icons/fa";

const PricingPage = () => {
  const dispatch = useDispatch();
  const {
    data: pricingData,
    loading,
    error,
    featuresLoading,
    featuresError
  } = useSelector(state => state.pricing);
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('alert');
  const [currentPackageIndex, setCurrentPackageIndex] = useState(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form data state
  const [formData, setFormData] = useState({
    service: '',
    packageName: '',
    packageDescription: '',
    oldPrice: '',
    currentPrice: '',
    language: 'en',
    currency: 'USD'
  });
  const [editId, setEditId] = useState(null);

  // Services, packages, languages, currencies (same as before)
  const services = ['Website Design', 'Marketing', 'Brand Identity'];
  const packages = ['Light', 'Core', 'Business', 'Business Elite'];
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic' }
  ];
  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'AED', symbol: 'AED' }
  ];

  // Fetch pricing data on component mount
  useEffect(() => {
    dispatch(fetchPricingData({ lang: 'en', curr_code: 'USD' }));
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setPopupMessage(error);
      setPopupType('error');
      setShowPopup(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (featuresError) {
      setPopupMessage(featuresError);
      setPopupType('error');
      setShowPopup(true);
      dispatch(clearError());
    }
  }, [featuresError, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const packageData = {
      package_id: editId || 0,
      package_name: formData.packageName,
      package_desc: formData.packageDescription,
      package_details: '',
      package_sale_price: parseFloat(formData.oldPrice),
      package_price: parseFloat(formData.currentPrice),
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      lang_code: formData.language,
      active: true,
      order: 0,
      curr_code: formData.currency,
      discount_amount: 0,
      discount_type: 0,
      service_id: services.indexOf(formData.service) + 1 // Assuming service_id is index + 1
    };

    try {
      const resultAction = await dispatch(savePricingPackage(packageData));
      if (savePricingPackage.fulfilled.match(resultAction)) {
        setPopupMessage(editId ? 'Package updated successfully!' : 'Package added successfully!');
        setPopupType('success');
        setShowPopup(true);
        
        // Reset form
        setFormData({
          service: '',
          packageName: '',
          packageDescription: '',
          oldPrice: '',
          currentPrice: '',
          language: 'en',
          currency: 'USD'
        });
        setEditId(null);
        
        // Refresh data
        dispatch(fetchPricingData({ lang: 'en', curr_code: 'USD' }));
      }
    } catch (err) {
      // Error handled by Redux slice
    }
  };

  const handleDeletePackage = async (id) => {
    // Implement delete functionality if API supports it
    // For now, just filter locally
    // setPricingData(pricingData.filter(item => item.id !== id));
  };

  const handleEditPackage = (id) => {
    const packageToEdit = pricingData.find(item => item.id === id);
    if (packageToEdit) {
      setFormData({
        service: packageToEdit.service,
        packageName: packageToEdit.packageName,
        packageDescription: packageToEdit.packageDescription || '',
        oldPrice: packageToEdit.oldPrice || '',
        currentPrice: packageToEdit.currentPrice,
        language: packageToEdit.language,
        currency: packageToEdit.currency
      });
      setEditId(id);
    }
  };

  const handleOpenFeaturesModal = (index) => {
    setCurrentPackageIndex(index);
    setShowFeaturesModal(true);
    // Fetch features for this package if not already loaded
    if (!pricingData[index].features || pricingData[index].features.length === 0) {
      dispatch(fetchPackageFeatures({
        package_id: pricingData[index].id,
        lang_code: pricingData[index].language
      }));
    }
  };

  const handleAddFeature = async (feature) => {
    if (!feature || currentPackageIndex === null) return;
    
    const packageId = pricingData[currentPackageIndex].id;
    const langCode = pricingData[currentPackageIndex].language;
    
    try {
      const resultAction = await dispatch(savePackageFeatures({
        package_id: packageId,
        features: [...pricingData[currentPackageIndex].features, feature],
        lang_code: langCode
      }));
      
      if (savePackageFeatures.fulfilled.match(resultAction)) {
        setPopupMessage('Feature added successfully!');
        setPopupType('success');
        setShowPopup(true);
      }
    } catch (err) {
      // Error handled by Redux slice
    }
  };

  const handleDeleteFeature = async (featureIndex) => {
    if (currentPackageIndex === null) return;
    
    const packageId = pricingData[currentPackageIndex].id;
    const langCode = pricingData[currentPackageIndex].language;
    const updatedFeatures = [...pricingData[currentPackageIndex].features];
    updatedFeatures.splice(featureIndex, 1);
    
    try {
      const resultAction = await dispatch(savePackageFeatures({
        package_id: packageId,
        features: updatedFeatures,
        lang_code: langCode
      }));
      
      if (savePackageFeatures.fulfilled.match(resultAction)) {
        setPopupMessage('Feature deleted successfully!');
        setPopupType('success');
        setShowPopup(true);
      }
    } catch (err) {
      // Error handled by Redux slice
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="app-container">
      <SideMenu onToggle={setMenuExpanded}/>
      <main className={`main-content ${menuExpanded ? 'menu-expanded' : 'menu-collapsed'}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-4 page-title">Pricing Management</h2>
          <div className="mb-4 position-relative" style={{ width: "250px" }}>
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
              placeholder="Search By Service ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "30px" }}
            />
          </div>
        </div>
      
        <PricingForm
          services={services}
          packages={packages}
          languages={languages}
          currencies={currencies}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          editId={editId}
        />

        <PricingTable
          pricingData={pricingData.filter(item => 
            item.service.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          languages={languages}
          loading={loading}
          error={error}
          onDeletePackage={handleDeletePackage}
          onEditPackage={handleEditPackage}
          onOpenFeaturesModal={handleOpenFeaturesModal}
        />

        {showFeaturesModal && currentPackageIndex !== null && (
          <FeaturesModal
            show={showFeaturesModal}
            onHide={() => setShowFeaturesModal(false)}
            packageName={pricingData[currentPackageIndex]?.packageName}
            features={pricingData[currentPackageIndex]?.features || []}
            onAddFeature={handleAddFeature}
            onDeleteFeature={handleDeleteFeature}
          />
        )}

        <PopUp
          show={showPopup}
          closeAlert={() => setShowPopup(false)}
          msg={popupMessage}
          type={popupType}
          autoClose={3000}
        />
      </main>
    </div>
  );
};

export default PricingPage;