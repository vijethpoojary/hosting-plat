import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getOwnerProducts, deleteProduct } from '../api/products';
import { useAuth } from '../context/AuthContext';
import { Stars } from '../components/ui/StarRating';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import { FaPlus, FaEdit, FaTrash, FaEye, FaWhatsapp } from 'react-icons/fa';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    getOwnerProducts()
      .then((res) => setProducts(res.data.products))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const totalViews = products.reduce((s, p) => s + p.viewsCount, 0);
  const totalContacts = products.reduce((s, p) => s + p.contactCount, 0);

  return (
    <>
      <div className="dashboard-hero">
        <div className="container">
          <h1>{user?.name}'s Dashboard</h1>
          <p>Manage your listings and track performance</p>
          {(user?.averageRating > 0) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <Stars rating={user.averageRating} />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                {user.averageRating.toFixed(1)} · {user.totalRatings} rating{user.totalRatings !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="container section" style={{ paddingTop: '2rem' }}>
        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Listings', value: products.length, icon: '📦' },
            { label: 'Total Views', value: totalViews, icon: '👁️' },
            { label: 'Total Contacts', value: totalContacts, icon: '💬' },
            { label: 'Avg Rating', value: user?.averageRating?.toFixed(1) || '—', icon: '⭐' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>My Listings</h2>
          <Link to="/products/new" className="btn btn-primary btn-sm">
            <FaPlus style={{ fontSize: '0.7rem' }} /> Add Listing
          </Link>
        </div>

        {loading ? <Spinner /> : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No listings yet</h3>
            <p>Start by adding your first item for rent.</p>
            <Link to="/products/new" className="btn btn-primary mt-2">Add Item</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item</th><th>Category</th><th>Price</th>
                  <th>Views</th><th>Contacts</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {p.images?.[0]?.url ? (
                          <img src={p.images[0].url} alt={p.title} style={{ width: 44, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                        ) : (
                          <div style={{ width: 44, height: 36, background: 'var(--accent-soft)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>📦</div>
                        )}
                        <span style={{ fontWeight: 600, maxWidth: 180 }} className="truncate">{p.title}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-accent">{p.category}</span></td>
                    <td style={{ fontWeight: 700 }}>₹{p.price.toLocaleString()} <span className="text-muted text-xs">/{p.priceUnit}</span></td>
                    <td>{p.viewsCount}</td>
                    <td>{p.contactCount}</td>
                    <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => navigate(`/products/${p._id}/edit`)}><FaEdit /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(p._id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Listing"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
        </>}
      >
        <p className="text-muted">Are you sure you want to delete this listing? This cannot be undone.</p>
      </Modal>
    </>
  );
}
