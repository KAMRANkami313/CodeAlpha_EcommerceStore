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
  'w-full px-3.5 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-surface-400 dark:placeholder-surface-500';

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

  // FIX: Track blob URLs so we can revoke them to prevent memory leaks
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
    // FIX: Revoke previous blob URLs before creating new ones
    revokeBlobUrls();
    const previews = files.map((f) => URL.createObjectURL(f));
    blobUrlsRef.current = previews;
    setImagePreview(previews);
  };

  const closeForm = () => {
    // FIX: Revoke blob URLs when form closes
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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text-brand">Products</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            Manage your product catalog · {pagination.total} total
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-primary-600 to-violet-600 text-white rounded-xl hover:shadow-glow transition-all font-semibold text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer transition-all"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <Loader label="Loading products..." />
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-surface-800 rounded-2xl border border-dashed border-surface-200 dark:border-surface-700">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-surface-300 dark:text-surface-500" />
          </div>
          <p className="text-surface-700 dark:text-surface-200 font-semibold">No products found</p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1 mb-4">Try adjusting filters or add a new product</p>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50">
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Price</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Stock</th>
                  <th className="text-left px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-surface-600 dark:text-surface-300 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {products.map((product, i) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-surface-100 dark:bg-surface-700 overflow-hidden shrink-0">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-surface-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-surface-900 dark:text-white truncate max-w-45">
                            {product.name}
                          </p>
                          {product.featured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-accent-600 dark:text-accent-400 bg-accent-500/10 px-1.5 py-0.5 rounded-full mt-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-surface-600 dark:text-surface-400 text-xs font-medium">{product.category}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-bold text-surface-900 dark:text-white">{formatCurrency(product.price)}</span>
                      {product.compareAtPrice > product.price && (
                        <span className="text-xs text-surface-400 line-through ml-1.5 block">{formatCurrency(product.compareAtPrice)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`font-semibold ${product.stock === 0 ? 'text-danger' : product.stock <= 5 ? 'text-warning' : 'text-surface-900 dark:text-white'}`}>
                        {product.stock}
                      </span>
                      {product.stock === 0 ? (
                        <span className="block text-[10px] text-danger font-semibold mt-0.5">Out of stock</span>
                      ) : product.stock <= 5 ? (
                        <span className="block text-[10px] text-warning font-semibold mt-0.5">Low stock</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={product.isActive ? 'success' : 'default'} size="xs">
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                          title="Edit"
                          aria-label="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-500 hover:text-danger transition-colors cursor-pointer"
                          title="Delete"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-700/30">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Showing <span className="font-semibold">{(page - 1) * 10 + 1}</span> to <span className="font-semibold">{Math.min(page * 10, pagination.total)}</span> of <span className="font-semibold">{pagination.total}</span>
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      p === page
                        ? 'bg-linear-to-r from-primary-600 to-violet-600 text-white shadow-sm'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────── Product Form Modal ───────────────────────── */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700 sticky top-0 bg-white dark:bg-surface-800 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-violet-600 flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-surface-900 dark:text-white">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      {editingProduct ? 'Update product information' : 'Create a new product listing'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">
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
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`${inputClass} resize-none`}
                      placeholder="Enter product description"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">
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
                    <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">
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
                  <div>
                    <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className={inputClass}
                      placeholder="Brand name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">
                      Stock *
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
                  {!editingProduct && (
                    <div>
                      <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1.5 uppercase tracking-wide">
                        Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-surface-600 dark:text-surface-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-400 hover:file:bg-primary-100 cursor-pointer"
                      />
                    </div>
                  )}
                  <div className="sm:col-span-2 flex items-center gap-6 p-3 rounded-xl bg-surface-50 dark:bg-surface-700/40 border border-surface-100 dark:border-surface-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-surface-700 dark:text-surface-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-gold" /> Featured
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className="text-sm text-surface-700 dark:text-surface-300">Active</span>
                    </label>
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview.length > 0 && (
                  <div className="flex gap-2 flex-wrap p-3 rounded-xl bg-surface-50 dark:bg-surface-700/40">
                    {imagePreview.map((src, i) => (
                      <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-linear-to-r from-primary-600 to-violet-600 text-white rounded-xl hover:shadow-glow transition-all font-semibold text-sm disabled:opacity-60 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </>
                    ) : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors font-medium text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────── Delete Confirmation Modal ───────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-danger/10 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-danger" />
                </div>
                <div>
                  <h3 className="font-bold text-surface-900 dark:text-white">Delete Product</h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">
                Are you sure you want to delete <strong className="text-surface-900 dark:text-white">{deleteTarget.name}</strong>?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(deleteTarget._id)}
                  className="flex-1 py-2.5 bg-danger text-white rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm cursor-pointer"
                >
                  Delete Product
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors font-medium text-sm cursor-pointer"
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