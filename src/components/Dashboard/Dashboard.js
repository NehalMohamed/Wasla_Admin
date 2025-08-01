import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaFileInvoice,
  FaSearch, 
  FaStar, 
  FaRegStar
} from 'react-icons/fa';
import {
  FiHome,
  FiHelpCircle,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiDollarSign,
  FiLayers,
  FiUsers,
} from "react-icons/fi";
import { IoLogoFirebase } from "react-icons/io5";
import {  } from "react-icons/fa";
import './Dashboard.scss';

const Dashboard = ({ userRole = 'admin' }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('dashboardFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dashboardFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Base menu items with access control
  const allMenuItems = [
    { 
      id: 'users',
      title: 'Users', 
      icon: <FiUsers size={24} />, 
      path: '/users',
      roles: ['admin', 'manager']
    },
    { 
      id: 'questions',
      title: 'Questions', 
      icon: <FiHelpCircle size={24} />, 
      path: '/questions',
      roles: ['admin', 'manager', 'editor']
    },
    { 
      id: 'features',
      title: 'Features', 
      icon: <FiLayers size={24} />, 
      path: '/features',
      roles: ['admin', 'manager', 'sales']
    },
    { 
      id: 'services',
      title: 'Services', 
      icon: <FiSettings size={24} />, 
      path: '/services',
      roles: ['admin', 'manager']
    },
    { 
      id: 'packages',
      title: 'Packages', 
      icon: <IoLogoFirebase size={24} />, 
      path: '/packages',
      roles: ['admin']
    },
    { 
      id: 'pricing',
      title: 'Pricing', 
      icon: <FiDollarSign size={24} />, 
      path: '/pricing',
      roles: ['admin', 'manager', 'analyst']
    },
    { 
      id: 'invoices',
      title: 'Invoices', 
      icon: <FaFileInvoice size={24} />, 
      path: '/invoices',
      roles: ['admin', 'manager', 'support']
    }
  ];

  // Filter menu items based on user role
  const authorizedMenuItems = allMenuItems.filter(item => 
    item.roles.includes(userRole)
  );

  // Toggle favorite status
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Filter menu items based on search term and favorites toggle
  const filteredMenuItems = authorizedMenuItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const isFavorite = favorites.includes(item.id);
    
    if (showFavoritesOnly) {
      return matchesSearch && isFavorite;
    }
    return matchesSearch;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {/* <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, {userRole}</p> */}
        
        <div className="dashboard-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <button 
            className={`favorites-toggle ${showFavoritesOnly ? 'active' : ''}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            {showFavoritesOnly ? 'Show All' : 'Show Favorites Only'}
          </button>
        </div>
      </header>
      
      {filteredMenuItems.length === 0 ? (
        <div className="no-results">
          {showFavoritesOnly 
            ? "You don't have any favorites yet. Click the star icon to add some!"
            : "No menu items match your search."}
        </div>
      ) : (
        <div className="dashboard-grid">
          {filteredMenuItems.map((item) => (
            <div 
              key={item.id} 
              className="dashboard-card"
              onClick={() => navigate(item.path)}
            >
              <div className="card-header">
                <div className="dashboard-card-icon">{item.icon}</div>
                <button 
                  className="favorite-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                >
                  {favorites.includes(item.id) ? (
                    <FaStar className="favorite-icon" />
                  ) : (
                    <FaRegStar className="favorite-icon" />
                  )}
                </button>
              </div>
              <h3 className="dashboard-card-title">{item.title}</h3>
              {favorites.includes(item.id) && (
                <div className="favorite-badge">Favorite</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;