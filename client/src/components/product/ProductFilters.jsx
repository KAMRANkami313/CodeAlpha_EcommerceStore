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
 * Sidebar filter panel with sectioned groups:
 *   - Search input
 *   - Category list (with icons, active state)
 *   - Price range (min/max inputs)
 *   - Sort dropdown
 *   - Clear all button
 *
 * Props:
 *   filters, onFilterChange, onClose (mobile only)
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
    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden shadow-card">
      {/* Premium top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-surface-100 dark:border-surface-800">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-surface-900 dark:text-white font-display">Filters</h2>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer"
              aria-label="Close filters"
            >
              <X className="w-5 h-5 text-surface-500" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Search */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            <Search className="w-3.5 h-3.5" /> Search
          </label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              className="w-full pl-10 pr-9 py-2.5 border-1.5 border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500 bg-surface-50 dark:bg-surface-800/60 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all hover:border-surface-300 dark:hover:border-surface-600"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '', page: 1 })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
            <Tag className="w-3.5 h-3.5" /> Category
          </label>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => onFilterChange({ category: cat.name === 'All' ? '' : cat.name, page: 1 })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-1 ring-inset ring-primary-200/60 dark:ring-primary-700/40'
                      : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="flex-1 text-left">{cat.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5" /> Price Range
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-surface-400">PKR</span>
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange({ minPrice: e.target.value, page: 1 })}
                className="w-full pl-12 pr-3 py-2 border-1.5 border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500 bg-surface-50 dark:bg-surface-800/60 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all hover:border-surface-300 dark:hover:border-surface-600"
              />
            </div>
            <span className="text-surface-400 text-sm">—</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-surface-400">PKR</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value, page: 1 })}
                className="w-full pl-12 pr-3 py-2 border-1.5 border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500 bg-surface-50 dark:bg-surface-800/60 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all hover:border-surface-300 dark:hover:border-surface-600"
              />
            </div>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5" /> Sort By
          </label>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
            className="w-full px-3 py-2.5 border-1.5 border-surface-200 dark:border-surface-700 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/15 focus:border-primary-500 bg-surface-50 dark:bg-surface-800/60 text-surface-900 dark:text-white cursor-pointer transition-all hover:border-surface-300 dark:hover:border-surface-600"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Apply button (mobile) */}
        {onClose && (
          <Button variant="primary" className="w-full lg:hidden" onClick={onClose}>
            Show Results
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;