import { ShoppingBag, Github, Linkedin, Twitter } from 'lucide-react';
import ROUTES from '../../constants/ROUTES.js';

const Footer = () => {
  return (
    <footer className="bg-surface-900 text-surface-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Shop<span className="text-primary-400">Verse</span>
              </span>
            </div>
            <p className="text-surface-400 max-w-sm leading-relaxed">
              Your one-stop destination for premium products. Shop with confidence and enjoy seamless experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href={ROUTES.HOME} className="hover:text-primary-400 transition-colors no-underline text-surface-400">Home</a></li>
              <li><a href={ROUTES.PRODUCTS} className="hover:text-primary-400 transition-colors no-underline text-surface-400">Products</a></li>
              <li><a href={ROUTES.CART} className="hover:text-primary-400 transition-colors no-underline text-surface-400">Cart</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a href="https://github.com/KAMRANkami313" target="_blank" rel="noreferrer" className="p-2 bg-surface-800 rounded-lg hover:bg-primary-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/muhammad-kamran-aa7620296" target="_blank" rel="noreferrer" className="p-2 bg-surface-800 rounded-lg hover:bg-primary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-surface-800 text-center text-sm text-surface-500">
          <p>&copy; {new Date().getFullYear()} ShopVerse. Built with passion by Muhammad Kamran.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;