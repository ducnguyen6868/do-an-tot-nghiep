import { useState, useEffect } from 'react';
import '../../styles/Header.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

export default function Header() {
  //Get info User
  const { infoUser ,getInfoUser } = useContext(UserContext);

  const [keyword , setKeyword ]= useState('');

  const [isLogged ,setIsLogged] = useState(false);
  //Check login
  useEffect(()=>{
    getInfoUser();
  },[]);
  
  useEffect(() => {
    if (infoUser && infoUser.name !== '') {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [infoUser]);

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
                <input type="text" className="search-input" value ={keyword} onChange={(e)=>setKeyword(e)}placeholder="Search for watches, brands, collections..." />
                <button className="search-btn">
                  <Icon icon="noto:magnifying-glass-tilted-left" width="24" height="24" />
                  <span style={{margin:"0px 5px"}}>Search</span>
                </button>
              </div>
            </div>

            {/* <!-- Header Actions --> */}
            {isLogged ? (<div className="header-actions">
              <div className="header-action">
                <Link to="/profile">
                  <div className="action-icon"  >
                    <img src={`http://localhost:5000/` + infoUser.avatar} alt="avatar" title="avatar" style={{
                      width: "40px", height: "40px", borderRadius:"50%",objectFit: "cover", objectPosition: "center"
                    }} />
                    <div className="avatar-ring1"></div>
                  </div>
                </Link>

                <div className="action-label">{infoUser.name}</div>
              </div>
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
            </div>

            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-icon">
                    <Icon icon="noto:house" width="28" height="28" />
                  </span>
                  <span className="nav-text">Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-icon">
                    <Icon icon="noto:watch" width="24" height="24" />
                  </span>
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
                  <span className="nav-icon">
                    <Icon icon="noto:gem-stone" width="24" height="24" />
                  </span>
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
                  <span className="nav-icon">
                    <Icon icon="noto:label" width="24" height="24" />
                  </span>
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
                  <span className="nav-icon">
                    <Icon icon="noto:glowing-star" width="24" height="24" />
                  </span>
                  <span className="nav-text">New Arrivals</span>
                  <span className="badge">Hot</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-icon">
                    <Icon icon="noto:bookmark-tabs" width="24" height="24" />
                  </span>
                  <span className="nav-text">About</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="#" className="nav-link">
                  <span className="nav-icon">
                    <Icon icon="noto:link" width="24" height="24" />
                  </span>
                  <span className="nav-text">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div style={{ height: '10px' }}></div>
      </header>
    </>

  );
}