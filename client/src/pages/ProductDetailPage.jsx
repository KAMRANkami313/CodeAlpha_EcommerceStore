import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Minus, Plus, ChevronRight, Truck, Shield, RotateCcw,
  Heart, Home, ChevronLeft, Star, Zap, Check, Package, Award,
} from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import useCart from '../hooks/useCart.js';
import useWishlist from '../hooks/useWishlist.js';
import useProducts from '../hooks/useProducts.js';
import productService from '../services/productService.js';
import StarRating from '../components/common/StarRating.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import ReviewList from '../components/product/ReviewList.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import formatCurrency from '../utils/formatCurrency.js';
import calculateDiscount from '../utils/calculateDiscount.js';
import toast from 'react-hot-toast';
import ROUTES from '../constants/ROUTES.js';

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specs',       label: 'Specifications' },
  { id: 'reviews',     label: 'Reviews' },
  { id: 'shipping',    label: 'Shipping & Returns' },
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(() => productService.getProductById(id), [id]);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Related products (same category, exclude current)
  const { products: related, loading: relatedLoading } = useProducts(
    product?.category ? { category: product.category, limit: 5 } : { limit: 5 }
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);

  if (loading) return <Loader size="lg" label="Loading product..." className="min-h-[60vh]" />;
  if (error) return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-red-500" />
      </div>
      <p className="text-surface-700 dark:text-surface-300 font-medium">{error}</p>
      <Link to={ROUTES.PRODUCTS} className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 mt-4 hover:underline no-underline text-sm">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </Link>
    </div>
  );
  if (!product) return null;

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product._id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const savings = product.compareAtPrice > product.price
    ? product.compareAtPrice - product.price
    : 0;
  const relatedFiltered = (related || []).filter((p) => p._id !== product._id).slice(0, 4);

  const handleAddToCart = async () => {
    if (outOfStock) return;
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      toast.success(`${quantity} × ${product.name.slice(0, 24)}${product.name.length > 24 ? '…' : ''} added to cart`);
    } catch {
      toast.error('Could not add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (outOfStock) return;
    await handleAddToCart();
    window.location.href = ROUTES.CART;
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400" aria-label="Breadcrumb">
            <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={ROUTES.PRODUCTS} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline">Products</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline">
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-surface-700 dark:text-surface-300 font-medium truncate max-w-48">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ============ LEFT: Image Gallery ============ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-800 mb-4">
              {product.images?.[selectedImage]?.url ? (
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0.5, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-20 h-20 text-surface-300 dark:text-surface-700" strokeWidth={1.5} />
                </div>
              )}

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && <Badge variant="danger" size="sm">-{discount}% OFF</Badge>}
                {product.featured && <Badge variant="primary" size="sm" dot>Featured</Badge>}
              </div>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product._id)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  wishlisted
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white/80 dark:bg-surface-900/80 text-surface-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedImage === i
                        ? 'border-primary-600 ring-2 ring-primary-200 dark:ring-primary-900'
                        : 'border-surface-200 dark:border-surface-700 hover:border-primary-300'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ============ RIGHT: Purchase Box ============ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary" size="xs">{product.category}</Badge>
                {product.featured && <Badge variant="gold" size="xs"><Award className="w-3 h-3" /> Best Seller</Badge>}
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating + stock */}
            <div className="flex items-center gap-4 flex-wrap">
              {product.ratings > 0 ? (
                <div className="flex items-center gap-2">
                  <StarRating rating={product.ratings} size="md" showNumber />
                  <button
                    onClick={() => { setActiveTab('reviews'); document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline no-underline"
                  >
                    {product.numOfReviews} {product.numOfReviews === 1 ? 'review' : 'reviews'}
                  </button>
                </div>
              ) : (
                <span className="text-sm text-surface-500 dark:text-surface-400">No reviews yet</span>
              )}

              <span className="text-surface-300 dark:text-surface-700">|</span>

              {outOfStock ? (
                <Badge variant="danger" size="sm">Out of Stock</Badge>
              ) : lowStock ? (
                <Badge variant="warning" size="sm" dot>Only {product.stock} left!</Badge>
              ) : (
                <Badge variant="success" size="sm" dot>In Stock</Badge>
              )}
            </div>

            {/* Price block */}
            <div className="bg-surface-50 dark:bg-surface-900 rounded-2xl p-5 border border-surface-200 dark:border-surface-800">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold text-surface-900 dark:text-white font-display">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-xl text-surface-400 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <Badge variant="danger" size="sm">Save {discount}%</Badge>
                )}
              </div>
              {savings > 0 && (
                <p className="text-sm text-success dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  You save {formatCurrency(savings)} on this order
                </p>
              )}
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
                Inclusive of all taxes · Free shipping over PKR 5,000
              </p>
            </div>

            {/* Quantity + Add to cart */}
            {!outOfStock && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-surface-700 dark:text-surface-300">Quantity:</label>
                  <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-l-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-surface-700 dark:text-surface-300" />
                    </button>
                    <span className="w-12 text-center font-bold text-surface-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-r-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-surface-700 dark:text-surface-300" />
                    </button>
                  </div>
                  <span className="text-xs text-surface-500 dark:text-surface-400">
                    Max {product.stock} per order
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={ShoppingBag}
                    loading={addingToCart}
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="accent"
                    size="lg"
                    icon={Zap}
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="flex-1"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-surface-200 dark:border-surface-800">
              {[
                { icon: Truck,      title: 'Free Shipping', desc: 'Over PKR 5,000' },
                { icon: Shield,     title: 'Secure Payment', desc: 'SSL encrypted' },
                { icon: RotateCcw,  title: 'Easy Returns',  desc: '30-day policy' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">{item.title}</p>
                  <p className="text-2xs text-surface-500 dark:text-surface-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ============ TABS SECTION ============ */}
        <div id="tabs" className="mt-16">
          {/* Tab buttons */}
          <div className="border-b border-surface-200 dark:border-surface-800 mb-8">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'reviews' && product.numOfReviews > 0 && (
                    <span className="ml-1.5 text-2xs bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 rounded-full">
                      {product.numOfReviews}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'description' && (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-3">Product Description</h3>
                  <div
                    className="text-surface-600 dark:text-surface-300 leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
                  />
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Category',        value: product.category },
                    { label: 'SKU',             value: product._id?.slice(-8).toUpperCase() },
                    { label: 'Stock Available',  value: `${product.stock} units` },
                    { label: 'Featured',         value: product.featured ? 'Yes' : 'No' },
                    { label: 'Rating',           value: product.ratings > 0 ? `${product.ratings.toFixed(1)} / 5` : 'Not rated' },
                    { label: 'Total Reviews',    value: `${product.numOfReviews}` },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800">
                      <span className="text-sm text-surface-500 dark:text-surface-400">{spec.label}</span>
                      <span className="text-sm font-semibold text-surface-900 dark:text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <ReviewList
                  productId={product._id}
                  productRating={product.ratings}
                  numOfReviews={product.numOfReviews}
                />
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="p-5 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <h4 className="font-bold text-surface-900 dark:text-white">Shipping Information</h4>
                    </div>
                    <ul className="text-sm text-surface-600 dark:text-surface-300 space-y-2">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> Free standard shipping on all orders above PKR 5,000</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> Standard delivery: 3-5 business days</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> Express delivery: 1-2 business days (additional charges apply)</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> Cash on Delivery available nationwide</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800">
                    <div className="flex items-center gap-2 mb-3">
                      <RotateCcw className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <h4 className="font-bold text-surface-900 dark:text-white">Return Policy</h4>
                    </div>
                    <ul className="text-sm text-surface-600 dark:text-surface-300 space-y-2">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> 30-day easy return window from delivery date</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> Item must be unused and in original packaging</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> Refund processed within 5-7 business days</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0" /> Free return pickup for damaged/defective items</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============ RELATED PRODUCTS ============ */}
        {relatedFiltered.length > 0 && (
          <div className="mt-20">
            <div className="flex items-end justify-between mb-6 gap-4">
              <div>
                <Badge variant="primary" size="xs" className="mb-2">You may also like</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
                  Related Products
                </h2>
              </div>
              <Link
                to={product.category ? `/products?category=${encodeURIComponent(product.category)}` : ROUTES.PRODUCTS}
                className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold hover:gap-2.5 transition-all no-underline text-sm whitespace-nowrap"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedFiltered.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;