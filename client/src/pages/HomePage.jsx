import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import { useCart } from '../hooks/useCart.js';
import useProducts from '../hooks/useProducts.js';
import ProductCard from '../components/product/ProductCard.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over PKR 5,000' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated help center' },
];

const HomePage = () => {
  const { fetchCart } = useCart();
  const { products: featuredProducts, loading } = useProducts({ featured: 'true', limit: 8 });

  useEffect(() => { fetchCart(); }, [fetchCart]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6">
                New Collection 2026
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                Discover Your <span className="text-accent-400">Perfect</span> Style
              </h1>
              <p className="text-lg text-primary-100 mt-4 max-w-lg leading-relaxed">
                Explore our curated collection of premium products. From electronics to fashion, find everything you need.
              </p>
              <div className="flex gap-4 mt-8">
                <Link to={ROUTES.PRODUCTS} className="no-underline">
                  <Button variant="accent" size="lg" icon={ShoppingBag}>Shop Now</Button>
                </Link>
                <Link to={ROUTES.PRODUCTS} className="no-underline">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">Browse Collection</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-50 rounded-xl"><feature.icon className="w-5 h-5 text-primary-600" /></div>
                <div>
                  <p className="font-semibold text-surface-800 text-sm">{feature.title}</p>
                  <p className="text-xs text-surface-500">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900">Featured Products</h2>
            <p className="text-surface-500 mt-1">Handpicked items just for you</p>
          </div>
          <Link to={ROUTES.PRODUCTS} className="flex items-center gap-1 text-primary-600 font-semibold hover:gap-2 transition-all no-underline text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* CTA Banner */}
      <section className="bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-surface-400 max-w-md mx-auto mb-8">Join thousands of happy customers and discover amazing products at great prices.</p>
          <Link to={ROUTES.PRODUCTS} className="no-underline">
            <Button variant="accent" size="lg" icon={ShoppingBag}>Explore Products</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;