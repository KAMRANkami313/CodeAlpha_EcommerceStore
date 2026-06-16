import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, LayoutGrid, List, Home, ChevronRight, X } from 'lucide-react';
import useProducts from '../hooks/useProducts.js';
import ProductGrid from '../components/product/ProductGrid.jsx';
import ProductFilters from '../components/product/ProductFilters.jsx';
import Badge from '../components/common/Badge.jsx';
import ROUTES from '../constants/ROUTES.js';
import { Link } from 'react-router-dom';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  // Initialize filters from URL params
  const buildFiltersFromURL = useCallback(() => ({
    category:  searchParams.get('category') || '',
    sort:      searchParams.get('sort') || 'newest',
    search:    searchParams.get('search') || '',
    minPrice:  searchParams.get('minPrice') || '',
    maxPrice:  searchParams.get('maxPrice') || '',
    page:      parseInt(searchParams.get('page') || '1', 10),
    featured:  searchParams.get('featured') || '',
  }), [searchParams]);

  const filters = buildFiltersFromURL();
  const { products, pagination, loading, error } = useProducts(filters);

  // Sync filter changes back to URL
  const handleFilterChange = useCallback((newFilters) => {
    const merged = { ...filters, ...newFilters };
    const params = {};
    if (merged.category)  params.category  = merged.category;
    if (merged.sort && merged.sort !== 'newest') params.sort = merged.sort;
    if (merged.search)    params.search    = merged.search;
    if (merged.minPrice)  params.minPrice  = merged.minPrice;
    if (merged.maxPrice)  params.maxPrice  = merged.maxPrice;
    if (merged.featured)  params.featured  = merged.featured;
    if (merged.page && merged.page > 1) params.page = String(merged.page);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Close mobile filters on route change
  useEffect(() => {
    setShowMobileFilters(false);
  }, [searchParams]);

  const activeFilterCount = [
    filters.category, filters.search, filters.minPrice, filters.maxPrice,
    filters.featured, (filters.sort && filters.sort !== 'newest' ? filters.sort : null),
  ].filter(Boolean).length;

  // Build pagination items with ellipsis
  const buildPaginationItems = () => {
    const current = pagination.page || 1;
    const total = pagination.pages || 1;
    const items = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) items.push(i);
    } else {
      items.push(1);
      if (current > 3) items.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) items.push(i);
      if (current < total - 2) items.push('...');
      items.push(total);
    }
    return items;
  };

  return (
    <div className="min-h-screen">
      {/* Page header with breadcrumb */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 mb-3" aria-label="Breadcrumb">
            <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-surface-700 dark:text-surface-300 font-medium">Products</span>
            {filters.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-primary-600 dark:text-primary-400 font-medium">{filters.category}</span>
              </>
            )}
          </nav>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
                {filters.category || 'All Products'}
              </h1>
              <p className="text-surface-500 dark:text-surface-400 mt-1 text-sm">
                {loading ? 'Loading...' : `${pagination.total || 0} ${pagination.total === 1 ? 'product' : 'products'} found`}
              </p>
            </div>

            {/* Mobile filter button + view toggle */}
            <div className="flex items-center gap-2">
              {/* View toggle (desktop) */}
              <div className="hidden sm:flex items-center bg-surface-100 dark:bg-surface-800 rounded-lg p-1">
                <button
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${view === 'grid' ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  aria-label="List view"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${view === 'list' ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-300 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-2xs rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {filters.category && (
                <Badge variant="primary" size="sm" className="cursor-pointer" >
                  {filters.category}
                  <button onClick={() => handleFilterChange({ category: '', page: 1 })} className="ml-1 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.search && (
                <Badge variant="primary" size="sm">
                  "{filters.search}"
                  <button onClick={() => handleFilterChange({ search: '', page: 1 })} className="ml-1 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="primary" size="sm">
                  {filters.minPrice ? `PKR ${filters.minPrice}` : 'PKR 0'} – {filters.maxPrice ? `PKR ${filters.maxPrice}` : '∞'}
                  <button onClick={() => handleFilterChange({ minPrice: '', maxPrice: '', page: 1 })} className="ml-1 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="accent" size="sm">
                  Featured
                  <button onClick={() => handleFilterChange({ featured: '', page: 1 })} className="ml-1 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar — sticky */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              loading={loading}
              view={view}
              error={error}
            />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
                {/* Prev */}
                <button
                  onClick={() => handleFilterChange({ page: (pagination.page || 1) - 1 })}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>

                {buildPaginationItems().map((item, i) =>
                  item === '...' ? (
                    <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-surface-400">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => handleFilterChange({ page: item })}
                      aria-current={pagination.page === item ? 'page' : undefined}
                      className={`min-w-10 h-10 px-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                        pagination.page === item
                          ? 'bg-primary-600 text-white shadow-brand'
                          : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => handleFilterChange({ page: (pagination.page || 1) + 1 })}
                  disabled={pagination.page >= pagination.pages}
                  className="p-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}

            {/* Page info */}
            {pagination.pages > 1 && (
              <p className="text-center text-xs text-surface-400 dark:text-surface-500 mt-3">
                Page {pagination.page} of {pagination.pages} · {pagination.total} total
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-surface-950/50 backdrop-blur-sm z-50"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface-50 dark:bg-surface-950 z-50 overflow-y-auto p-4"
            >
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClose={() => setShowMobileFilters(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductListPage;
