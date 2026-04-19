import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaPlus, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Brand name */}
        <Link to="/" className="navbar-brand">
          Rent<span>Hub</span>
        </Link>

        {/* Center links */}
        <div className="navbar-center">
           <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Browse</NavLink>
          {user?.role === 'OWNER' && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
          )}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Right */}
        <div className="navbar-right">
          {!user ? (
            <>
              <NavLink to="/login" className="nav-link">Sign in</NavLink>
              <Link to="/register?role=OWNER" className="btn btn-primary btn-sm">Click here  to Rent your item</Link>
            </>
          ) : (
            <>
              {user.role === 'OWNER' && (
                <Link to="/products/new" className="btn btn-primary btn-sm">
                  <FaPlus style={{ fontSize: '0.7rem' }} /> New Listing
                </Link>
              )}
              <div className="nav-avatar" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Logout" style={{ padding: '0.4rem 0.6rem' }}>
                <FaSignOutAlt />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
