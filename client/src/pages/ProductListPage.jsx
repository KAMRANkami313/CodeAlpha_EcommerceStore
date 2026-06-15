import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import useProducts from '../hooks/useProducts.js';
import ProductGrid from '../components/product/ProductGrid.jsx';
import ProductFilters from '../components/product/ProductFilters.jsx';
import Button from '../components/common/Button.jsx';

const ProductListPage = () => {
  const [filters, setFilters] = useState({ category: '', sort: 'newest', search: '', minPrice: '', maxPrice: '' });
  const [showFilters, setShowFilters] = useState(false);
  const { products, pagination, loading, error } = useProducts(filters);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900">All Products</h1>
          <p className="text-surface-500 mt-1">{pagination.total || 0} products found</p>
        </div>
        <Button variant="secondary" size="sm" icon={SlidersHorizontal} onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
          Filters
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters — Desktop */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 hrink-0`}>
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {error ? (
            <div className="text-center py-16 text-red-500">{error}</div>
          ) : (
            <>
              <ProductGrid products={products} loading={loading} />
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handleFilterChange({ page: i + 1 })}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        pagination.page === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;