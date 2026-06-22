import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, ArrowRight, Truck, Shield, RotateCcw, Headphones,
  Sparkles, TrendingUp, Star, Quote, ChevronLeft, ChevronRight,
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
  { icon: Truck,       title: 'Free Shipping',     desc: 'On orders over PKR 5,000', color: 'text-emerald-500',  bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: Shield,      title: 'Secure Payment',    desc: '100% secure checkout',     color: 'text-primary-500',  bg: 'bg-primary-50 dark:bg-primary-900/20' },
  { icon: RotateCcw,   title: 'Easy Returns',      desc: '30-day return policy',     color: 'text-amber-500',    bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { icon: Headphones,  title: '24/7 Support',      desc: 'Dedicated help center',    color: 'text-violet-500',   bg: 'bg-violet-50 dark:bg-violet-900/20' },
];

const categories = [
  { name: 'Electronics',   desc: 'Smart gadgets',   icon: '📱', gradient: 'from-blue-600 to-cyan-500' },
  { name: 'Clothing',      desc: 'Trendy fashion',  icon: '👕', gradient: 'from-pink-600 to-rose-500' },
  { name: 'Footwear',      desc: 'Walk in style',   icon: '👟', gradient: 'from-amber-500 to-orange-500' },
  { name: 'Accessories',   desc: 'Complete look',   icon: '⌚', gradient: 'from-violet-600 to-purple-500' },
  { name: 'Home & Garden', desc: 'Cozy spaces',     icon: '🏡', gradient: 'from-emerald-600 to-teal-500' },
  { name: 'Sports',        desc: 'Active life',     icon: '⚽', gradient: 'from-red-600 to-pink-500' },
];

const testimonials = [
  {
    name: 'Ayesha Khan',
    role: 'Verified Buyer',
    avatar: 'AK',
    rating: 5,
    text: 'Absolutely love the quality and fast delivery! The checkout was smooth and the products exceeded my expectations. Will definitely shop again.',
  },
  {
    name: 'Bilal Ahmed',
    role: 'Verified Buyer',
    avatar: 'BA',
    rating: 5,
    text: 'Best online shopping experience in Pakistan. The website is so easy to use, and the customer support team is incredibly helpful. Highly recommended!',
  },
  {
    name: 'Sana Malik',
    role: 'Verified Buyer',
    avatar: 'SM',
    rating: 4,
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
      
      {/* ============ HERO SECTION ============ */}
      <section className="relative hero-gradient overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-14 lg:pb-32 lg:pt-20">
        
        {/* Soft Organic Backlights */}
        <div className="absolute inset-0 opacity-50 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-110 h-110 bg-violet-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl opacity-45 animate-float" style={{ animationDelay: '3s' }} />
        </div>

        {/* Technical Layout Matrix Grid */}
        <div
          className="absolute inset-0 opacity-[0.04] z-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '45px 45px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-white/15 select-none animate-fade-in-up">
                <Sparkles className="w-4.5 h-4.5 text-accent-400 animate-pulse-glow" />
                Exclusive Collection 2026
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white font-display leading-[1.05] tracking-tight text-balance">
                Discover Your{' '}
                <span className="relative inline-block">
                  <span className="gradient-text-animated font-black">Perfect</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 5.5C50 2.5 150 2.5 198 5.5" stroke="var(--color-accent-400)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                Style
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-primary-100/90 mt-6 max-w-xl leading-relaxed font-medium">
                Explore our curated collection of premium products. From cutting-edge electronics to timeless fashion — find everything you need, all in one place.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link to={ROUTES.PRODUCTS} className="no-underline">
                  <Button variant="accent" size="lg" icon={ShoppingBag} className="shadow-brand font-bold uppercase tracking-wider px-7 py-3.5">
                    Shop Now
                  </Button>
                </Link>
                <Link to={ROUTES.PRODUCTS + '?sort=newest'} className="no-underline">
                  <Button variant="glass" size="lg" iconRight={ArrowRight} className="font-bold uppercase tracking-wider px-7 py-3.5">
                    Browse New
                  </Button>
                </Link>
              </div>

              {/* Technical stat layout */}
              <div className="flex flex-wrap gap-x-12 gap-y-4 mt-12 pt-8 border-t border-white/10 select-none">
                {[
                  { value: '10K+', label: 'Delighted Customers' },
                  { value: '500+', label: 'Luxury Products' },
                  { value: '4.9★', label: 'Average Rating' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <p className="text-2xl md:text-3xl font-black text-white font-display tabular-nums leading-none">{stat.value}</p>
                    <p className="text-[10px] font-bold text-primary-200/80 uppercase tracking-widest mt-1.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Curved Divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 60" className="w-full h-12 md:h-16" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" className="fill-surface-50 dark:fill-surface-950" />
          </svg>
        </div>
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-surface-200/50 dark:border-surface-800/40 shadow-premium card-gleam">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 md:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-2 rounded-2xl hover:bg-surface-50/50 dark:hover:bg-surface-900/30 transition-all duration-300 group"
              >
                <div className={`p-3.5 ${feature.bg} rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shrink-0`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <div>
                  <p className="font-extrabold text-surface-900 dark:text-white text-sm tracking-tight">{feature.title}</p>
                  <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORY CARDS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="primary" size="xs" className="mb-3 uppercase tracking-wider font-bold">Browse by Category</Badge>
            <h2 className="text-2xl md:text-4xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">
              Shop by Category
            </h2>
            <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-2">Find exactly what you are looking for</p>
          </div>
          <Link to={ROUTES.PRODUCTS} className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold hover:gap-2.5 transition-all duration-300 no-underline text-xs uppercase tracking-widest whitespace-nowrap">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group block relative aspect-square rounded-3xl overflow-hidden no-underline card-premium hover:shadow-premium-hover border border-surface-200/50 dark:border-surface-800/40"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${cat.gradient} opacity-[0.85] transition-opacity duration-300 group-hover:opacity-95`} />
                <div className="absolute inset-0 bg-surface-950/15 group-hover:bg-surface-950/5 transition-colors" />
                
                {/* Shine Sweep animation on hover */}
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                
                <div className="relative h-full flex flex-col items-center justify-center p-4 text-center select-none">
                  <span className="text-4xl md:text-5xl mb-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shrink-0">{cat.icon}</span>
                  <p className="font-extrabold text-white text-sm md:text-base tracking-tight">{cat.name}</p>
                  <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">{cat.desc}</p>
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
            <Badge variant="accent" size="xs" className="mb-3 uppercase tracking-wider font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Trending Now
            </Badge>
            <h2 className="text-2xl md:text-4xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">
              Featured Products
            </h2>
            <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-2">Handpicked items just for you</p>
          </div>
          <Link to={ROUTES.PRODUCTS} className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold hover:gap-2.5 transition-all duration-300 no-underline text-xs uppercase tracking-widest whitespace-nowrap">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* ============ DEALS OF THE DAY ============ */}
      {dealProducts.length > 0 && (
        <section className="relative bg-surface-900 dark:bg-surface-950 overflow-hidden rounded-3xl max-w-7xl mx-auto">
          {/* Deep Ambient Glows */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-10 left-10 w-80 h-80 bg-accent-500 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative px-6 py-12 sm:p-12 lg:p-16 z-10">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Countdown Dashboard */}
              <div className="lg:col-span-4 space-y-5">
                <Badge variant="accent" size="xs" className="uppercase tracking-wider font-bold">Limited Offer</Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight leading-none">
                  Deals of<br />the Day
                </h2>
                <p className="text-surface-400 text-sm font-semibold leading-relaxed">
                  Grab these limited deals before they are gone. Fresh products added daily.
                </p>

                {/* Digital Clock layout */}
                <div className="flex gap-2.5 pt-2 select-none">
                  {[
                    { label: 'Hours',   value: pad(timeLeft.hours) },
                    { label: 'Minutes', value: pad(timeLeft.minutes) },
                    { label: 'Seconds', value: pad(timeLeft.seconds) },
                  ].map((unit, i) => (
                    <div key={unit.label} className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 bg-white/10 dark:bg-surface-900/60 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 dark:border-white/5 transition-all duration-300 hover:bg-white/15 hover:border-white/20">
                          <span className="text-xl font-bold text-white font-mono tabular-nums tracking-widest">{unit.value}</span>
                        </div>
                        <p className="text-[9px] font-extrabold text-surface-400 uppercase mt-2 tracking-widest">{unit.label}</p>
                      </div>
                      {i < 2 && <span className="text-xl text-surface-600 font-bold -mt-6 animate-pulse">:</span>}
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link to={ROUTES.PRODUCTS} className="no-underline">
                    <Button variant="accent" size="md" iconRight={ArrowRight} className="font-bold uppercase tracking-wider shadow-brand">
                      View All Deals
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Product Grid showcase */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {dealProducts.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
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
            <Badge variant="success" size="xs" className="mb-3 uppercase tracking-wider font-bold">Just Landed</Badge>
            <h2 className="text-2xl md:text-4xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">
              New Arrivals
            </h2>
            <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-2">Fresh products added to our catalog</p>
          </div>
          <Link to={ROUTES.PRODUCTS + '?sort=newest'} className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold hover:gap-2.5 transition-all duration-300 no-underline text-xs uppercase tracking-widest whitespace-nowrap">
            View All Arrivals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={newProducts} loading={newLoading} />
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-surface-100 dark:bg-surface-900/40 relative overflow-hidden py-16">
        
        {/* Soft Background Globs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary-400/10 dark:bg-primary-950/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-400/10 dark:bg-accent-950/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="gold" size="xs" className="mb-3 uppercase tracking-wider font-bold">Testimonials</Badge>
            <h2 className="text-2xl md:text-4xl font-black text-surface-900 dark:text-white font-display tracking-tight leading-none">
              What Our Customers Say
            </h2>
            <p className="text-sm font-semibold text-surface-500 dark:text-surface-400 mt-3 max-w-xl mx-auto leading-relaxed">
              Real reviews from real shoppers. We are proud to serve thousands of happy customers.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-premium rounded-3xl p-8 md:p-12 shadow-premium card-gleam"
              >
                <Quote className="w-10 h-10 text-primary-200 dark:text-primary-800/40 mb-5" />
                <p className="text-lg md:text-xl text-surface-700 dark:text-surface-200 leading-relaxed font-bold font-display">
                  "{testimonials[testimonialIdx].text}"
                </p>
                
                <div className="flex items-center justify-between mt-8 flex-wrap gap-4 pt-6 border-t border-surface-200/40 dark:border-surface-800/30">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md select-none">
                      {testimonials[testimonialIdx].avatar}
                    </div>
                    <div>
                      <p className="font-bold text-surface-900 dark:text-white text-sm sm:text-base">{testimonials[testimonialIdx].name}</p>
                      <p className="text-2xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest mt-0.5">{testimonials[testimonialIdx].role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 select-none">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= testimonials[testimonialIdx].rating ? 'fill-amber-400 text-amber-400' : 'text-surface-200 dark:text-surface-800'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Carousel Dot & Button Controls */}
            <div className="flex items-center justify-center gap-3 mt-8 select-none">
              <button
                onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
                className="p-2.5 rounded-full bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/40 hover:bg-surface-50 dark:hover:bg-surface-800 hover:-translate-x-0.5 transition-all duration-200 cursor-pointer shadow-xs"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
              
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-350 cursor-pointer ${
                    i === testimonialIdx ? 'w-8 bg-primary-600' : 'w-2 bg-surface-300 dark:bg-surface-800 hover:bg-surface-400'
                  }`}
                />
              ))}
              
              <button
                onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
                className="p-2.5 rounded-full bg-white dark:bg-surface-900 border border-surface-200/50 dark:border-surface-800/40 hover:bg-surface-50 dark:hover:bg-surface-800 hover:translate-x-0.5 transition-all duration-200 cursor-pointer shadow-xs"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-surface-600 dark:text-surface-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ JOIN CALL TO ACTION ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 sm:p-12 md:p-16 text-center shadow-premium card-gleam">
          {/* Subtle Ambient Backlights */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent-400 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          </div>
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight leading-none">
              Ready to Start Shopping?
            </h2>
            <p className="text-primary-100/90 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Join thousands of happy customers and discover amazing products at great prices.
            </p>
            
            <div className="flex flex-wrap gap-3.5 justify-center pt-4">
              <Link to={ROUTES.PRODUCTS} className="no-underline">
                <Button variant="accent" size="lg" icon={ShoppingBag} className="font-bold uppercase tracking-wider px-7 py-3 shadow-brand">Explore Products</Button>
              </Link>
              <Link to={ROUTES.REGISTER} className="no-underline">
                <Button variant="glass" size="lg" className="font-bold uppercase tracking-wider px-7 py-3">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;