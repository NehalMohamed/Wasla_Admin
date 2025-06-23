// PricingPage.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPricingData,
  savePricingPackage,
  savePackageFeatures,
  fetchPackageFeatures,
  fetchServices,
  clearError,
} from "../slices/pricingSlice";
import PricingForm from "../components/Pricing/PricingForm";
import PricingTable from "../components/Pricing/PricingTable";
import FeaturesModal from "../components/Pricing/FeaturesModal";
import SideMenu from "../components/Navbar/SideMenu";
import PopUp from "../components/shared/popup/PopUp";
import LoadingPage from "../components/Loader/LoadingPage";
import "../components/Pricing/Pricing.scss";
import { FaSearch } from "react-icons/fa";

const PricingPage = () => {
  const dispatch = useDispatch();
  const {
    data: pricingData,
    services,
    loading,
    error,
    featuresLoading,
    featuresError,
  } = useSelector((state) => state.pricing);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");
  const [currentPackageIndex, setCurrentPackageIndex] = useState(null);
  const [currentPackageFeatures, setCurrentPackageFeatures] = useState([]);
  const [currentPackageId, setCurrentPackageId] = useState(null);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Form data state
  const [formData, setFormData] = useState({
    service_id: "",
    package_name: "",
    package_code: "",
    package_desc: "",
    package_price: "",
    package_sale_price: "",
    order: 0,
    lang_code: "en",
    curr_code: "USD",
    is_recommend: false,
    is_custom: false,
    service_code: "",
  });
  const [editId, setEditId] = useState(null);

  // Services, languages, currencies
  // const services = [
  //     { service_id: 1, service_Name: 'Web Application' },
  //     { service_id: 2, service_Name: 'Marketing' },
  //     { service_id: 5, service_Name: 'Branding' }
  // ];
  const languages = [
    { code: "en", name: "English" },
    { code: "de", name: "German" },
    { code: "ar", name: "Arabic" },
  ];
  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "AED", symbol: "AED" },
    { code: "EGP", symbol: "EGP" },
  ];

  useEffect(() => {
    dispatch(fetchServices({ parent: 0, active: true, lang: "en" }));
  }, [dispatch]);
  // Fetch pricing data on component mount
  useEffect(() => {
    dispatch(fetchPricingData({ lang: "all", curr_code: "all" }));
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setPopupMessage(error);
      setPopupType("error");
      setShowPopup(true);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (featuresError) {
      setPopupMessage(featuresError);
      setPopupType("error");
      setShowPopup(true);
      dispatch(clearError());
    }
  }, [featuresError, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "service_id") {
      const selectedService = services.find((s) => s.productId === value);
      setFormData({
        ...formData,
        [name]: value,
        service_code: selectedService?.service_code || "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const packageData = {
      package_id: editId || 0,
      package_name: formData.package_name,
      package_code: formData.package_code,
      package_desc: formData.package_desc,
      package_details: "",
      package_sale_price: parseFloat(formData.package_sale_price),
      package_price: parseFloat(formData.package_price),
      start_date: null,
      end_date: null,
      lang_code: formData.lang_code,
      active: true,
      order: formData.order,
      curr_code: formData.curr_code,
      discount_amount: 0,
      discount_type: 0,
      service_id: formData.service_id,
      is_recommend: formData.is_recommend,
      is_custom: formData.is_custom,
      service_code: formData.service_code,
    };

    try {
      const resultAction = await dispatch(savePricingPackage(packageData));
      if (savePricingPackage.fulfilled.match(resultAction)) {
        setPopupMessage(
          editId
            ? "Package updated successfully!"
            : "Package added successfully!"
        );
        setPopupType("success");
        setShowPopup(true);

        // Reset form
        setFormData({
          service_id: "",
          package_name: "",
          package_code: "",
          package_desc: "",
          package_price: "",
          package_sale_price: "",
          order: 0,
          lang_code: "en",
          curr_code: "USD",
          is_recommend: false,
          is_custom: false,
          service_code: "",
        });
        setEditId(null);

        // Refresh data
        dispatch(fetchPricingData({ lang: "all", curr_code: "all" }));
      }
    } catch (err) {
      // Error handled by Redux slice
    }
  };

  const handleDeletePackage = async (id) => {
    const packageToDelete = pricingData.find((item) => item.package_id === id);
    if (!packageToDelete) return;

    const packageData = {
      ...packageToDelete,
      active: false,
    };

    try {
      const resultAction = await dispatch(savePricingPackage(packageData));
      if (savePricingPackage.fulfilled.match(resultAction)) {
        setPopupMessage("Package deactivated successfully!");
        setPopupType("success");
        setShowPopup(true);

        // Refresh data
        dispatch(fetchPricingData({ lang: "all", curr_code: "all" }));
      }
    } catch (err) {
      // Error handled by Redux slice
    }
  };

  const handleEditPackage = (id) => {
    const packageToEdit = pricingData.find((item) => item.package_id === id);
    if (packageToEdit) {
      setFormData({
        service_id: packageToEdit.service_id,
        package_name: packageToEdit.package_name,
        package_code: packageToEdit.package_code || "",
        package_desc: packageToEdit.package_desc,
        package_price: packageToEdit.package_price,
        package_sale_price: packageToEdit.package_sale_price,
        order: packageToEdit.order,
        lang_code: packageToEdit.lang_code,
        curr_code: packageToEdit.curr_code,
        is_recommend: packageToEdit.is_recommend || false,
        is_custom: packageToEdit.is_custom || false,
        service_code: packageToEdit.service_code || "",
      });
      setEditId(id);
    }
  };

  const handleOpenFeaturesModal = async (packageId) => {
    setCurrentPackageId(packageId);
    const packageItem = pricingData.find((pkg) => pkg.package_id === packageId);

    if (!packageItem) return;

    try {
      const resultAction = await dispatch(
        fetchPackageFeatures({
          package_id: packageId,
          lang_code: packageItem.lang_code,
        })
      );

      if (fetchPackageFeatures.fulfilled.match(resultAction)) {
        console.log(resultAction);
        setCurrentPackageFeatures(resultAction.payload.features || []);
        setShowFeaturesModal(true);
      }
    } catch (err) {
      // Error will be handled by the Redux slice
    }
  };
  const handleAddFeature = async (feature) => {
    if (!feature || !currentPackageId) return;

    const packageItem = pricingData.find(
      (pkg) => pkg.package_id === currentPackageId
    );
    if (!packageItem) return;

    try {
      // 1. Save the new feature
      const saveResult = await dispatch(
        savePackageFeatures({
          id: 0,
          package_id: currentPackageId,
          feature: feature,
          lang_code: packageItem.lang_code,
          active: true,
        })
      );

      if (savePackageFeatures.fulfilled.match(saveResult)) {
        setPopupMessage("Feature added successfully!");
        setPopupType("success");
        setShowPopup(true);

        // 2. Fetch the updated features list
        const refreshResult = await dispatch(
          fetchPackageFeatures({
            package_id: currentPackageId,
            lang_code: packageItem.lang_code,
          })
        );

        if (fetchPackageFeatures.fulfilled.match(refreshResult)) {
          setCurrentPackageFeatures(refreshResult.payload.features || []);
        }
      }
    } catch (err) {
      // Error handled by Redux slice
    }
  };

  const handleDeleteFeature = async (featureIndex) => {
    if (!currentPackageId) return;

    const packageItem = pricingData.find(
      (pkg) => pkg.package_id === currentPackageId
    );
    if (!packageItem) return;

    const featureId = currentPackageFeatures[featureIndex].id;

    try {
      // 1. Delete the feature
      const deleteResult = await dispatch(
        savePackageFeatures({
          id: featureId,
          package_id: currentPackageId,
          feature: currentPackageFeatures[featureIndex].feature_name,
          lang_code: packageItem.lang_code,
          active: false,
        })
      );

      if (savePackageFeatures.fulfilled.match(deleteResult)) {
        setPopupMessage("Feature deleted successfully!");
        setPopupType("success");
        setShowPopup(true);

        // 2. Fetch the updated features list
        const refreshResult = await dispatch(
          fetchPackageFeatures({
            package_id: currentPackageId,
            lang_code: packageItem.lang_code,
          })
        );

        if (fetchPackageFeatures.fulfilled.match(refreshResult)) {
          setCurrentPackageFeatures(refreshResult.payload.features || []);
        }
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
      <SideMenu onToggle={setMenuExpanded} />
      <main
        className={`main-content ${
          menuExpanded ? "menu-expanded" : "menu-collapsed"
        }`}
      >
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
          languages={languages}
          currencies={currencies}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          editId={editId}
        />

        <PricingTable
          pricingData={[...pricingData]
            .sort((a, b) => parseInt(a.order) - parseInt(b.order))
            .filter((item) =>
              item.service_name.toLowerCase().includes(searchTerm.toLowerCase())
            )}
          languages={languages}
          loading={loading}
          error={error}
          onDeletePackage={handleDeletePackage}
          onEditPackage={handleEditPackage}
          onOpenFeaturesModal={handleOpenFeaturesModal}
        />

        {showFeaturesModal && currentPackageId && (
          <FeaturesModal
            show={showFeaturesModal}
            onHide={() => setShowFeaturesModal(false)}
            packageName={
              pricingData.find((pkg) => pkg.package_id === currentPackageId)
                ?.package_name
            }
            features={currentPackageFeatures}
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
