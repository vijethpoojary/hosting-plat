import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed!');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">Rent<span>Hub</span></div>
            <p className="footer-tagline">The modern marketplace for renting anything — from cars to cameras, dresses to drills.</p>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4>Explore</h4>
            <div className="footer-links">
              <Link to="/">Browse All</Link>
              <Link to="/?category=cars">Cars</Link>
              <Link to="/?category=dresses">Dresses</Link>
              <Link to="/?category=electronics">Electronics</Link>
              <Link to="/?category=furniture">Furniture</Link>
            </div>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4>Company</h4>
            <div className="footer-links">
              <Link to="/register">List Your Item</Link>
              <Link to="/login">Sign In</Link>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4>Stay Updated</h4>
            <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
              Get new listings and rental tips in your inbox.
            </p>
            <form className="footer-newsletter" onSubmit={handleNewsletter}>
              <input
                type="email" placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} RentHub. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
