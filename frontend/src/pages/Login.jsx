import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      setUser(res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      const redirect = res.data.user.role === 'ADMIN' ? '/admin' : res.data.user.role === 'OWNER' ? '/dashboard' : from;
      navigate(redirect, { replace: true });
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
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              className="form-input" placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              className="form-input" placeholder="••••••••" required autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider" />
        <p className="text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/register?role=USER" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
