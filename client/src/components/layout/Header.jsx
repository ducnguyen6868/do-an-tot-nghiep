import { useState, useEffect } from 'react';
import '../../styles/Header.css';
import { Link , useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import ThemToggle from '../comon/ThemeToggle';
import categoryApi from '../../api/categoryApi';

export default function Header() {
  //Get info User
  const { infoUser, getInfoUser } = useContext(UserContext);

  const [category, setCategory] = useState([]);

  const [keyword, setKeyword] = useState(null);

  const [isLogged, setIsLogged] = useState(false);
  
  const navigate= useNavigate();
  //Check login
  useEffect(() => {
    getInfoUser();
  }, []);

  useEffect(() => {
    if (infoUser && infoUser.name !== '') {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [infoUser]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const reponse = await categoryApi.category();
        setCategory(reponse.category);
      } catch (err) {
        toast.error(err.reponse?.data?.message || err.message);
      }
    }
    getCategory();
  }, []);

  const handleSearch = () => {
    if (keyword && keyword.trim() !== "") {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
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
                <span>
                  <Icon icon="noto:telephone" width="22" height="22" />
                </span>
                <span>1-800-WATCHES</span>
              </div>
              <div className="contact-item">
                <span>
                  <Icon icon="noto:love-letter" width="24" height="24" />
                </span>
                <span>info@timepiece.com</span>
              </div>
              <div className="contact-item">
                <span>
                  <Icon icon="noto:world-map" width="24" height="24" />
                </span>
                <span>123 Luxury Ave, New York</span>
              </div>
            </div>
            <div className="header-links">
              <Link to="#">Track Order</Link>
              <Link to="#">Help</Link>
              <Link to="#">Store Locator</Link>
              <Link to="#">English ▼</Link>
              <Link to="#">USD $ ▼</Link>
            </div>
            <ThemToggle />
          </div>
        </div>

        {/* <!-- Main Header Content --> */}
        <div className="header-main">
          <div className="header-container">
            {/* <!-- Logo --> */}
            <Link to="/" className="logo" style={{ margin: '0' }}>
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
                <input type="text" className="search-input" value={keyword} onKeyDown={(e) => e.key === "Enter" && handleSearch()} onChange={(e) => setKeyword(e.target.value)} placeholder="Search for watches, brands, collections..." />
                <button className="search-btn" onClick={handleSearch}>
                  <Icon icon="noto:magnifying-glass-tilted-left" width="24" height="24" />
                </button>
              </div>
            </div>

            {/* <!-- Header Actions --> */}
            {isLogged ? (<div className="header-actions">
              <div className="header-action">
                <Link to="/profile">
                  <div className="action-icon avatar-wave"  >
                    <img src={`http://localhost:5000/` + infoUser.avatar} className="avatar-icon" alt="avatar" title="avatar" style={{
                      width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", objectPosition: "center"
                    }} />
                  </div>
                </Link>

                <div className="action-label">{infoUser.name}</div>
              </div>
              <div className="header-action">
                <Link to="#">
                  <div className="action-icon">
                    <Icon icon="noto:red-heart" width="40" height="40" />
                  </div>
                  <div className="action-badge">3</div>
                </Link>
                <div className="action-label">Wishlist</div>
              </div>
              <div className="header-action">
                <Link to="#">
                  <div className="action-icon">
                    <Icon icon="noto:shopping-cart" width="40" height="40" />
                  </div>
                  <div className="action-badge">2</div>
                </Link>
                <div className="action-label">Cart</div>
              </div>
            </div>
            ) : (
              <div className="header-actions">
                <Link to='login'>
                  <div className="header-action">
                    <div className="action-icon">
                      <Icon icon="noto:bust-in-silhouette" width="32" height="32" />
                    </div>
                    <div className="action-label">Account</div>
                  </div>
                </Link>
                <div className="header-action">
                  <div className="action-icon">
                    <Icon icon="noto:red-heart" width="32" height="32" />
                  </div>
                  <div className="action-badge">3</div>
                  <div className="action-label">Wishlist</div>
                </div>
                <div className="header-action">
                  <div className="action-icon">
                    <Icon icon="noto:shopping-cart" width="32" height="32" />
                  </div>
                  <div className="action-badge">2</div>
                  <div className="action-label">Cart</div>
                </div>
              </div>)}


          </div>
        </div>

        {/* <!-- Navigation --> */}
        <nav className="main-nav">
          <div className="nav-container">
            <div className="category-dropdown">
              <span className="category-icon">☰</span>
              <span className="category-text">ALL CATEGORIES</span>
              <span>▼</span>
              <ul className='dropdown-menu'>
                {category.map(cate =>
                  <li key={cate._id} className='dropdown-item' >{cate.name}</li>
                )}

              </ul>
            </div>

            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-text">Men's Watches</span>
                  <span>▼</span>
                </Link>
                <div className="dropdown-menu">
                  <Link to="/product-detail" className="dropdown-item">Luxury Collection</Link>
                  <Link to="#" className="dropdown-item">Sport Watches</Link>
                  <Link to="#" className="dropdown-item">Dress Watches</Link>
                  <Link to="#" className="dropdown-item">Smart Watches</Link>
                </div>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-text">Women's Watches</span>
                  <span>▼</span>
                </Link>
                <div className="dropdown-menu">
                  <Link to="#" className="dropdown-item">Elegant Collection</Link>
                  <Link to="#" className="dropdown-item">Fashion Watches</Link>
                  <Link to="#" className="dropdown-item">Jewelry Watches</Link>
                </div>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-text">Brands</span>
                  <span>▼</span>
                </Link>
                <div className="dropdown-menu">
                  <Link to="#" className="dropdown-item">Rolex</Link>
                  <Link to="#" className="dropdown-item">Omega</Link>
                  <Link to="#" className="dropdown-item">Tag Heuer</Link>
                  <Link to="#" className="dropdown-item">Cartier</Link>
                </div>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-text">New Arrivals</span>
                  <span className="badge">Hot</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-text">About</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-text">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>

  );
}