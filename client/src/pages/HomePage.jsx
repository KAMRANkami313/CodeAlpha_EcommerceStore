import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  { name: 'Electronics',   desc: 'Smart gadgets',   icon: '📱', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Clothing',      desc: 'Trendy fashion',  icon: '👕', gradient: 'from-pink-500 to-rose-500' },
  { name: 'Footwear',      desc: 'Walk in style',   icon: '👟', gradient: 'from-amber-500 to-orange-500' },
  { name: 'Accessories',   desc: 'Complete look',   icon: '⌚', gradient: 'from-violet-500 to-purple-500' },
  { name: 'Home & Garden', desc: 'Cozy spaces',     icon: '🏡', gradient: 'from-emerald-500 to-teal-500' },
  { name: 'Sports',        desc: 'Active life',     icon: '⚽', gradient: 'from-red-500 to-pink-500' },
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

  // Countdown timer
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

  // Testimonial auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const dealProducts = featuredProducts.slice(0, 4);

  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section className="relative hero-gradient overflow-hidden">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-accent-400 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-accent-400" />
                New Collection 2026
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white font-display leading-[1.05] tracking-tight text-balance">
                Discover Your{' '}
                <span className="relative inline-block">
                  <span className="gradient-text">Perfect</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 5.5C50 2.5 150 2.5 198 5.5" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                Style
              </h1>

              <p className="text-lg md:text-xl text-primary-100 mt-6 max-w-xl leading-relaxed">
                Explore our curated collection of premium products. From cutting-edge electronics to timeless fashion — find everything you need, all in one place.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link to={ROUTES.PRODUCTS} className="no-underline">
                  <Button variant="accent" size="lg" icon={ShoppingBag} className="shadow-large">
                    Shop Now
                  </Button>
                </Link>
                <Link to={ROUTES.PRODUCTS + '?sort=newest'} className="no-underline">
                  <Button variant="glass" size="lg" iconRight={ArrowRight}>
                    Browse Collection
                  </Button>
                </Link>
              </div>

              {/* Hero stats */}
              <div className="flex flex-wrap gap-x-8 gap-y-4 mt-12 pt-8 border-t border-white/10">
                {[
                  { value: '10K+', label: 'Happy Customers' },
                  { value: '500+', label: 'Products' },
                  { value: '4.9★', label: 'Avg Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl md:text-3xl font-bold text-white font-display">{stat.value}</p>
                    <p className="text-xs text-primary-200 uppercase tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-12 md:h-16" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" className="fill-surface-50 dark:fill-surface-950" />
          </svg>
        </div>
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="bg-surface-50 dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white dark:hover:bg-surface-900 transition-colors"
              >
                <div className={`p-3 ${feature.bg} rounded-xl`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <div>
                  <p className="font-bold text-surface-800 dark:text-white text-sm">{feature.title}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORY CARDS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="primary" size="xs" className="mb-3">Browse by category</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              Shop by Category
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2">Find exactly what you're looking for</p>
          </div>
          <Link to={ROUTES.PRODUCTS} className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold hover:gap-2.5 transition-all no-underline text-sm whitespace-nowrap">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group block relative aspect-square rounded-2xl overflow-hidden no-underline card-hover hover:shadow-large border border-surface-200 dark:border-surface-800"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${cat.gradient} opacity-90`} />
                <div className="absolute inset-0 bg-surface-950/20 group-hover:bg-surface-950/10 transition-colors" />
                <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                  <span className="text-4xl md:text-5xl mb-2 transition-transform group-hover:scale-110">{cat.icon}</span>
                  <p className="font-bold text-white text-sm md:text-base">{cat.name}</p>
                  <p className="text-2xs text-white/80 mt-0.5">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="accent" size="xs" className="mb-3"><TrendingUp className="w-3 h-3" /> Trending now</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              Featured Products
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2">Handpicked items just for you</p>
          </div>
          <Link to={ROUTES.PRODUCTS} className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold hover:gap-2.5 transition-all no-underline text-sm whitespace-nowrap">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* ============ DEALS OF THE DAY ============ */}
      {dealProducts.length > 0 && (
        <section className="relative bg-surface-900 dark:bg-surface-950 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-accent-500 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left: heading + countdown */}
              <div className="lg:col-span-3">
                <Badge variant="accent" size="xs" className="mb-3">Limited time</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
                  Deals of<br />the Day
                </h2>
                <p className="text-surface-400 mt-3 text-sm leading-relaxed">
                  Grab these deals before they're gone. New deals every day at midnight.
                </p>

                {/* Countdown */}
                <div className="mt-6 flex gap-2">
                  {[
                    { label: 'Hours',   value: pad(timeLeft.hours) },
                    { label: 'Minutes', value: pad(timeLeft.minutes) },
                    { label: 'Seconds', value: pad(timeLeft.seconds) },
                  ].map((unit, i) => (
                    <div key={unit.label} className="flex items-center gap-2">
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                          <span className="text-xl font-bold text-white font-mono">{unit.value}</span>
                        </div>
                        <p className="text-2xs text-surface-500 uppercase mt-1.5 tracking-wider">{unit.label}</p>
                      </div>
                      {i < 2 && <span className="text-xl text-surface-600 -mt-4">:</span>}
                    </div>
                  ))}
                </div>

                <Link to={ROUTES.PRODUCTS} className="no-underline mt-6 inline-block">
                  <Button variant="accent" size="md" iconRight={ArrowRight}>View All Deals</Button>
                </Link>
              </div>

              {/* Right: product grid */}
              <div className="lg:col-span-9">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="success" size="xs" className="mb-3">Just landed</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              New Arrivals
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2">Fresh products added to our catalog</p>
          </div>
          <Link to={ROUTES.PRODUCTS + '?sort=newest'} className="hidden sm:flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold hover:gap-2.5 transition-all no-underline text-sm whitespace-nowrap">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={newProducts} loading={newLoading} />
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-surface-100 dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <Badge variant="gold" size="xs" className="mb-3">Testimonials</Badge>
            <h2 className="text-2xl md:text-4xl font-bold text-surface-900 dark:text-white font-display tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2 max-w-xl mx-auto">
              Real reviews from real shoppers. We're proud to serve thousands of happy customers.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-surface-800 rounded-3xl shadow-large border border-surface-200 dark:border-surface-700 p-8 md:p-12"
              >
                <Quote className="w-10 h-10 text-primary-200 dark:text-primary-800 mb-4" />
                <p className="text-lg md:text-xl text-surface-700 dark:text-surface-200 leading-relaxed font-medium">
                  "{testimonials[testimonialIdx].text}"
                </p>
                <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-bold">
                      {testimonials[testimonialIdx].avatar}
                    </div>
                    <div>
                      <p className="font-bold text-surface-900 dark:text-white">{testimonials[testimonialIdx].name}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{testimonials[testimonialIdx].role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= testimonials[testimonialIdx].rating ? 'fill-amber-400 text-amber-400' : 'text-surface-300 dark:text-surface-700'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Carousel controls */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
                className="p-2 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-surface-600 dark:text-surface-300" />
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
                className="p-2 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER CTA ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl hero-gradient p-8 md:p-16 text-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent-400 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
              Ready to Start Shopping?
            </h2>
            <p className="text-primary-100 max-w-md mx-auto mt-3 mb-8">
              Join thousands of happy customers and discover amazing products at great prices.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to={ROUTES.PRODUCTS} className="no-underline">
                <Button variant="accent" size="lg" icon={ShoppingBag}>Explore Products</Button>
              </Link>
              <Link to={ROUTES.REGISTER} className="no-underline">
                <Button variant="glass" size="lg">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;