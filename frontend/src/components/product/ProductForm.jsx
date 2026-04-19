import { useState } from 'react';
import toast from 'react-hot-toast';

const CATEGORIES = ['cars', 'dresses', 'electronics', 'furniture', 'tools', 'sports', 'other'];
const PRICE_UNITS = ['per day', 'per hour', 'per week', 'per month'];

export default function ProductForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'cars',
    price: initialData.price || '',
    priceUnit: initialData.priceUnit || 'per day',
    whatsappNumber: initialData.whatsappNumber || '',
    location: initialData.location || '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState(initialData.images?.map((i) => i.url) || []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) { toast.error('Max 5 images allowed'); return; }
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.price || !form.whatsappNumber) {
      toast.error('Please fill all required fields');
      return;
    }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach((img) => fd.append('images', img));
    onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Title *</label>
        <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="e.g. Honda City 2022" maxLength={100} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="form-select">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Price *</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input name="price" type="number" value={form.price} onChange={handleChange} className="form-input" placeholder="0" min="0" required style={{ flex: 1 }} />
            <select name="priceUnit" value={form.priceUnit} onChange={handleChange} className="form-select" style={{ width: 'auto' }}>
              {PRICE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="form-textarea" placeholder="Describe your item in detail..." maxLength={2000} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">WhatsApp Number *</label>
          <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} className="form-input" placeholder="+91 9876543210" required />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="form-input" placeholder="e.g. Mumbai, Maharashtra" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Images (max 5)</label>
        <input type="file" accept="image/*" multiple onChange={handleImages} className="form-input" style={{ padding: '0.5rem 0.75rem', cursor: 'pointer' }} />
        {previews.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {previews.map((src, i) => (
              <img key={i} src={src} alt={`preview ${i + 1}`} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '2px solid var(--border)' }} />
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
        {loading ? 'Saving...' : initialData._id ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}
