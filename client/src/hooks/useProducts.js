import { useState, useEffect } from 'react';
import productService from '../services/productService.js';

const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.getAllProducts(params);
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, pagination, loading, error };
};

export default useProducts;