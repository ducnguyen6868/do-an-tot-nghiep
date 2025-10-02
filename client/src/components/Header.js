import { useState, useEffect } from 'react';
import '../css/Header.css';
import AuthPage from './AuthPage';
import {Link} from 'react-router-dom';
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isHiddenForm, setIsHiddenForm] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="announcement-bar">
        <div className="announcement-text">
          🎉 <strong>SPECIAL OFFER:</strong> Get 25% OFF on all luxury watches! Use code: LUXURY25 | Free Shipping Worldwide ✈️
        </div>
      </div>

      {/* <!-- Main Header-- > */}
      <header className="main-header">
        {/* <!-- Top Header --> */}
        <div className="header-top">
          <div className="header-top-container">
            <div className="contact-info">
              <div className="contact-item">
                <span>📞</span>
                <span>1-800-WATCHES</span>
              </div>
              <div className="contact-item">
                <span>✉️</span>
                <span>info@timepiece.com</span>
              </div>
              <div className="contact-item">
                <span>📍</span>
                <span>123 Luxury Ave, New York</span>
              </div>
            </div>
            <div className="header-links">
              <a href="#">Track Order</a>
              <a href="#">Help</a>
              <a href="#">Store Locator</a>
              <a href="#">English ▼</a>
              <a href="#">USD $ ▼</a>
            </div>
          </div>
        </div>

        {/* <!-- Main Header Content --> */}
        <div className="header-main">
          <div className="header-container">
            {/* <!-- Logo --> */}
            <Link to="/" className="logo" style={{margin:'0'}}>
              <div className="logo-icon">⌚</div>
              <div className="logo-text">
                <div className="logo-title">TIMEPIECE</div>
                <div className="logo-subtitle">Luxury Watches</div>
              </div>
            </Link>

            {/* <!-- Mobile Menu Toggle --> */}
            <div className="mobile-menu-toggle">
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
              <span className="menu-bar"></span>
            </div>

            {/* <!-- Search Bar --> */}
            <div className="search-container">
              <div className="search-bar">
                <input type="text" className="search-input" placeholder="Search for watches, brands, collections..." />
                <button className="search-btn">🔍 Search</button>
              </div>
            </div>

            {/* <!-- Header Actions --> */}
            <div className="header-actions">
              <div onClick = {()=>setIsHiddenForm(false)} className="header-action">
                <div className="action-icon">👤</div>
                <div className="action-label">Account</div>
              </div>
              <div className="header-action">
                <div className="action-icon">❤️</div>
                <div className="action-badge">3</div>
                <div className="action-label">Wishlist</div>
              </div>
              <div className="header-action">
                <div className="action-icon">🛒</div>
                <div className="action-badge">2</div>
                <div className="action-label">Cart</div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Navigation --> */}
        <nav className="main-nav">
          <div className="nav-container">
            <div className="category-dropdown">
              <span className="category-icon">☰</span>
              <span className="category-text">ALL CATEGORIES</span>
              <span>▼</span>
            </div>

            <ul className="nav-menu">
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <span className="nav-icon">🏠</span>
                  <span className="nav-text">Home</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <span className="nav-icon">⌚</span>
                  <span className="nav-text">Men's Watches</span>
                  <span>▼</span>
                </a>
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">Luxury Collection</a>
                  <a href="#" className="dropdown-item">Sport Watches</a>
                  <a href="#" className="dropdown-item">Dress Watches</a>
                  <a href="#" className="dropdown-item">Smart Watches</a>
                </div>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <span className="nav-icon">💎</span>
                  <span className="nav-text">Women's Watches</span>
                  <span>▼</span>
                </a>
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">Elegant Collection</a>
                  <a href="#" className="dropdown-item">Fashion Watches</a>
                  <a href="#" className="dropdown-item">Jewelry Watches</a>
                </div>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <span className="nav-icon">🏷️</span>
                  <span className="nav-text">Brands</span>
                  <span>▼</span>
                </a>
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">Rolex</a>
                  <a href="#" className="dropdown-item">Omega</a>
                  <a href="#" className="dropdown-item">Tag Heuer</a>
                  <a href="#" className="dropdown-item">Cartier</a>
                </div>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <span className="nav-icon">✨</span>
                  <span className="nav-text">New Arrivals</span>
                  <span className="badge">Hot</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <span className="nav-icon">📝</span>
                  <span className="nav-text">About</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <span className="nav-icon">📞</span>
                  <span className ="nav-text">Contact</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div style={{ height: '10px' }}></div>
      </header>
      {!isHiddenForm && <AuthPage onClose={()=>setIsHiddenForm(true)} />}
    </>

  );
}