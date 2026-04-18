import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAdminStats, getAdminUsers, deleteAdminUser, getAdminProducts, getContactLogs } from '../api/admin';
import { deleteProduct } from '../api/products';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { FaUsers, FaBox, FaWhatsapp, FaEye, FaTrash, FaChartBar } from 'react-icons/fa';

const TABS = ['Overview', 'Users', 'Products', 'Contact Logs'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (tab === 'Overview') {
      getAdminStats().then((r) => setStats(r.data.stats)).catch(() => toast.error('Failed to load stats')).finally(() => setLoading(false));
    } else if (tab === 'Users') {
      getAdminUsers(meta.page).then((r) => { setUsers(r.data.users); setMeta({ page: r.data.page, pages: r.data.pages }); }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
    } else if (tab === 'Products') {
      getAdminProducts(meta.page).then((r) => { setProducts(r.data.products); setMeta({ page: r.data.page, pages: r.data.pages }); }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
    } else if (tab === 'Contact Logs') {
      getContactLogs(meta.page).then((r) => { setLogs(r.data.logs); setMeta({ page: r.data.page, pages: r.data.pages }); }).catch(() => toast.error('Failed')).finally(() => setLoading(false));
    }
  }, [tab, meta.page]);

  const handleTabChange = (t) => { setTab(t); setMeta({ page: 1, pages: 1 }); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (deleteTarget.type === 'user') await deleteAdminUser(deleteTarget.id);
      else await deleteProduct(deleteTarget.id);
      toast.success('Deleted successfully');
      setDeleteTarget(null);
      handleTabChange(tab);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="dashboard-hero">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>Full system visibility and control</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="admin-tabs">
          {TABS.map((t) => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => handleTabChange(t)}>
              {t}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : (
          <>
            {/* OVERVIEW */}
            {tab === 'Overview' && stats && (
              <>
                <div className="stats-grid">
                  {[
                    { label: 'Total Users', value: stats.totalUsers, icon: <FaUsers /> },
                    { label: 'Total Owners', value: stats.totalOwners, icon: '🏪' },
                    { label: 'Active Products', value: stats.totalProducts, icon: <FaBox /> },
                    { label: 'Total Contacts', value: stats.totalContacts, icon: <FaWhatsapp /> },
                  ].map((s) => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-icon" style={{ color: 'var(--accent)' }}>{s.icon}</div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                  <div className="card card-body">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                      <FaEye style={{ color: 'var(--accent)' }} /> Most Viewed
                    </h3>
                    {stats.mostViewed.map((p, i) => (
                      <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{i + 1}. {p.title}</span>
                        <span className="badge badge-accent">{p.viewsCount} views</span>
                      </div>
                    ))}
                  </div>
                  <div className="card card-body">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                      <FaWhatsapp style={{ color: '#25d366' }} /> Most Contacted
                    </h3>
                    {stats.mostContacted.map((p, i) => (
                      <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{i + 1}. {p.title}</span>
                        <span className="badge badge-success">{p.contactCount} contacts</span>
                      </div>
                    ))}
                  </div>
                </div>

                {stats.recentContacts?.length > 0 && (
                  <div className="card card-body" style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                      <FaChartBar style={{ color: 'var(--accent)' }} /> Contact Activity (Last 7 Days)
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: 80 }}>
                      {stats.recentContacts.map((d) => {
                        const max = Math.max(...stats.recentContacts.map((x) => x.count));
                        const h = max > 0 ? (d.count / max) * 70 : 0;
                        return (
                          <div key={d._id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.count}</span>
                            <div style={{ width: '100%', height: h, background: 'var(--accent)', borderRadius: 4, minHeight: 4 }} title={`${d._id}: ${d.count}`} />
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{d._id.slice(5)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* USERS */}
            {tab === 'Users' && (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td style={{ fontWeight: 600 }}>{u.name}</td>
                          <td className="text-muted">{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'OWNER' ? 'badge-warning' : 'badge-accent'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="text-muted text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            {u.role !== 'ADMIN' && (
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget({ type: 'user', id: u._id })}>
                                <FaTrash />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={meta.page} pages={meta.pages} onPageChange={(p) => setMeta((m) => ({ ...m, page: p }))} />
              </>
            )}

            {/* PRODUCTS */}
            {tab === 'Products' && (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>Title</th><th>Owner</th><th>Category</th><th>Price</th><th>Views</th><th>Contacts</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id}>
                          <td style={{ fontWeight: 600, maxWidth: 200 }} className="truncate">{p.title}</td>
                          <td className="text-muted">{p.owner?.name}</td>
                          <td><span className="badge badge-accent">{p.category}</span></td>
                          <td>₹{p.price?.toLocaleString()}</td>
                          <td>{p.viewsCount}</td>
                          <td>{p.contactCount}</td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget({ type: 'product', id: p._id })}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={meta.page} pages={meta.pages} onPageChange={(p) => setMeta((m) => ({ ...m, page: p }))} />
              </>
            )}

            {/* CONTACT LOGS */}
            {tab === 'Contact Logs' && (
              <>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>Product</th><th>Owner</th><th>User</th><th>IP</th><th>Time</th></tr>
                    </thead>
                    <tbody>
                      {logs.map((l) => (
                        <tr key={l._id}>
                          <td style={{ fontWeight: 600 }}>{l.product?.title || '—'}</td>
                          <td className="text-muted">{l.owner?.name || '—'}</td>
                          <td className="text-muted">{l.user?.name || 'Guest'}</td>
                          <td className="text-muted text-sm">{l.ipAddress}</td>
                          <td className="text-muted text-sm">{new Date(l.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={meta.page} pages={meta.pages} onPageChange={(p) => setMeta((m) => ({ ...m, page: p }))} />
              </>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type === 'user' ? 'User' : 'Product'}`}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Are you sure? This action cannot be undone.</p>
      </Modal>
    </>
  );
}
