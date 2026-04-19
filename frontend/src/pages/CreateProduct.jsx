import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createProduct } from '../api/products';
import ProductForm from '../components/product/ProductForm';

export default function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await createProduct(formData);
      toast.success('Product listed successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dashboard-hero">
        <div className="container">
          <h1>List a New Item</h1>
          <p>Fill in the details to list your item for rent</p>
        </div>
      </div>
      <div className="container" style={{ maxWidth: 720, paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="card card-body">
          <ProductForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </>
  );
}
