import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones,
  Sparkles, TrendingUp, Star, Quote, ChevronLeft, ChevronRight,
  Smartphone, Shirt, Footprints, Watch, Home as HomeIcon, Dumbbell,
} from 'lucide-react';
import useCart from '../hooks/useCart.js';
import useWishlist from '../hooks/useWishlist.js';
import useProducts from '../hooks/useProducts.js';
import ProductCard from '../components/product/ProductCard.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import ROUTES from '../constants/ROUTES.js';

const features = [
  { icon: Truck,       title: 'Free Shipping',  desc: 'On orders over PKR 5,000' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: RotateCcw,   title: 'Easy Returns',   desc: '30-day return policy' },
  { icon: Headphones,  title: '24/7 Support',   desc: 'Dedicated help center' },
];

// Lucide icons instead of emojis
const categories = [
  { name: 'Electronics',   desc: 'Smart gadgets',  Icon: Smartphone },
  { name: 'Clothing',      desc: 'Trendy fashion',  Icon: Shirt },
  { name: 'Footwear',      desc: 'Walk in style',   Icon: Footprints },
  { name: 'Accessories',   desc: 'Complete look',   Icon: Watch },
  { name: 'Home & Garden', desc: 'Cozy spaces',     Icon: HomeIcon },
  { name: 'Sports',        desc: 'Active life',     Icon: Dumbbell },
];

const testimonials = [
  {
    name: 'Ayesha Khan', role: 'Verified Buyer', avatar: 'AK', rating: 5,
    text: 'Absolutely love the quality and fast delivery! The checkout was smooth and the products exceeded my expectations. Will definitely shop again.',
  },
  {
    name: 'Bilal Ahmed', role: 'Verified Buyer', avatar: 'BA', rating: 5,
    text: 'Best online shopping experience in Pakistan. The website is so easy to use, and the customer support team is incredibly helpful. Highly recommended!',
  },
  {
    name: 'Sana Malik', role: 'Verified Buyer', avatar: 'SM', rating: 4,
    text: 'Great variety of products at competitive prices. The wishlist feature is super handy, and I love getting notified about deals on my saved items.',
  },
];

const HomePage = () => {
  const { fetchCart } = useCart();
  const { fetchWishlist } = useWishlist();
  const { products: featuredProducts, loading } = useProducts({ featured: 'true', limit: 8 });
  const { products: newProducts, loading: newLoading } = useProducts({ sort: 'newest', limit: 4 });

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 17 });

  useEffect(() => { fetchCart(); fetchWishlist(); }, [fetchCart, fetchWishlist]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const dealProducts = featuredProducts.slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24">

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Single soft glow (replaces 3 floating blobs + grid) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-200/20 dark:bg-violet-900/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20 z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full mb-6 border border-primary-200 dark:border-primary-900/30">
                <Sparkles className="w-3.5 h-3.5" />
                Exclusive Collection 2026
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-surface-900 dark:text-white font-display leading-[1.05] tracking-tight text-balance">
                Discover your{' '}
                <span className="text-primary-600 dark:text-primary-400">perfect</span>{' '}
                style
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-surface-600 dark:text-surface-400 mt-6 max-w-xl leading-relaxed">
                Explore our curated collection of premium products. From cutting-edge electronics to timeless fashion — find everything you need, all in one place.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link to={ROUTES.PRODUCTS} className="no-underline">
                  <Button variant="primary" size="lg" icon={ShoppingBag}>
                    Shop Now
                  </Button>
                </Link>
                <Link to={ROUTES.PRODUCTS + '?sort=newest'} className="no-underline">
                  <Button variant="secondary" size="lg" iconRight={ArrowRight}>
                    Browse New
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-x-10 gap-y-4 mt-12 pt-8 border-t border-surface-200 dark:border-surface-800">
                {[
                  { value: '10K+', label: 'Delighted Customers' },
                  { value: '500+', label: 'Premium Products' },
                  { value: '4.9★', label: 'Average Rating' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <p className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white font-display tabular-nums leading-none">{stat.value}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-1.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="p-2.5 bg-primary-50 dark:bg-primary-950/30 rounded-lg shrink-0">
                  <feature.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
                </div>
                <div>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">{feature.title}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="primary" size="xs" className="mb-3">Browse by Category</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">Find exactly what you're looking for</p>
          </div>
          <Link to={ROUTES.PRODUCTS} className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-medium hover:gap-2.5 transition-all no-underline text-sm whitespace-nowrap">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group block relative aspect-square rounded-xl overflow-hidden no-underline bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
              >
                <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                  <span className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 mb-3 transition-transform duration-200 group-hover:scale-110">
                    <cat.Icon className="w-6 h-6" strokeWidth={2} />
                  </span>
                  <p className="font-semibold text-surface-900 dark:text-white text-sm">{cat.name}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="accent" size="xs" className="mb-3 flex items-center gap-1 w-fit">
              <TrendingUp className="w-3 h-3" /> Trending Now
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">Handpicked items just for you</p>
          </div>
          <Link to={ROUTES.PRODUCTS} className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-medium hover:gap-2.5 transition-all no-underline text-sm whitespace-nowrap">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* ============ DEALS OF THE DAY ============ */}
      {dealProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-surface-900 dark:bg-surface-900 border border-surface-800">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative px-6 py-10 sm:p-12 lg:p-14 z-10">
              <div className="grid lg:grid-cols-12 gap-8 items-center">

                {/* Countdown */}
                <div className="lg:col-span-4 space-y-4">
                  <Badge variant="accent" size="xs">Limited Offer</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight leading-none">
                    Deals of<br />the Day
                  </h2>
                  <p className="text-surface-400 text-sm leading-relaxed">
                    Grab these limited deals before they're gone. Fresh products added daily.
                  </p>

                  <div className="flex gap-2 pt-2">
                    {[
                      { label: 'Hours',   value: pad(timeLeft.hours) },
                      { label: 'Minutes', value: pad(timeLeft.minutes) },
                      { label: 'Seconds', value: pad(timeLeft.seconds) },
                    ].map((unit, i) => (
                      <div key={unit.label} className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                            <span className="text-xl font-semibold text-white font-mono tabular-nums">{unit.value}</span>
                          </div>
                          <p className="text-[10px] text-surface-400 mt-1.5">{unit.label}</p>
                        </div>
                        {i < 2 && <span className="text-xl text-surface-600 font-bold -mt-5">:</span>}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link to={ROUTES.PRODUCTS} className="no-underline">
                      <Button variant="accent" size="md" iconRight={ArrowRight}>
                        View All Deals
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Deal products */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {dealProducts.map((product, i) => (
                      <ProductCard key={product._id} product={product} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ NEW ARRIVALS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="success" size="xs" className="mb-3">Just Landed</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              New Arrivals
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">Fresh products added to our catalog</p>
          </div>
          <Link to={ROUTES.PRODUCTS + '?sort=newest'} className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-medium hover:gap-2.5 transition-all no-underline text-sm whitespace-nowrap">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={newProducts} loading={newLoading} />
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-surface-100 dark:bg-surface-900/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="gold" size="xs" className="mb-3">Testimonials</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-3 max-w-xl mx-auto">
              Real reviews from real shoppers. We're proud to serve thousands of happy customers.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white dark:bg-surface-900 rounded-xl p-8 md:p-12 shadow-sm border border-surface-200 dark:border-surface-800"
            >
              <Quote className="w-8 h-8 text-primary-200 dark:text-primary-900 mb-4" strokeWidth={1.5} />
              <p className="text-lg md:text-xl text-surface-700 dark:text-surface-200 leading-relaxed font-medium font-display">
                "{testimonials[testimonialIdx].text}"
              </p>

              <div className="flex items-center justify-between mt-8 flex-wrap gap-4 pt-6 border-t border-surface-200 dark:border-surface-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-linear-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-semibold">
                    {testimonials[testimonialIdx].avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900 dark:text-white text-sm sm:text-base">{testimonials[testimonialIdx].name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{testimonials[testimonialIdx].role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= testimonials[testimonialIdx].rating ? 'fill-amber-400 text-amber-400' : 'fill-surface-200 dark:fill-surface-800 text-surface-200 dark:text-surface-800'}`}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
                className="p-2 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>

              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === testimonialIdx ? 'w-8 bg-primary-600' : 'w-2 bg-surface-300 dark:bg-surface-700 hover:bg-surface-400'
                  }`}
                />
              ))}

              <button
                onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
                className="p-2 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-surface-900 p-8 sm:p-12 md:p-16 text-center">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
              Ready to start shopping?
            </h2>
            <p className="text-surface-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Join thousands of happy customers and discover amazing products at great prices.
            </p>

            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <Link to={ROUTES.PRODUCTS} className="no-underline">
                <Button variant="accent" size="lg" icon={ShoppingBag}>Explore Products</Button>
              </Link>
              <Link to={ROUTES.REGISTER} className="no-underline">
                <Button variant="secondary" size="lg" className="bg-white/10 text-white hover:bg-white/20 border-white/20">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;