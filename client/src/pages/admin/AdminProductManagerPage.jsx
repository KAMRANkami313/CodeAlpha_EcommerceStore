import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Package,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import productService from '../../services/productService.js';
import Loader from '../../components/common/Loader.jsx';
import Badge from '../../components/common/Badge.jsx';
import formatCurrency from '../../utils/formatCurrency.js';

const CATEGORIES = [
  'Electronics', 'Clothing', 'Footwear', 'Accessories',
  'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Other',
];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  compareAtPrice: '',
  category: 'Electronics',
  brand: '',
  stock: '',
  featured: false,
  isActive: true,
};

const inputClass =
  'w-full px-4 py-3 rounded-2xl border border-surface-150 dark:border-surface-850 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder-surface-400 dark:placeholder-surface-500 shadow-xs';

const AdminProductManagerPage = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formImages, setFormImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Track blob URLs so we can revoke them to prevent memory leaks
  const blobUrlsRef = useRef([]);

  // Revoke any lingering blob URLs when component unmounts
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current = [];
    };
  }, []);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      const response = await productService.getAllProducts(params);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
      else fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const revokeBlobUrls = () => {
    blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrlsRef.current = [];
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setFormImages([]);
    setImagePreview([]);
    setIsFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || '',
      category: product.category,
      brand: product.brand || '',
      stock: product.stock.toString(),
      featured: product.featured,
      isActive: product.isActive,
    });
    setFormImages([]);
    setImagePreview(product.images?.map((img) => img.url) || []);
    setIsFormOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormImages(files);
    // Revoke previous blob URLs before creating new ones
    revokeBlobUrls();
    const previews = files.map((f) => URL.createObjectURL(f));
    blobUrlsRef.current = previews;
    setImagePreview(previews);
  };

  const closeForm = () => {
    // Revoke blob URLs when form closes
    revokeBlobUrls();
    setIsFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingProduct) {
        const updateData = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          category: formData.category,
          brand: formData.brand,
          stock: parseInt(formData.stock),
          featured: formData.featured,
          isActive: formData.isActive,
        };
        await productService.updateProduct(editingProduct._id, updateData);
        toast.success('Product updated successfully');
      } else {
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('description', formData.description);
        fd.append('price', formData.price);
        if (formData.compareAtPrice) fd.append('compareAtPrice', formData.compareAtPrice);
        fd.append('category', formData.category);
        fd.append('brand', formData.brand);
        fd.append('stock', formData.stock);
        fd.append('featured', formData.featured);
        fd.append('isActive', formData.isActive);
        formImages.forEach((img) => fd.append('images', img));
        await productService.createProduct(fd);
        toast.success('Product created successfully');
      }
      closeForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Top Welcome Title Grid */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-surface-900 dark:text-white font-display">Products</h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1.5 flex items-center gap-2 font-medium">
            <Package className="w-3.5 h-3.5 text-primary-500" />
            Manage store catalog items · <span className="font-bold text-surface-900 dark:text-white tabular-nums">{pagination.total}</span> total
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-2xl hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 font-extrabold text-xs uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.2]" /> Add Product
        </button>
      </motion.div>

      {/* Filter Control Board */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input field */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-surface-150 dark:border-surface-850 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-xs font-medium placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-xs"
          />
        </div>

        {/* Categories Dropdown Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 rounded-2xl border border-surface-150 dark:border-surface-850 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer transition-all shadow-xs"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Main Workspace Catalog Table */}
      {loading ? (
        <Loader label="Loading product catalog..." />
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-3xl border border-dashed border-surface-200 dark:border-surface-800 select-none">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-100 dark:bg-surface-950 flex items-center justify-center mb-4 border border-surface-150 dark:border-surface-850">
            <Package className="w-7 h-7 text-surface-300 dark:text-surface-700" />
          </div>
          <p className="text-surface-800 dark:text-surface-200 font-bold uppercase tracking-wider text-xs">No products found</p>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1 mb-6">Try adjusting filters or record a new item catalog listing</p>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl hover:shadow-soft transition-colors text-xs font-extrabold uppercase tracking-wider cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" /> Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-150 dark:border-surface-850/60 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-100 dark:border-surface-850 bg-surface-50/50 dark:bg-surface-950/20 select-none">
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Stock Status</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4.5 font-bold text-surface-450 dark:text-surface-500 text-3xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-850">
                {products.map((product, i) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-surface-50/60 dark:hover:bg-surface-950/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-surface-50 dark:bg-surface-950 overflow-hidden shrink-0 border border-surface-100 dark:border-surface-850 select-none">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-surface-300 dark:text-surface-700" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-surface-850 dark:text-white truncate max-w-48 leading-snug">
                            {product.name}
                          </p>
                          {product.featured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-accent-650 dark:text-accent-400 bg-accent-500/10 px-1.5 py-0.5 rounded-md mt-1 select-none">
                              <Star className="w-2.5 h-2.5 fill-current" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-surface-500 dark:text-surface-400 text-xs font-bold uppercase tracking-wider">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-surface-900 dark:text-white tabular-nums text-xs sm:text-sm">{formatCurrency(product.price)}</span>
                      {product.compareAtPrice > product.price && (
                        <span className="text-2xs text-surface-400 line-through mt-0.5 block tabular-nums">{formatCurrency(product.compareAtPrice)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black tabular-nums ${product.stock === 0 ? 'text-danger' : product.stock <= 5 ? 'text-warning' : 'text-surface-900 dark:text-white'}`}>
                        {product.stock} units
                      </span>
                      {product.stock === 0 ? (
                        <span className="block text-[10px] text-danger font-bold uppercase tracking-wider mt-0.5 select-none">Out of stock</span>
                      ) : product.stock <= 5 ? (
                        <span className="block text-[10px] text-warning font-bold uppercase tracking-wider mt-0.5 select-none">Low stock</span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.isActive ? 'success' : 'default'} size="xs" className="text-3xs font-black uppercase tracking-wider select-none">
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/40 text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer border border-transparent hover:border-primary-100/30"
                          title="Edit"
                          aria-label="Edit product"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-surface-400 hover:text-danger transition-colors cursor-pointer border border-transparent hover:border-red-100/30"
                          title="Delete"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Catalog Table Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-surface-100 dark:border-surface-850 bg-surface-50/30 dark:bg-surface-950/10 select-none">
              <p className="text-2xs font-bold uppercase tracking-wider text-surface-450 dark:text-surface-555">
                Showing <span className="font-extrabold text-surface-800 dark:text-white tabular-nums">{(page - 1) * 10 + 1}</span> to <span className="font-extrabold text-surface-800 dark:text-white tabular-nums">{Math.min(page * 10, pagination.total)}</span> of <span className="font-extrabold text-surface-800 dark:text-white tabular-nums">{pagination.total}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4.5 h-4.5 text-surface-600 dark:text-surface-400" />
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      p === page
                        ? 'bg-linear-to-r from-primary-600 to-violet-600 text-white shadow-xs'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4.5 h-4.5 text-surface-600 dark:text-surface-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────── Product Management Form Modal ───────────────────────── */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-surface-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-surface-150 dark:border-surface-850"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Form Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-surface-100 dark:border-surface-850 sticky top-0 bg-white/95 dark:bg-surface-900/95 backdrop-blur-sm z-10 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-indigo-600 flex items-center justify-center border border-primary-400/20">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-surface-900 dark:text-white uppercase tracking-wider font-display">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-surface-400 mt-1">
                      {editingProduct ? 'Update catalog inventory specifications' : 'Create a brand new listing'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors text-surface-400 hover:text-surface-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name field */}
                  <div className="sm:col-span-2">
                    <label className="block text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest select-none">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description field */}
                  <div className="sm:col-span-2">
                    <label className="block text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest select-none">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`${inputClass} resize-none min-h-22.5 leading-relaxed`}
                      placeholder="Enter premium product details description..."
                    />
                  </div>

                  {/* Pricing Fields */}
                  <div>
                    <label className="block text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest select-none">
                      Price (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest select-none">
                      Compare at Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                      className={inputClass}
                      placeholder="Original price (optional)"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest select-none">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`${inputClass} cursor-pointer uppercase tracking-wider font-bold`}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Brand field */}
                  <div>
                    <label className="block text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest select-none">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className={inputClass}
                      placeholder="Brand manufacturer specifications"
                    />
                  </div>

                  {/* Quantity Stock field */}
                  <div>
                    <label className="block text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest select-none">
                      Stock Inventory *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  {/* File Upload selection */}
                  {!editingProduct && (
                    <div>
                      <label className="block text-3xs font-extrabold text-surface-450 dark:text-surface-500 mb-2 uppercase tracking-widest select-none">
                        Catalog Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-2xs font-bold text-surface-500 dark:text-surface-400 file:mr-3.5 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-3xs file:font-black file:uppercase file:tracking-widest file:bg-primary-50 dark:file:bg-primary-950/30 file:text-primary-700 dark:file:text-primary-400 hover:file:bg-primary-100 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Config Checkboxes */}
                  <div className="sm:col-span-2 flex items-center gap-6 p-4 rounded-2xl bg-surface-50 dark:bg-surface-950/20 border border-surface-100 dark:border-surface-850 select-none">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4.5 h-4.5 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-surface-700 dark:text-surface-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Sparkles className="w-4.5 h-4.5 text-gold" /> Featured Spotlight
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4.5 h-4.5 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Active Visibility</span>
                    </label>
                  </div>
                </div>

                {/* Local Upload Previews Box */}
                {imagePreview.length > 0 && (
                  <div className="flex gap-2.5 flex-wrap p-3 rounded-2xl bg-surface-50 dark:bg-surface-950/35 border border-surface-100 dark:border-surface-850">
                    {imagePreview.map((src, i) => (
                      <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-surface-150 dark:border-surface-800">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Form CTA Buttons */}
                <div className="flex items-center gap-3 pt-4.5 border-t border-surface-100 dark:border-surface-850 select-none">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-linear-to-r from-primary-600 to-indigo-600 text-white rounded-2xl hover:shadow-glow transition-all font-black text-xs uppercase tracking-widest disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving catalog records...
                      </>
                    ) : editingProduct ? 'Update Product Details' : 'Publish Product'}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-3 border border-surface-150 dark:border-surface-800 text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-white rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-950 transition-colors font-bold text-xs uppercase tracking-widest cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────── Delete Target Confirmation Alert Modal ───────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-surface-900 rounded-3xl shadow-2xl w-full max-w-md p-6.5 border border-surface-150 dark:border-surface-850 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-danger-soft/10 dark:bg-danger/10 rounded-2xl border border-danger/15 shrink-0">
                  <AlertTriangle className="w-6 h-6 text-danger" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-surface-900 dark:text-white uppercase tracking-wider font-display">Delete Product</h3>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-surface-400 mt-0.5">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-355 leading-relaxed mb-6">
                Are you sure you want to delete <strong className="text-surface-900 dark:text-white font-extrabold">{deleteTarget.name}</strong> from the public catalogue?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(deleteTarget._id)}
                  className="flex-1 py-3 bg-danger text-white rounded-2xl hover:bg-red-700 transition-colors font-black text-xs uppercase tracking-widest cursor-pointer"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3 border border-surface-150 dark:border-surface-800 text-surface-500 dark:text-surface-400 hover:text-surface-800 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-950 transition-colors font-bold text-xs uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductManagerPage;