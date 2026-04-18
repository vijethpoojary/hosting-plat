import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from '../hooks/useDebounce';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';

const CATEGORIES = [
  { key: 'all',         label: 'All',        emoji: '🏷️' },
  { key: 'cars',        label: 'Cars',        emoji: '🚗' },
  { key: 'dresses',     label: 'Fashion',     emoji: '👗' },
  { key: 'electronics', label: 'Electronics', emoji: '🖥️' },
  { key: 'furniture',   label: 'Furniture',   emoji: '🛋️' },
  { key: 'tools',       label: 'Tools',       emoji: '🔧' },
  { key: 'sports',      label: 'Sports',      emoji: '⚽' },
  { key: 'other',       label: 'Other',       emoji: '📦' },
];

const SORT_OPTIONS = [
  { label: 'Newest',      value: '-createdAt' },
  { label: 'Most Viewed', value: '-viewsCount' },
  { label: 'Price: Low',  value: 'price' },
  { label: 'Price: High', value: '-price' },
];

export default function Home() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort]         = useState('-createdAt');
  const [page, setPage]         = useState(1);
  const debouncedSearch = useDebounce(search, 400);
  const params = {
    search: debouncedSearch || undefined,
    category: category !== 'all' ? category : undefined,
    sort, page, limit: 12,
  };
  const { products, loading, meta } = useProducts(params);
  const handleCategory = (cat) => { setCategory(cat); setPage(1); };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

      {/* Search bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: 'var(--card-radius)', padding: '0.65rem 1.1rem',
        boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem',
        backdropFilter: 'blur(12px)',
      }}>
        <FaSearch style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <input
          type="search" placeholder="Search listings..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', color: 'var(--text)' }}
          aria-label="Search products"
        />
        <div style={{ width: 1, height: 20, background: 'rgba(0,0,0,0.08)', flexShrink: 0 }} />
        <select
          value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
          aria-label="Sort"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Category cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(82px, 1fr))', gap: '0.65rem', marginBottom: '2rem' }}>
        {CATEGORIES.map((c) => {
          const on = category === c.key;
          return (
            <button key={c.key} onClick={() => handleCategory(c.key)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem',
              padding: '0.7rem 0.4rem 0.6rem', borderRadius: 'var(--card-radius)',
              border: on ? '1.5px solid var(--accent)' : '1px solid rgba(0,0,0,0.05)',
              background: on ? 'var(--accent-soft)' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: on ? '0 4px 14px rgba(59,130,246,0.18)' : 'var(--shadow-card)',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                background: on ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
              }}>{c.emoji}</div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: on ? 'var(--accent)' : 'var(--text)', textAlign: 'center', lineHeight: 1.2 }}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-muted" style={{ marginBottom: '1.25rem' }}>
          <strong style={{ color: 'var(--text)' }}>{meta.total}</strong> item{meta.total !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Product grid */}
      {loading ? <Spinner /> : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No listings found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      <Pagination page={meta.page} pages={meta.pages} onPageChange={setPage} />
    </div>
  );
}
