import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="playheaven-footer">
      <div className="container">
        <div className="row">
            
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="playheaven-footer-brand">
              <img src="public/assets/play_haven_logo_small.svg" alt="Play Haven Logo" className="playheaven-footer-logo" />
              <p className="playheaven-footer-description">
                Your one-stop destination for discovering, buying and playing the best games. Join millions of gamers worldwide.
              </p>
              <div className="playheaven-social-links">
                <a href="#" className="playheaven-social-link">
                  <FaFacebookF />
                </a>
                <a href="#" className="playheaven-social-link">
                  <FaTwitter />
                </a>
                <a href="#" className="playheaven-social-link">
                  <FaInstagram />
                </a>
                <a href="#" className="playheaven-social-link">
                  <FaYoutube />
                </a>
                <a href="#" className="playheaven-social-link">
                  <FaDiscord />
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="playheaven-footer-title">Quick Links</h5>
            <ul className="playheaven-footer-links">
              <li><Link to="/store">Store</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="playheaven-footer-title">Help & Support</h5>
            <ul className="playheaven-footer-links">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Support Center</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Refund Policy</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="playheaven-footer-title">Contact Us</h5>
            <div className="playheaven-contact-info">
              <p>
                <i className="fas fa-envelope"></i>
                support@playheaven.com
              </p>
              <p>
                <i className="fas fa-phone"></i>
                +1 (555) 123-4567
              </p>
            </div>
            
            <div className="playheaven-newsletter">
              <h6 className="playheaven-newsletter-title">Subscribe to our newsletter</h6>
              <div className="playheaven-newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="playheaven-newsletter-input"
                />
                <button className="playheaven-newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="playheaven-footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="playheaven-copyright">
                © {new Date().getFullYear()} Play Haven. All rights reserved.
              </p>
            </div>
            <div className="col-md-6">
              <div className="playheaven-footer-bottom-links">
                <a href="#">Cookie Settings</a>
                <a href="#">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;