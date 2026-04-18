import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const CATEGORY_EMOJI = {
  cars: '🚗', dresses: '👗', electronics: '📱',
  furniture: '🛋️', tools: '🔧', sports: '⚽', other: '📦',
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const img = product.images?.[0]?.url;
  const rating = product.owner?.averageRating || 0;

  return (
    <article
      className="card product-card"
      onClick={() => navigate(`/products/${product._id}`)}
      role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/products/${product._id}`)}
      aria-label={`View ${product.title}`}
    >
      <div className="product-card-img-wrap">
        {img ? (
          <img src={img} alt={product.title} className="product-card-img" loading="lazy" />
        ) : (
          <div className="product-card-img-placeholder">
            {CATEGORY_EMOJI[product.category] || '📦'}
          </div>
        )}

        {/* Price badge */}
        <div className="product-card-price-badge">
          ₹{product.price.toLocaleString()}
          <span style={{ fontWeight: 400, opacity: 0.75 }}> /{product.priceUnit?.replace('per ', '')}</span>
        </div>

        {/* Available indicator */}
        {product.isActive && (
          <div className="product-card-available">
            <span className="available-dot" />
            Available
          </div>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-card-category">{product.category}</p>
        <h3 className="product-card-title truncate">{product.title}</h3>
        <div className="product-card-meta">
          {product.location ? (
            <span className="product-card-location">
              <FaMapMarkerAlt style={{ fontSize: '0.7rem' }} />
              {product.location}
            </span>
          ) : <span />}
          {rating > 0 && (
            <span className="product-card-rating">
              <FaStar style={{ color: 'var(--amber)', fontSize: '0.75rem' }} />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
