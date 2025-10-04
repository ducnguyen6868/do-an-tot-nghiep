import { useState } from 'react';
import '../css/Footer.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email.trim()) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="footer-container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3 className="newsletter-title">Subscribe to Our Newsletter</h3>
              <p className="newsletter-desc">
                Get exclusive offers, new arrivals, and luxury watch news delivered to your inbox.
              </p>
            </div>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="newsletter-input"
              />
              <button onClick={handleSubscribe} className="newsletter-btn">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-company">
              <div className="footer-logo">
                <div className="logo-icon">⌚</div>
                <div>
                  <div className="logo-title">TIMEPIECE</div>
                  <div className="logo-subtitle">LUXURY WATCHES</div>
                </div>
              </div>
              <p className="company-desc">
                Your premier destination for luxury watches. We bring together the finest timepieces from around the world, offering exceptional quality and timeless elegance.
              </p>
              <div className="social-icons">
                <Link to="#" className="social-icon">
                  <Icon icon="skill-icons:gmail-light" width="256" height="256" />
                </Link>
                <Link to="#" className="social-icon">
                  <Icon icon="logos:youtube-icon" width="256" height="180" />
                </Link>
                <Link to="#" className="social-icon">
                  <Icon icon="logos:messenger" width="256" height="256" />
                </Link>
                <Link to="#" className="social-icon">
                  <Icon icon="logos:tiktok-icon" width="256" height="290" />
                </Link>
                <Link to="#" className="social-icon">
                  <Icon icon="fa7-brands:square-x-twitter" width="448" height="512" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="#">About Us</Link></li>
                <li><Link to="#">Our Story</Link></li>
                <li><Link to="#">Careers</Link></li>
                <li><Link to="#">Press & Media</Link></li>
                <li><Link to="#">Blog</Link></li>
                <li><Link to="#">Testimonials</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-column">
              <h4 className="footer-heading">Customer Service</h4>
              <ul className="footer-links">
                <li><Link to="#">Contact Us</Link></li>
                <li><Link to="#">Shipping Info</Link></li>
                <li><Link to="#">Returns & Exchanges</Link></li>
                <li><Link to="#">Track Your Order</Link></li>
                <li><Link to="#">FAQ</Link></li>
                <li><Link to="#">Size Guide</Link></li>
              </ul>
            </div>

            {/* Shop */}
            <div className="footer-column">
              <h4 className="footer-heading">Shop</h4>
              <ul className="footer-links">
                <li><Link to="#">Men's Watches</Link></li>
                <li><Link to="#">Women's Watches</Link></li>
                <li><Link to="#">Luxury Collection</Link></li>
                <li><Link to="#">New Arrivals</Link></li>
                <li><Link to="#">Best Sellers</Link></li>
                <li><Link to="#">Sale Items</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>



      {/* Bottom Footer */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            <p className="copyright">© 2025 Timepiece Collection. All rights reserved.</p>
            <div className="bottom-links">
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Service</Link>
              <Link to="#">Cookie Policy</Link>
              <Link to="#">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="back-to-top"
        aria-label="Back to top"
      >
        <Icon icon="marketeq:top-circle" width="50" height="50" />
      </button>
    </footer>
  )
}