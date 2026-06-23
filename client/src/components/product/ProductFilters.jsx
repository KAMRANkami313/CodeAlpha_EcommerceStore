import { Search, X, RotateCcw, Tag, DollarSign, Star, ShoppingBag, Smartphone, Shirt, Footprints, Watch, Home as HomeIcon, Dumbbell, BookOpen, Sparkles, Gift, Package } from 'lucide-react';
import Button from '../common/Button.jsx';

// Categories — Lucide icons instead of emojis
// (Icon is a React component reference)
const CATEGORIES = [
  { name: 'All',           Icon: ShoppingBag },
  { name: 'Electronics',   Icon: Smartphone },
  { name: 'Clothing',      Icon: Shirt },
  { name: 'Footwear',      Icon: Footprints },
  { name: 'Accessories',   Icon: Watch },
  { name: 'Home & Garden', Icon: HomeIcon },
  { name: 'Sports',        Icon: Dumbbell },
  { name: 'Books',         Icon: BookOpen },
  { name: 'Beauty',        Icon: Sparkles },
  { name: 'Toys',          Icon: Gift },
  { name: 'Other',         Icon: Package },
];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
];

/**
 * ProductFilters — Editorial Modern Redesign
 *
 * All category emojis replaced with Lucide icons. Refined inputs.
 * Same props, same filter logic, same onFilterChange API.
 *
 * Props (unchanged):
 *   filters        — current filter state object
 *   onFilterChange — callback when any filter changes
 *   onClose        — optional callback to close mobile drawer
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

  // Shared input class for text/number inputs
  const inputClass = 'w-full px-3.5 py-2.5 border border-surface-200 dark:border-surface-800 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all hover:border-surface-300 dark:hover:border-surface-700';

  return (
    <div className="relative bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-surface-900 dark:text-white text-sm">Filters</h2>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={2.5} /> Clear
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
              aria-label="Close filters"
            >
              <X className="w-4 h-4 text-surface-500 dark:text-surface-400" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5 max-h-[calc(100vh-14rem)] overflow-y-auto scrollbar-hide">

        {/* ─── Search ─── */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">
            <Search className="w-3.5 h-3.5" /> Search
          </label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              className={`${inputClass} pl-9 pr-8`}
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '', page: 1 })}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="gradient-divider" />

        {/* ─── Categories ─── */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
            <Tag className="w-3.5 h-3.5" /> Category
          </label>
          <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1 scrollbar-hide">
            {CATEGORIES.map(({ name, Icon }) => {
              const isActive = activeCategory === name;
              return (
                <button
                  key={name}
                  onClick={() => onFilterChange({ category: name === 'All' ? '' : name, page: 1 })}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border border-transparent ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border-primary-100 dark:border-primary-900/30'
                      : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800/60 hover:text-surface-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'}`} strokeWidth={2} />
                  <span className="flex-1 text-left">{name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="gradient-divider" />

        {/* ─── Price Range ─── */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5" /> Price Range
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-surface-400 select-none">PKR</span>
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange({ minPrice: e.target.value, page: 1 })}
                className={`${inputClass} pl-11 py-2 text-sm`}
              />
            </div>
            <span className="text-surface-400 text-sm select-none">—</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-surface-400 select-none">PKR</span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value, page: 1 })}
                className={`${inputClass} pl-11 py-2 text-sm`}
              />
            </div>
          </div>
        </div>

        <div className="gradient-divider" />

        {/* ─── Sort ─── */}
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5" /> Sort Order
          </label>
          <div className="relative">
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
              className={`${inputClass} pr-9 cursor-pointer appearance-none`}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Mobile apply button */}
        {onClose && (
          <div className="pt-1">
            <Button variant="primary" className="w-full lg:hidden" onClick={onClose}>
              Show Results
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;