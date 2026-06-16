import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, ChevronLeft, Truck, Shield, RotateCcw, Heart } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import useCart from '../hooks/useCart.js';
import useWishlist from '../hooks/useWishlist.js';
import productService from '../services/productService.js';
import StarRating from '../components/common/StarRating.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import ReviewList from '../components/product/ReviewList.jsx';
import formatCurrency from '../utils/formatCurrency.js';
import calculateDiscount from '../utils/calculateDiscount.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, loading, error } = useFetch(() => productService.getProductById(id), [id]);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;
  if (!product) return null;

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const wishlisted = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 no-underline">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-100 dark:bg-surface-800 mb-4">
            {product.images?.[selectedImage]?.url ? (
              <img src={product.images[selectedImage].url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-16 h-16 text-surface-300 dark:text-surface-600" /></div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer ${selectedImage === i ? 'border-primary-600' : 'border-surface-200 dark:border-surface-700'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div className="flex items-center gap-2">
            <Badge variant="primary">{product.category}</Badge>
            {discount > 0 && <Badge variant="danger">-{discount}% OFF</Badge>}
          </div>
          <div className="flex items-start justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white flex-1">{product.name}</h1>
            <button
              onClick={() => toggleWishlist(product._id)}
              className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer shrink-0 ml-3"
            >
              <Heart className={`w-6 h-6 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-surface-400 dark:text-surface-500 hover:text-red-500'}`} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <StarRating rating={product.ratings} size={18} />
            <span className="text-sm text-surface-500 dark:text-surface-400">({product.numOfReviews} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-surface-900 dark:text-white">{formatCurrency(product.price)}</span>
            {product.compareAtPrice > product.price && (
              <span className="text-lg text-surface-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
            )}
          </div>
          <p className="text-surface-600 dark:text-surface-300 leading-relaxed">{product.description}</p>

          <div>
            {product.stock > 0 ? (
              <Badge variant="success">In Stock ({product.stock} available)</Badge>
            ) : (
              <Badge variant="danger">Out of Stock</Badge>
            )}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 bg-surface-100 dark:bg-surface-800 rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-l-xl cursor-pointer"><Minus className="w-4 h-4 text-surface-700 dark:text-surface-300" /></button>
                <span className="w-12 text-center font-semibold text-surface-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-r-xl cursor-pointer"><Plus className="w-4 h-4 text-surface-700 dark:text-surface-300" /></button>
              </div>
              <Button variant="accent" size="lg" icon={ShoppingBag} onClick={() => addToCart(product._id, quantity)} className="flex-1">
                Add to Cart
              </Button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-surface-200 dark:border-surface-700">
            <div className="text-center"><Truck className="w-5 h-5 mx-auto text-primary-600 dark:text-primary-400 mb-1" /><p className="text-xs text-surface-500 dark:text-surface-400">Free Shipping</p></div>
            <div className="text-center"><Shield className="w-5 h-5 mx-auto text-primary-600 dark:text-primary-400 mb-1" /><p className="text-xs text-surface-500 dark:text-surface-400">Secure Payment</p></div>
            <div className="text-center"><RotateCcw className="w-5 h-5 mx-auto text-primary-600 dark:text-primary-400 mb-1" /><p className="text-xs text-surface-500 dark:text-surface-400">Easy Returns</p></div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-10 border-t border-surface-200 dark:border-surface-700">
        <ReviewList
          productId={product._id}
          productRating={product.ratings}
          numOfReviews={product.numOfReviews}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;