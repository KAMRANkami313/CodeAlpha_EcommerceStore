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
  'w-full px-3.5 py-2.5 rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 transition-all placeholder:text-surface-400';

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

  // Track blob URLs to prevent memory leaks
  const blobUrlsRef = useRef([]);

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
    revokeBlobUrls();
    const previews = files.map((f) => URL.createObjectURL(f));
    blobUrlsRef.current = previews;
    setImagePreview(previews);
  };

  const closeForm = () => {
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
    <div className="space-y-6 py-2">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-surface-900 dark:text-white font-display">Products</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-500" />
            Manage store catalog · <span className="font-semibold text-surface-900 dark:text-white tabular-nums">{pagination.total}</span> total
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Product
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
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-sm font-medium placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 text-surface-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-500 cursor-pointer transition-all"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <Loader label="Loading products..." />
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-surface-900 rounded-xl border border-dashed border-surface-200 dark:border-surface-800">
          <div className="w-16 h-16 mx-auto rounded-xl bg-surface-100 dark:bg-surface-950 flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-surface-300 dark:text-surface-700" strokeWidth={1.5} />
          </div>
          <p className="text-surface-900 dark:text-white font-medium">No products found</p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1 mb-6">Try adjusting filters or add a new product</p>
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add Your First Product
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/30">
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Product</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Category</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Price</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Stock</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs">Status</th>
                  <th className="px-5 py-3.5 font-medium text-surface-500 dark:text-surface-400 text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                {products.map((product, i) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-950/20 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-50 dark:bg-surface-950 overflow-hidden shrink-0 border border-surface-200 dark:border-surface-800">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-surface-300 dark:text-surface-700" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-surface-900 dark:text-white truncate max-w-48 leading-snug">
                            {product.name}
                          </p>
                          {product.featured && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded mt-1">
                              <Star className="w-2.5 h-2.5 fill-current" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-surface-500 dark:text-surface-400 text-sm">{product.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-surface-900 dark:text-white tabular-nums text-sm">{formatCurrency(product.price)}</span>
                      {product.compareAtPrice > product.price && (
                        <span className="text-xs text-surface-400 line-through mt-0.5 block tabular-nums">{formatCurrency(product.compareAtPrice)}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-semibold tabular-nums ${product.stock === 0 ? 'text-red-500' : product.stock <= 5 ? 'text-amber-500' : 'text-surface-900 dark:text-white'}`}>
                        {product.stock}
                      </span>
                      {product.stock === 0 ? (
                        <span className="block text-[11px] text-red-500 mt-0.5">Out of stock</span>
                      ) : product.stock <= 5 ? (
                        <span className="block text-[11px] text-amber-500 mt-0.5">Low stock</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={product.isActive ? 'success' : 'default'} size="xs">
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2 rounded-md hover:bg-primary-50 dark:hover:bg-primary-950/30 text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer"
                          title="Edit"
                          aria-label="Edit product"
                        >
                          <Edit3 className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-surface-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2} />
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
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/20">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Showing <span className="font-medium text-surface-900 dark:text-white tabular-nums">{(page - 1) * 10 + 1}</span> to <span className="font-medium text-surface-900 dark:text-white tabular-nums">{Math.min(page * 10, pagination.total)}</span> of <span className="font-medium text-surface-900 dark:text-white tabular-nums">{pagination.total}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-8 h-8 px-2 rounded-md text-sm font-medium transition-colors cursor-pointer tabular-nums ${
                      p === page
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product form modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-surface-900 rounded-xl shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-surface-200 dark:border-surface-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-800 sticky top-0 bg-white dark:bg-surface-900 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                    <Package className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-surface-900 dark:text-white font-display">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                      {editingProduct ? 'Update product details' : 'Create a new listing'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeForm}
                  className="p-1.5 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors text-surface-400 hover:text-surface-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Product Name *</label>
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
                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`${inputClass} resize-none`}
                      placeholder="Enter product description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Price (PKR) *</label>
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
                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Compare at Price</label>
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
                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Category *</label>
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
                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className={inputClass}
                      placeholder="Brand name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Stock *</label>
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
                      <label className="block text-sm font-medium text-surface-600 dark:text-surface-300 mb-1.5">Product Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-surface-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 dark:file:bg-primary-950/30 file:text-primary-700 dark:file:text-primary-400 hover:file:bg-primary-100 cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="sm:col-span-2 flex items-center gap-6 p-3.5 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="check-premium"
                      />
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" strokeWidth={2} /> Featured
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="check-premium"
                      />
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Active</span>
                    </label>
                  </div>
                </div>

                {/* Image previews */}
                {imagePreview.length > 0 && (
                  <div className="flex gap-2 flex-wrap p-3 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                    {imagePreview.map((src, i) => (
                      <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-surface-200 dark:border-surface-800">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2"
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
                    className="px-5 py-2.5 border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors font-medium text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white dark:bg-surface-900 rounded-xl shadow-lg w-full max-w-md p-6 border border-surface-200 dark:border-surface-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="p-2.5 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/30 shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-500" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-surface-900 dark:text-white font-display">Delete Product</h3>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
                Are you sure you want to delete <strong className="text-surface-900 dark:text-white font-semibold">{deleteTarget.name}</strong> from the catalog?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDelete(deleteTarget._id)}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm cursor-pointer"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 border border-surface-200 dark:border-surface-800 text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors font-medium text-sm cursor-pointer"
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