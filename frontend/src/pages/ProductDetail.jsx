import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProduct, logContact } from '../api/products';
import { getOwnerRatings, getMyRating, rateOwner } from '../api/ratings';
import { useAuth } from '../context/AuthContext';
import { Stars, StarPicker } from '../components/ui/StarRating';
import Spinner from '../components/ui/Spinner';
import { FaWhatsapp, FaEye, FaMapMarkerAlt, FaUser, FaArrowLeft } from 'react-icons/fa';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [contacting, setContacting] = useState(false);

  const [ratings, setRatings] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data.product))
      .catch(() => { toast.error('Product not found'); navigate('/'); })
      .finally(() => setLoading(false));

    getOwnerRatings(id).then((res) => setRatings(res.data.ratings)).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (user && product) {
      getMyRating(product.owner._id)
        .then((res) => {
          if (res.data.rating) {
            setMyRating(res.data.rating.rating);
            setMyReview(res.data.rating.review || '');
          }
        })
        .catch(() => {});
    }
  }, [user, product]);

  const handleContact = async () => {
    setContacting(true);
    try {
      const res = await logContact(id);
      toast.success('Opening WhatsApp...');
      setTimeout(() => window.open(res.data.whatsappUrl, '_blank'), 500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setContacting(false);
    }
  };

  const handleRate = async () => {
    if (!myRating) { toast.error('Please select a star rating'); return; }
    setRatingLoading(true);
    try {
      await rateOwner({ ownerId: product.owner._id, rating: myRating, review: myReview });
      toast.success('Rating submitted!');
      const res = await getOwnerRatings(product.owner._id);
      setRatings(res.data.ratings);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) return <Spinner fullPage />;
  if (!product) return null;

  const images = product.images || [];

  return (
    <div className="container product-detail">
      <button className="btn btn-ghost btn-sm mb-2" onClick={() => navigate(-1)} style={{ gap: '0.4rem' }}>
        <FaArrowLeft style={{ fontSize: '0.75rem' }} /> Back
      </button>

      <div className="product-detail-grid">
        {/* Images */}
        <div>
          <div style={{ borderRadius: 'var(--card-radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            {images.length > 0 ? (
              <img src={images[activeImg]?.url} alt={product.title} className="product-main-img" />
            ) : (
              <div style={{ height: 420, background: 'linear-gradient(135deg, var(--accent-soft), var(--amber-soft))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
                📦
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((img, i) => (
                <img key={i} src={img.url} alt={`thumb ${i + 1}`} className={`product-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)} />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>{product.category}</span>

          <h1 className="product-info-title">{product.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Stars rating={product.owner?.averageRating || 0} />
            <span className="text-muted text-sm">({product.owner?.totalRatings || 0} ratings)</span>
          </div>

          <p className="product-price">
            ₹{product.price.toLocaleString()}
            <span> /{product.priceUnit}</span>
          </p>

          <p className="product-desc">{product.description}</p>

          <div className="product-meta-row">
            {product.location && (
              <span className="product-meta-item"><FaMapMarkerAlt style={{ color: 'var(--accent)' }} />{product.location}</span>
            )}
            <span className="product-meta-item"><FaUser style={{ color: 'var(--accent)' }} />Owner: {product.owner?.name}</span>
            <span className="product-meta-item">
              <FaEye style={{ color: 'var(--accent)' }} />{product.viewsCount} views
              <span style={{ margin: '0 0.25rem', color: 'var(--border)' }}>·</span>
              <FaWhatsapp style={{ color: '#25d366' }} />{product.contactCount} contacts
            </span>
          </div>

          <button className="btn btn-whatsapp btn-full" onClick={handleContact} disabled={contacting}>
            <FaWhatsapp style={{ fontSize: '1.2rem' }} />
            {contacting ? 'Opening...' : 'Contact Owner on WhatsApp'}
          </button>

          <div className="rating-box">
            <h3>Rate this Owner</h3>
            {user ? (
              <>
                <StarPicker value={myRating} onChange={setMyRating} />
                <textarea
                  className="form-textarea"
                  placeholder="Leave a review (optional)"
                  value={myReview}
                  onChange={(e) => setMyReview(e.target.value)}
                  style={{ marginTop: '0.75rem', minHeight: 70 }}
                />
                <button className="btn btn-primary btn-sm mt-1" onClick={handleRate} disabled={ratingLoading}>
                  {ratingLoading ? 'Submitting...' : myRating ? 'Update Rating' : 'Submit Rating'}
                </button>
              </>
            ) : (
              <p className="text-muted text-sm">
                <a href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Login</a> to rate this owner.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {ratings.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            Reviews ({ratings.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ratings.map((r) => (
              <div key={r._id} className="card card-body" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <div className="nav-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem', flexShrink: 0 }}>
                    {r.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <strong style={{ fontSize: '0.875rem' }}>{r.user?.name}</strong>
                  <Stars rating={r.rating} size="0.85rem" />
                  <span className="text-muted text-sm">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.review && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)', paddingLeft: '2.75rem', lineHeight: 1.7 }}>{r.review}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
