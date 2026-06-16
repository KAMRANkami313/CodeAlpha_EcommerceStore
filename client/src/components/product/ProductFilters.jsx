import { Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'All', 'Electronics', 'Clothing', 'Footwear', 'Accessories',
  'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Other',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ProductFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-5 space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
        />
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-surface-500 dark:text-surface-400" />
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300">Category</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: cat === 'All' ? '' : cat })}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                (cat === 'All' && !filters.category) || filters.category === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Price Range</h3>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="w-full px-3 py-2 border border-surface-200 dark:border-surface-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Sort By</h3>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="w-full px-3 py-2.5 border border-surface-200 dark:border-surface-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;