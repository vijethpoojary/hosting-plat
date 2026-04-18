import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="empty-state-icon">404</div>
      <h3>Page Not Found</h3>
      <p style={{ marginBottom: '1.75rem' }}>The page you're looking for doesn't exist or was moved.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}
