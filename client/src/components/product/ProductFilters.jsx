import { Search, X, RotateCcw, Tag, DollarSign, Star } from 'lucide-react';
import Button from '../common/Button.jsx';

const CATEGORIES = [
  { name: 'All',            icon: '🛍️' },
  { name: 'Electronics',    icon: '📱' },
  { name: 'Clothing',       icon: '👕' },
  { name: 'Footwear',       icon: '👟' },
  { name: 'Accessories',    icon: '⌚' },
  { name: 'Home & Garden',  icon: '🏡' },
  { name: 'Sports',         icon: '⚽' },
  { name: 'Books',          icon: '📚' },
  { name: 'Beauty',         icon: '💄' },
  { name: 'Toys',           icon: '🧸' },
  { name: 'Other',          icon: '📦' },
];

const SORT_OPTIONS = [
  { value: 'newest',      label: 'Newest First' },
  { value: 'price_asc',   label: 'Price: Low to High' },
  { value: 'price_desc',  label: 'Price: High to Low' },
  { value: 'rating',      label: 'Top Rated' },
];

/**
 * ProductFilters — Premium Redesign
 *
 * A refined sidebar filter panel featuring sleek tactile inputs, glowing indicators,
 * and high-contrast typographic hierarchy.
 */
const ProductFilters = ({ filters, onFilterChange, onClose }) => {
  const activeCategory = filters.category || 'All';
  const hasActiveFilters =
    filters.search || filters.category || filters.minPrice || filters.maxPrice ||
    (filters.sort && filters.sort !== 'newest');

  const handleClear = () => {
    onFilterChange({
      category: '', search: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1,
    });
  };

  return (
    <div className="relative bg-white dark:bg-surface-900 rounded-3xl border border-surface-200/60 dark:border-surface-800/50 overflow-hidden shadow-premium card-gleam">
      {/* Premium top hairline */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />

      {/* Header Panel */}
      <div className="flex items-center justify-between p-5 border-b border-surface-100 dark:border-surface-800/60 bg-linear-to-b from-surface-50/50 to-transparent dark:from-surface-950/20">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-surface-900 dark:text-white font-display text-base tracking-tight">Filters</h2>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse-ring" />
          )}
        </div>
        <div className="flex items-center gap-2.5">
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors cursor-pointer select-none"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={2.5} /> Clear
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              aria-label="Close filters"
            >
              <X className="w-4.5 h-4.5 text-surface-500 dark:text-surface-400" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-6 max-h-[calc(100vh-14rem)] overflow-y-auto scrollbar-hide">
        
        {/* Search Segment */}
        <div>
          <label className="flex items-center gap-2 text-2xs font-extrabold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-2.5 select-none">
            <Search className="w-3.5 h-3.5 text-surface-400" /> Search Catalog
          </label>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              className="w-full pl-10 pr-9 py-2.5 border border-surface-205 dark:border-surface-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400/85 transition-all duration-300 hover:border-surface-300 dark:hover:border-surface-700"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '', page: 1 })}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="gradient-divider" />

        {/* Categories Segment */}
        <div>
          <label className="flex items-center gap-2 text-2xs font-extrabold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-3.5 select-none">
            <Tag className="w-3.5 h-3.5 text-surface-400" /> Category
          </label>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1.5 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => onFilterChange({ category: cat.name === 'All' ? '' : cat.name, page: 1 })}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border border-transparent ${
                    isActive
                      ? 'bg-primary-50/80 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 border-primary-100 dark:border-primary-900/30 shadow-xs'
                      : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100/60 dark:hover:bg-surface-850 hover:text-surface-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-base filter saturate-[0.85] group-hover:saturate-[1.1] transition-all">{cat.icon}</span>
                  <span className="flex-1 text-left tracking-wide">{cat.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce-subtle" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="gradient-divider" />

        {/* Price Range Segment */}
        <div>
          <label className="flex items-center gap-2 text-2xs font-extrabold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-3.5 select-none">
            <DollarSign className="w-3.5 h-3.5 text-surface-400" /> Price Range
          </label>
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-surface-400 select-none">PKR</span>
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange({ minPrice: e.target.value, page: 1 })}
                className="w-full pl-14 pr-3 py-2.5 border border-surface-200 dark:border-surface-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all duration-300 hover:border-surface-300 dark:hover:border-surface-750"
              />
            </div>
            <span className="text-surface-400 text-sm font-semibold select-none">—</span>
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-surface-400 select-none">PKR</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value, page: 1 })}
                className="w-full pl-14 pr-3 py-2.5 border border-surface-200 dark:border-surface-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all duration-300 hover:border-surface-300 dark:hover:border-surface-750"
              />
            </div>
          </div>
        </div>

        <div className="gradient-divider" />

        {/* Sort Segment */}
        <div>
          <label className="flex items-center gap-2 text-2xs font-extrabold text-surface-400 dark:text-surface-500 uppercase tracking-widest mb-3.5 select-none">
            <Star className="w-3.5 h-3.5 text-surface-400" /> Sort Order
          </label>
          <div className="relative">
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
              className="w-full px-3.5 py-3 border border-surface-200 dark:border-surface-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white cursor-pointer transition-all duration-300 hover:border-surface-300 dark:hover:border-surface-750 appearance-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="font-semibold">{opt.label}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile Apply CTA */}
        {onClose && (
          <div className="pt-2 animate-fade-in">
            <Button variant="primary" className="w-full lg:hidden rounded-xl font-bold py-3 hover:shadow-brand" onClick={onClose}>
              Show Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;