import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../api/products';

export function useProducts(params) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts(params);
      setProducts(res.data.products);
      setMeta({ total: res.data.total, page: res.data.page, pages: res.data.pages });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, loading, error, meta, refetch: fetch };
}
