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

/**
 * ProductDetailPage — Premium Redesign
 *
 * A modern high-contrast product profile page containing custom layout panels,
 * glass gallery capsules, and fluid active tab sliders.
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
    <div className="text-center py-20 animate-fade-in">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200/20">
        <Package className="w-8 h-8 text-red-500" />
      </div>
      <p className="text-surface-700 dark:text-surface-300 font-bold">{error}</p>
      <Link to={ROUTES.PRODUCTS} className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 mt-5 hover:underline no-underline text-xs font-bold uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} /> Back to Products
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
    <div className="animate-fade-in">
      
      {/* Breadcrumb Capsule Links */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200/60 dark:border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-2xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest" aria-label="Breadcrumb">
            <Link to={ROUTES.HOME} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-750" />
            <Link to={ROUTES.PRODUCTS} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline transition-colors">Products</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-750" />
                <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-primary-600 dark:hover:text-primary-400 no-underline transition-colors">
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-surface-300 dark:text-surface-750" />
            <span className="text-primary-600 dark:text-primary-400 font-extrabold truncate max-w-48 select-none">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* ============ LEFT: Image Gallery ============ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            {/* Main Image View Panel */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-50 dark:bg-surface-950 border border-surface-200/60 dark:border-surface-800/50 mb-4 img-zoom shadow-premium card-gleam">
              {product.images?.[selectedImage]?.url ? (
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0.4, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-surface-300 dark:text-surface-700" strokeWidth={1} />
                </div>
              )}

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 select-none">
                {discount > 0 && (
                  <Badge variant="danger" size="sm" className="font-bold tracking-wider font-mono">
                    -{discount}% OFF
                  </Badge>
                )}
                {product.featured && (
                  <Badge variant="primary" size="sm" className="font-bold tracking-wide flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Wishlist Button Overlay */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWishlist(product._id)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer z-10 ${
                  wishlisted
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white/90 dark:bg-surface-900/90 text-surface-500 hover:text-red-500 hover:bg-white border border-surface-200/10'
                }`}
              >
                <Heart className={`w-5 h-5 transition-transform duration-300 ${wishlisted ? 'fill-white scale-110' : ''}`} />
              </motion.button>
            </div>

            {/* Gallery Thumbnail Strip */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3 select-none">
                {product.images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                      selectedImage === i
                        ? 'border-primary-600 ring-4 ring-primary-500/10 dark:ring-primary-400/10'
                        : 'border-surface-200/40 dark:border-surface-800/40 hover:border-primary-300 dark:hover:border-primary-700 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ============ RIGHT: Purchase Dashboard Panel ============ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Title / Header */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 select-none">
                <Badge variant="primary" size="xs" className="font-bold tracking-wider uppercase">{product.category}</Badge>
                {product.featured && (
                  <Badge variant="gold" size="xs" className="font-bold tracking-wider uppercase flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Best Seller
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Ratings & Inventory Metrics */}
            <div className="flex items-center gap-4 flex-wrap border-b border-surface-150 dark:border-surface-800/50 pb-5 select-none">
              {product.ratings > 0 ? (
                <div className="flex items-center gap-2">
                  <StarRating rating={product.ratings} size="md" showNumber />
                  <span className="text-surface-300 dark:text-surface-850">|</span>
                  <button
                    onClick={() => { setActiveTab('reviews'); document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 no-underline transition-colors cursor-pointer"
                  >
                    {product.numOfReviews} {product.numOfReviews === 1 ? 'review' : 'reviews'}
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500">No reviews yet</span>
              )}

              <span className="text-surface-300 dark:text-surface-850">|</span>

              {outOfStock ? (
                <Badge variant="danger" size="sm" className="font-bold tracking-wide uppercase">Out of Stock</Badge>
              ) : lowStock ? (
                <Badge variant="warning" size="sm" className="font-bold tracking-wide uppercase" dot>Only {product.stock} left!</Badge>
              ) : (
                <Badge variant="success" size="sm" className="font-bold tracking-wide uppercase" dot>In Stock</Badge>
              )}
            </div>

            {/* Core Pricing Dashboard Block */}
            <div className="relative bg-surface-50 dark:bg-surface-900 rounded-3xl p-6 border border-surface-200/60 dark:border-surface-800/50 overflow-hidden card-gleam">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary-500/40 to-transparent" />
              
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-black gradient-text-brand font-display tabular-nums">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-xl font-medium text-surface-400 dark:text-surface-500 line-through tabular-nums font-mono">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <Badge variant="danger" size="sm" className="font-bold tracking-wider font-mono">Save {discount}%</Badge>
                )}
              </div>
              
              {savings > 0 && (
                <p className="text-xs font-bold text-success dark:text-emerald-400 mt-2 flex items-center gap-1.5 animate-fade-in uppercase tracking-wider">
                  <Check className="w-4 h-4 stroke-3" />
                  You save {formatCurrency(savings)} on this order
                </p>
              )}
              
              <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500 mt-3 select-none">
                Inclusive of all Taxes · Free shipping over PKR 5,000
              </p>
            </div>

            {/* Stepper capsule + Action CTAs */}
            {!outOfStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 flex-wrap">
                  <label className="text-xs font-bold uppercase tracking-widest text-surface-400 dark:text-surface-500 select-none">Quantity:</label>
                  
                  {/* Styled Stepper Capsule */}
                  <div className="flex items-center bg-surface-50 dark:bg-surface-950 rounded-2xl border border-surface-200/60 dark:border-surface-800/50 p-1 shadow-inner select-none">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2.5 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-900 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-surface-700 dark:text-surface-300 stroke-[2.5]" />
                    </button>
                    <span className="w-10 text-center font-bold text-surface-950 dark:text-white font-mono tabular-nums">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="p-2.5 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-900 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-surface-700 dark:text-surface-300 stroke-[2.5]" />
                    </button>
                  </div>
                  
                  <span className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest select-none">
                    Max {product.stock} available units
                  </span>
                </div>

                {/* Main Action CTAs */}
                <div className="flex gap-3.5 flex-col sm:flex-row pt-2">
                  <Button
                    variant="shine"
                    size="lg"
                    icon={ShoppingBag}
                    loading={addingToCart}
                    onClick={handleAddToCart}
                    className="flex-1 font-bold uppercase tracking-wider py-3.5 shadow-brand"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="accent"
                    size="lg"
                    icon={Zap}
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className="flex-1 font-bold uppercase tracking-wider py-3.5 shadow-accent"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            )}

            {/* Redesigned Trust Grid */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-surface-200/50 dark:border-surface-800/40 select-none">
              {[
                { icon: Truck,      title: 'Free Delivery', desc: 'Above PKR 5k' },
                { icon: Shield,     title: 'SSL Encrypted', desc: 'Secure checkout' },
                { icon: RotateCcw,  title: 'Easy Returns',  desc: '30-day window' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-surface-50/50 dark:bg-surface-950/20 border border-surface-200/20 dark:border-surface-800/20 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="p-2 bg-primary-50 dark:bg-primary-950/40 rounded-xl border border-primary-100/10">
                    <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-[10px] font-bold text-surface-700 dark:text-surface-200 uppercase tracking-wide leading-none">{item.title}</p>
                  <p className="text-2xs text-surface-400 dark:text-surface-500 font-semibold leading-none mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ============ TABS PANEL SECTION ============ */}
        <div id="tabs" className="mt-20">
          
          {/* Slider Tab Headers */}
          <div className="border-b border-surface-200 dark:border-surface-800/60 mb-8 select-none">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-3.5 text-xs font-extrabold uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-surface-400 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'reviews' && product.numOfReviews > 0 && (
                    <span className="ml-1.5 text-3xs font-extrabold font-mono bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded-full border border-surface-200/20">
                      {product.numOfReviews}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary-600 to-violet-500 dark:from-primary-400 dark:to-violet-400 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Panel View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'description' && (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h3 className="text-base font-bold text-surface-900 dark:text-white uppercase tracking-wider mb-3 font-display">Product Description</h3>
                  <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-line font-medium">
                    {product.description || 'No description available.'}
                  </p>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Category',        value: product.category },
                    { label: 'SKU Identifier',  value: product._id?.slice(-8).toUpperCase() },
                    { label: 'Stock Available',  value: `${product.stock} Units` },
                    { label: 'Featured Product', value: product.featured ? 'Yes' : 'No' },
                    { label: 'Rating Metric',    value: product.ratings > 0 ? `${product.ratings.toFixed(1)} / 5` : 'Not Rated Yet' },
                    { label: 'Total Reviews',    value: `${product.numOfReviews}` },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-950 rounded-2xl border border-surface-200/40 dark:border-surface-800/30 hover:border-primary-200/80 dark:hover:border-primary-800/80 transition-colors">
                      <span className="text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500">{spec.label}</span>
                      <span className="text-sm font-bold text-surface-900 dark:text-white font-mono">{spec.value}</span>
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
                <div className="grid md:grid-cols-2 gap-5 max-w-5xl">
                  <div className="p-5 bg-surface-50/50 dark:bg-surface-950/30 rounded-3xl border border-surface-200/40 dark:border-surface-800/30">
                    <div className="flex items-center gap-2.5 mb-4 select-none">
                      <Truck className="w-5 h-5 text-primary-500" />
                      <h4 className="font-bold text-surface-900 dark:text-white text-sm uppercase tracking-wider">Shipping Information</h4>
                    </div>
                    <ul className="text-xs font-semibold text-surface-500 dark:text-surface-400 space-y-2.5">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0 stroke-3" /> Free standard shipping on all orders above PKR 5,000</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0 stroke-3" /> Standard delivery: 3-5 business days</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0 stroke-3" /> Express delivery: 1-2 business days (additional charges apply)</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0 stroke-3" /> Cash on Delivery available nationwide</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-surface-50/50 dark:bg-surface-950/30 rounded-3xl border border-surface-200/40 dark:border-surface-800/30">
                    <div className="flex items-center gap-2.5 mb-4 select-none">
                      <RotateCcw className="w-5 h-5 text-primary-500" />
                      <h4 className="font-bold text-surface-900 dark:text-white text-sm uppercase tracking-wider">Return Policy</h4>
                    </div>
                    <ul className="text-xs font-semibold text-surface-500 dark:text-surface-400 space-y-2.5">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0 stroke-3" /> 30-day easy return window from delivery date</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0 stroke-3" /> Item must be unused and in original packaging</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0 stroke-3" /> Refund processed within 5-7 business days</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-success mt-0.5 shrink-0 stroke-3" /> Free return pickup for damaged/defective items</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============ RELATED PRODUCTS GRID ============ */}
        {relatedFiltered.length > 0 && (
          <div className="mt-24">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <Badge variant="primary" size="xs" className="mb-2 uppercase tracking-wider font-bold">You may also like</Badge>
                <h2 className="text-2xl md:text-3xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none animate-fade-in-up">
                  Related Products
                </h2>
              </div>
              <Link
                to={product.category ? `/products?category=${encodeURIComponent(product.category)}` : ROUTES.PRODUCTS}
                className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold hover:gap-2.5 transition-all duration-300 no-underline text-xs uppercase tracking-widest whitespace-nowrap"
              >
                View All Related <ChevronRight className="w-4 h-4" />
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