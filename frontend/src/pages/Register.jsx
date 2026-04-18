import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') === 'OWNER' ? 'OWNER' : 'USER';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: roleParam, phone: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await registerUser(form);
      setUser(res.data.user);
      toast.success('Account created!');
      navigate(res.data.user.role === 'OWNER' ? '/dashboard' : '/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Rent<span>Hub</span></div>
        <h1 className="auth-title">{roleParam === 'OWNER' ? 'Start selling' : 'Create account'}</h1>
        <p className="auth-subtitle">{roleParam === 'OWNER' ? 'List your items and start earning on RentHub.' : 'Browse and rent items on RentHub.'}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="form-input" placeholder="Min 6 characters" required autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optional)</span></label>
            <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+91 9876543210" />
          </div>


          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ borderRadius: 'var(--radius-sm)' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="divider" />
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
