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

/**
 * ProductListPage — Premium Redesign
 *
 * A refined product catalog workspace featuring high-contrast layout controls,
 * custom pagination pill grids, and smooth drawer transitions.
 */
const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  // Initialize filters from URL params (original robust calculation)
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
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200/60 dark:border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          
          {/* Breadcrumb Capsule Links */}
          <nav className="flex items-center gap-2 text-2xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-4" aria-label="Breadcrumb">
            <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
            <Link to={ROUTES.PRODUCTS} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline transition-colors">
              Products
            </Link>
            {filters.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
                <span className="text-primary-600 dark:text-primary-400 font-extrabold">{filters.category}</span>
              </>
            )}
          </nav>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">
                {filters.category || 'All Products'}
              </h1>
              <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-2 select-none">
                {loading ? 'Loading Catalog...' : `${pagination.total || 0} ${pagination.total === 1 ? 'product' : 'products'} found`}
              </p>
            </div>

            {/* Layout controls */}
            <div className="flex items-center gap-2 select-none">
              
              {/* View Layout Toggle (Desktop) */}
              <div className="hidden sm:flex items-center bg-surface-50 dark:bg-surface-955 rounded-xl p-1 border border-surface-200/30 dark:border-surface-800/30">
                <button
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    view === 'grid' 
                      ? 'bg-white dark:bg-surface-800 text-primary-600 dark:text-primary-400 shadow-sm' 
                      : 'text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  <LayoutGrid className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setView('list')}
                  aria-label="List view"
                  className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    view === 'list' 
                      ? 'bg-white dark:bg-surface-800 text-primary-600 dark:text-primary-400 shadow-sm' 
                      : 'text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  <List className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4.5 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-surface-400" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-2xs rounded-full flex items-center justify-center font-extrabold font-mono shadow-sm">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4.5 animate-fade-in">
              {filters.category && (
                <Badge variant="primary" size="sm" className="font-bold flex items-center gap-1.5 py-1 pl-3 pr-1.5 rounded-full border border-primary-200/30">
                  Category: {filters.category}
                  <button 
                    onClick={() => handleFilterChange({ category: '', page: 1 })} 
                    className="p-0.5 rounded-full hover:bg-primary-700 hover:text-white transition-all cursor-pointer"
                    aria-label="Remove category filter"
                  >
                    <X className="w-3 h-3" strokeWidth={3} />
                  </button>
                </Badge>
              )}
              {filters.search && (
                <Badge variant="primary" size="sm" className="font-bold flex items-center gap-1.5 py-1 pl-3 pr-1.5 rounded-full border border-primary-200/30">
                  Query: "{filters.search}"
                  <button 
                    onClick={() => handleFilterChange({ search: '', page: 1 })} 
                    className="p-0.5 rounded-full hover:bg-primary-700 hover:text-white transition-all cursor-pointer"
                    aria-label="Remove search query"
                  >
                    <X className="w-3 h-3" strokeWidth={3} />
                  </button>
                </Badge>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="primary" size="sm" className="font-bold flex items-center gap-1.5 py-1 pl-3 pr-1.5 rounded-full border border-primary-200/30 font-mono">
                  {filters.minPrice ? `PKR ${filters.minPrice}` : 'PKR 0'} – {filters.maxPrice ? `PKR ${filters.maxPrice}` : '∞'}
                  <button 
                    onClick={() => handleFilterChange({ minPrice: '', maxPrice: '', page: 1 })} 
                    className="p-0.5 rounded-full hover:bg-primary-700 hover:text-white transition-all cursor-pointer"
                    aria-label="Remove price filter"
                  >
                    <X className="w-3 h-3" strokeWidth={3} />
                  </button>
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="accent" size="sm" className="font-bold flex items-center gap-1.5 py-1 pl-3 pr-1.5 rounded-full border border-accent-200/30">
                  Featured
                  <button 
                    onClick={() => handleFilterChange({ featured: '', page: 1 })} 
                    className="p-0.5 rounded-full hover:bg-accent-700 hover:text-white transition-all cursor-pointer"
                    aria-label="Remove featured filter"
                  >
                    <X className="w-3 h-3" strokeWidth={3} />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          
          {/* Desktop Filter Sidebar (Sticky Panel) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Product Grid Panel */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              loading={loading}
              view={view}
              error={error}
            />

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <nav className="flex flex-col items-center justify-center gap-3.5 mt-12 select-none" aria-label="Pagination">
                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  <button
                    onClick={() => handleFilterChange({ page: (pagination.page || 1) - 1 })}
                    disabled={pagination.page <= 1}
                    className="p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors border border-surface-200/40 dark:border-surface-800/40"
                    aria-label="Previous page"
                  >
                    <ChevronRight className="w-4.5 h-4.5 rotate-180" strokeWidth={2.5} />
                  </button>

                  {buildPaginationItems().map((item, i) =>
                    item === '...' ? (
                      <span key={`ellipsis-${i}`} className="w-11 h-11 flex items-center justify-center text-surface-400 font-mono tracking-widest select-none">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handleFilterChange({ page: item })}
                        aria-current={pagination.page === item ? 'page' : undefined}
                        className={`min-w-11 h-11 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-mono ${
                          pagination.page === item
                            ? 'bg-primary-600 text-white shadow-brand'
                            : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 border border-transparent'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() => handleFilterChange({ page: (pagination.page || 1) + 1 })}
                    disabled={pagination.page >= pagination.pages}
                    className="p-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors border border-surface-200/40 dark:border-surface-800/40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4.5 h-4.5" strokeWidth={2.5} />
                  </button>
                </div>
                
                {/* Secondary Page Info Label */}
                <p className="text-center text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest select-none">
                  Page {pagination.page} of {pagination.pages} · {pagination.total} Total Products
                </p>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Slide Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-surface-950/40 backdrop-blur-xs z-50"
              onClick={() => setShowMobileFilters(false)}
            />
            {/* Sliding drawer panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface-50 dark:bg-surface-950 z-50 overflow-y-auto p-4 shadow-premium border-r border-surface-200/40 dark:border-surface-800/40"
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