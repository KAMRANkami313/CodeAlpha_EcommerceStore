import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Minus, Plus, ChevronRight, Truck, ShieldCheck, RotateCcw,
  Heart, Home, ChevronLeft, Zap, Check, Package, Award,
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

/**
 * ProductDetailPage — Editorial Modern Redesign
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(() => productService.getProductById(id), [id]);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { products: related, loading: relatedLoading } = useProducts(
    product?.category ? { category: product.category, limit: 5 } : null
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);

  if (loading) return <Loader size="lg" label="Loading product..." className="min-h-[60vh]" />;
  if (error) return (
    <div className="text-center py-20">
      <div className="w-14 h-14 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Package className="w-7 h-7 text-surface-400" strokeWidth={1.5} />
      </div>
      <p className="text-surface-700 dark:text-surface-300 font-medium">{error}</p>
      <Link to={ROUTES.PRODUCTS} className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 mt-5 hover:underline no-underline text-sm font-medium">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </Link>
    </div>
  );
  if (!product) return null;

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product._id);
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const savings = product.compareAtPrice > product.price ? product.compareAtPrice - product.price : 0;
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
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400" aria-label="Breadcrumb">
            <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
            <Link to={ROUTES.PRODUCTS} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline transition-colors">Products</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
                <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline transition-colors">
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-700" />
            <span className="text-primary-600 dark:text-primary-400 font-medium truncate max-w-48">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ============ Image Gallery ============ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 mb-4 img-zoom">
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
                  <ShoppingBag className="w-16 h-16 text-surface-300 dark:text-surface-700" strokeWidth={1} />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {discount > 0 && (
                  <Badge variant="danger" size="sm" className="font-mono">-{discount}% OFF</Badge>
                )}
                {product.featured && (
                  <Badge variant="primary" size="sm" className="flex items-center gap-1">
                    <Award className="w-3 h-3" /> Featured
                  </Badge>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product._id)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`absolute top-4 right-4 p-2.5 rounded-full transition-all cursor-pointer z-10 ${
                  wishlisted
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-white/90 dark:bg-surface-900/90 text-surface-500 hover:text-red-500 hover:bg-white border border-surface-200 dark:border-surface-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedImage === i
                        ? 'border-primary-600'
                        : 'border-surface-200 dark:border-surface-800 hover:border-primary-300 dark:hover:border-primary-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ============ Details ============ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="space-y-6"
          >
            {/* Title */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="xs">{product.category}</Badge>
                {product.featured && (
                  <Badge variant="gold" size="xs" className="flex items-center gap-1">
                    <Award className="w-3 h-3" /> Best Seller
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating + stock */}
            <div className="flex items-center gap-4 flex-wrap border-b border-surface-200 dark:border-surface-800 pb-5">
              {product.ratings > 0 ? (
                <div className="flex items-center gap-2">
                  <StarRating rating={product.ratings} size="md" showNumber />
                  <span className="text-surface-300 dark:text-surface-700">|</span>
                  <button
                    onClick={() => { setActiveTab('reviews'); document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 no-underline transition-colors cursor-pointer"
                  >
                    {product.numOfReviews} {product.numOfReviews === 1 ? 'review' : 'reviews'}
                  </button>
                </div>
              ) : (
                <span className="text-sm text-surface-400 dark:text-surface-500">No reviews yet</span>
              )}

              <span className="text-surface-300 dark:text-surface-700">|</span>

              {outOfStock ? (
                <Badge variant="danger" size="sm">Out of Stock</Badge>
              ) : lowStock ? (
                <Badge variant="warning" size="sm" dot>Only {product.stock} left</Badge>
              ) : (
                <Badge variant="success" size="sm" dot>In Stock</Badge>
              )}
            </div>

            {/* Price block */}
            <div className="bg-surface-50 dark:bg-surface-950/40 rounded-xl p-5 border border-surface-200 dark:border-surface-800">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white font-display tabular-nums">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-lg text-surface-400 dark:text-surface-500 line-through tabular-nums font-mono">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <Badge variant="danger" size="sm" className="font-mono">Save {discount}%</Badge>
                )}
              </div>

              {savings > 0 && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                  You save {formatCurrency(savings)} on this order
                </p>
              )}

              <p className="text-xs text-surface-400 dark:text-surface-500 mt-3">
                Inclusive of all taxes · Free shipping over PKR 5,000
              </p>
            </div>

            {/* Quantity + CTAs */}
            {!outOfStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="text-sm font-medium text-surface-600 dark:text-surface-300">Quantity:</label>

                  <div className="flex items-center bg-surface-50 dark:bg-surface-950 rounded-lg border border-surface-200 dark:border-surface-800 p-0.5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 rounded-md hover:bg-surface-200 dark:hover:bg-surface-800 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-surface-700 dark:text-surface-300" strokeWidth={2.5} />
                    </button>
                    <span className="w-10 text-center font-semibold text-surface-900 dark:text-white font-mono tabular-nums">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="p-2 rounded-md hover:bg-surface-200 dark:hover:bg-surface-800 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-surface-700 dark:text-surface-300" strokeWidth={2.5} />
                    </button>
                  </div>

                  <span className="text-xs text-surface-400 dark:text-surface-500">
                    Max {product.stock} available
                  </span>
                </div>

                <div className="flex gap-3 flex-col sm:flex-row pt-1">
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

            {/* Trust grid */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-surface-200 dark:border-surface-800">
              {[
                { icon: Truck,      title: 'Free Delivery', desc: 'Above PKR 5k' },
                { icon: ShieldCheck, title: 'SSL Encrypted', desc: 'Secure checkout' },
                { icon: RotateCcw,  title: 'Easy Returns',  desc: '30-day window' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg bg-surface-50 dark:bg-surface-950/30 border border-surface-200 dark:border-surface-800">
                  <div className="p-2 bg-primary-50 dark:bg-primary-950/30 rounded-lg">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
                  </div>
                  <p className="text-xs font-medium text-surface-700 dark:text-surface-200">{item.title}</p>
                  <p className="text-[11px] text-surface-400 dark:text-surface-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ============ Tabs ============ */}
        <div id="tabs" className="mt-16">
          <div className="border-b border-surface-200 dark:border-surface-800 mb-8">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'reviews' && product.numOfReviews > 0 && (
                    <span className="ml-1.5 text-xs font-mono bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded-full">
                      {product.numOfReviews}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'description' && (
                <div className="max-w-none">
                  <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-3 font-display">Product Description</h3>
                  <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-line">
                    {product.description || 'No description available.'}
                  </p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Category',   value: product.category },
                    { label: 'SKU',        value: product._id?.slice(-8).toUpperCase() },
                    { label: 'Stock',      value: `${product.stock} units` },
                    { label: 'Featured',   value: product.featured ? 'Yes' : 'No' },
                    { label: 'Rating',     value: product.ratings > 0 ? `${product.ratings.toFixed(1)} / 5` : 'Not rated' },
                    { label: 'Reviews',    value: `${product.numOfReviews}` },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-950/30 rounded-lg border border-surface-200 dark:border-surface-800">
                      <span className="text-sm text-surface-500 dark:text-surface-400">{spec.label}</span>
                      <span className="text-sm font-medium text-surface-900 dark:text-white font-mono">{spec.value}</span>
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
                <div className="grid md:grid-cols-2 gap-4 max-w-5xl">
                  <div className="p-5 bg-surface-50 dark:bg-surface-950/30 rounded-xl border border-surface-200 dark:border-surface-800">
                    <div className="flex items-center gap-2.5 mb-4">
                      <Truck className="w-5 h-5 text-primary-500" />
                      <h4 className="font-semibold text-surface-900 dark:text-white text-sm">Shipping Information</h4>
                    </div>
                    <ul className="text-sm text-surface-600 dark:text-surface-300 space-y-2.5">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" strokeWidth={2.5} /> Free standard shipping on orders above PKR 5,000</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" strokeWidth={2.5} /> Standard delivery: 3-5 business days</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" strokeWidth={2.5} /> Express delivery: 1-2 business days (additional charges)</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" strokeWidth={2.5} /> Cash on Delivery available nationwide</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-surface-50 dark:bg-surface-950/30 rounded-xl border border-surface-200 dark:border-surface-800">
                    <div className="flex items-center gap-2.5 mb-4">
                      <RotateCcw className="w-5 h-5 text-primary-500" />
                      <h4 className="font-semibold text-surface-900 dark:text-white text-sm">Return Policy</h4>
                    </div>
                    <ul className="text-sm text-surface-600 dark:text-surface-300 space-y-2.5">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" strokeWidth={2.5} /> 30-day return window from delivery date</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" strokeWidth={2.5} /> Item must be unused and in original packaging</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" strokeWidth={2.5} /> Refund processed within 5-7 business days</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" strokeWidth={2.5} /> Free return pickup for damaged/defective items</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============ Related Products ============ */}
        {relatedFiltered.length > 0 && (
          <div className="mt-20">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <Badge variant="primary" size="xs" className="mb-2">You may also like</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
                  Related Products
                </h2>
              </div>
              <Link
                to={product.category ? `/products?category=${encodeURIComponent(product.category)}` : ROUTES.PRODUCTS}
                className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-medium hover:gap-2.5 transition-all no-underline text-sm whitespace-nowrap"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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