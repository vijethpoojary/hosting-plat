import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProduct, updateProduct } from '../api/products';
import ProductForm from '../components/product/ProductForm';
import Spinner from '../components/ui/Spinner';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data.product))
      .catch(() => { toast.error('Product not found'); navigate('/dashboard'); })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await updateProduct(id, formData);
      toast.success('Product updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner fullPage />;

  return (
    <>
      <div className="dashboard-hero">
        <div className="container">
          <h1>Edit Listing</h1>
          <p>Update your listing details</p>
        </div>
      </div>
      <div className="container" style={{ maxWidth: 720, paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="card card-body">
          {product && <ProductForm initialData={product} onSubmit={handleSubmit} loading={loading} />}
        </div>
      </div>
    </>
  );
}
