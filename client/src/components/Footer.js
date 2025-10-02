import { useState } from 'react';
import '../css/Footer.css';

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
                <a href="#" className="social-icon">📘</a>
                <a href="#" className="social-icon">📷</a>
                <a href="#" className="social-icon">🐦</a>
                <a href="#" className="social-icon">📺</a>
                <a href="#" className="social-icon">💼</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press & Media</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Testimonials</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-column">
              <h4 className="footer-heading">Customer Service</h4>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns & Exchanges</a></li>
                <li><a href="#">Track Your Order</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Size Guide</a></li>
              </ul>
            </div>

            {/* Shop */}
            <div className="footer-column">
              <h4 className="footer-heading">Shop</h4>
              <ul className="footer-links">
                <li><a href="#">Men's Watches</a></li>
                <li><a href="#">Women's Watches</a></li>
                <li><a href="#">Luxury Collection</a></li>
                <li><a href="#">New Arrivals</a></li>
                <li><a href="#">Best Sellers</a></li>
                <li><a href="#">Sale Items</a></li>
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
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
              <a href="#">Sitemap</a>
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
        ⬆️
      </button>
      </footer>
  )
}